/* Image processing for the scanner (runs in a web worker, OpenCV.js / WebAssembly).
   OpenCV’s JS bindings need eval(), so only this worker’s CSP allows 'unsafe-eval' (see vercel.json);
   like the page, it still cannot connect to any other server.
   - detect: finds the four corners of the sheet of paper in a photo
   - process: straightens the sheet (perspective correction) and applies the scan look */
let cvReady = null;

function loadCV() {
  if (!cvReady) {
    cvReady = (async () => {
      importScripts('vendor/opencv.js');
      let c = self.cv;
      if (c instanceof Promise || (c && typeof c.then === 'function')) c = await c;
      else if (!c.Mat) await new Promise((r) => { c.onRuntimeInitialized = r; });
      self.cv = c;
      return c;
    })();
  }
  return cvReady;
}

// ---------- Corner detection
function orderCorners(pts) {
  // top-left has the smallest x+y, bottom-right the largest; top-right the smallest y-x
  const bySum = [...pts].sort((a, b) => (a.x + a.y) - (b.x + b.y));
  const byDiff = [...pts].sort((a, b) => (a.y - a.x) - (b.y - b.x));
  return [bySum[0], byDiff[0], bySum[3], byDiff[3]];
}

function polyArea(p) {
  let s = 0;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a.x * b.y - b.x * a.y; }
  return Math.abs(s) / 2;
}

function isConvexQuad(p) {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const a = p[i], b = p[(i + 1) % 4], c = p[(i + 2) % 4];
    const z = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (z === 0) return false;
    if (!sign) sign = Math.sign(z); else if (Math.sign(z) !== sign) return false;
  }
  return true;
}

// Reduce a contour to four corners: approxPolyDP with growing tolerance
function quadFromContour(cv, cnt) {
  const hull = new cv.Mat();
  cv.convexHull(cnt, hull, false, true);
  const peri = cv.arcLength(hull, true);
  let best = null;
  for (const f of [0.01, 0.02, 0.03, 0.045, 0.06, 0.08]) {
    const ap = new cv.Mat();
    cv.approxPolyDP(hull, ap, f * peri, true);
    const n = ap.rows;
    if (n === 4) {
      const pts = [];
      for (let i = 0; i < 4; i++) pts.push({ x: ap.data32S[i * 2], y: ap.data32S[i * 2 + 1] });
      ap.delete();
      best = pts;
      break;
    }
    ap.delete();
    if (n < 4) break;
  }
  hull.delete();
  return best;
}

function candidatesFrom(cv, bin, minArea, maxArea, out) {
  const contours = new cv.MatVector();
  const hier = new cv.Mat();
  cv.findContours(bin, contours, hier, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  const list = [];
  for (let i = 0; i < contours.size(); i++) {
    const c = contours.get(i);
    const hullA = (() => { const h = new cv.Mat(); cv.convexHull(c, h, false, true); const a = cv.contourArea(h); h.delete(); return a; })();
    if (hullA >= minArea && hullA <= maxArea) list.push({ c, a: hullA }); else c.delete();
  }
  list.sort((a, b) => b.a - a.a);
  for (const { c } of list.slice(0, 6)) {
    const q = quadFromContour(cv, c);
    if (q && isConvexQuad(orderCorners(q))) {
      const area = polyArea(orderCorners(q));
      if (area >= minArea && area <= maxArea) out.push({ q: orderCorners(q), area });
    }
  }
  list.forEach(({ c }) => c.delete());
  contours.delete(); hier.delete();
}

async function detect({ data, width, height }) {
  const cv = await loadCV();
  const src = cv.matFromImageData(new ImageData(new Uint8ClampedArray(data), width, height));
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
  const imgArea = width * height;
  const minArea = imgArea * 0.12, maxArea = imgArea * 0.985;
  const found = [];
  const k = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));

  // A) edges
  for (const [lo, hi] of [[30, 90], [60, 160]]) {
    const edges = new cv.Mat();
    cv.Canny(gray, edges, lo, hi);
    cv.dilate(edges, edges, k);
    candidatesFrom(cv, edges, minArea, maxArea, found);
    edges.delete();
  }
  // B) bright sheet on darker background
  {
    const bin = new cv.Mat();
    cv.threshold(gray, bin, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.morphologyEx(bin, bin, cv.MORPH_CLOSE, k);
    candidatesFrom(cv, bin, minArea, maxArea, found);
    bin.delete();
  }
  k.delete(); gray.delete(); src.delete();

  if (!found.length) return { corners: null };
  found.sort((a, b) => b.area - a.area);
  return { corners: found[0].q.map((p) => ({ x: p.x / width, y: p.y / height })) };
}

// ---------- Straighten + scan look
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

// Even out shadows and uneven light: divide by a blurred “paper” background
function flatten(cv, plane) {
  const small = new cv.Mat();
  const scale = 0.25;
  cv.resize(plane, small, new cv.Size(0, 0), scale, scale, cv.INTER_AREA);
  const k = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  cv.dilate(small, small, k);           // remove text, keep paper
  cv.medianBlur(small, small, 15);
  const bg = new cv.Mat();
  cv.resize(small, bg, plane.size(), 0, 0, cv.INTER_LINEAR);
  const out = new cv.Mat();
  cv.divide(plane, bg, out, 255);
  small.delete(); k.delete(); bg.delete();
  return out;
}

function contrast(cv, m, gain, bias) { m.convertTo(m, -1, gain, bias); }

async function process({ data, width, height, corners, filter, rotate, maxSide }) {
  const cv = await loadCV();
  const src = cv.matFromImageData(new ImageData(new Uint8ClampedArray(data), width, height));
  const P = corners.map((p) => ({ x: p.x * width, y: p.y * height }));
  let w = Math.max(dist(P[0], P[1]), dist(P[3], P[2]));
  let h = Math.max(dist(P[0], P[3]), dist(P[1], P[2]));
  // Edge lengths only estimate the real proportions (perspective): snap to A4 / US Letter when close
  const long = Math.max(w, h), short = Math.min(w, h), r = long / short;
  for (const [ratio, tol] of [[Math.SQRT2, 0.1], [11 / 8.5, 0.04]]) {
    if (Math.abs(r / ratio - 1) < tol) {
      if (w < h) w = h / ratio; else h = w / ratio;
      if (Math.max(w, h) < long) { const k = long / Math.max(w, h); w *= k; h *= k; }
      break;
    }
  }
  const s = Math.min(1, maxSide / Math.max(w, h));
  w = Math.max(16, Math.round(w * s)); h = Math.max(16, Math.round(h * s));

  const from = cv.matFromArray(4, 1, cv.CV_32FC2, P.flatMap((p) => [p.x, p.y]));
  const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
  const M = cv.getPerspectiveTransform(from, to);
  const warped = new cv.Mat();
  cv.warpPerspective(src, warped, M, new cv.Size(w, h), cv.INTER_CUBIC, cv.BORDER_REPLICATE);
  from.delete(); to.delete(); M.delete(); src.delete();

  let out;
  if (filter === 'color') {
    const rgb = new cv.Mat();
    cv.cvtColor(warped, rgb, cv.COLOR_RGBA2RGB);
    const planes = new cv.MatVector();
    cv.split(rgb, planes);
    const flat = new cv.MatVector();
    for (let i = 0; i < 3; i++) { const p = planes.get(i); const f = flatten(cv, p); contrast(cv, f, 1.12, -14); flat.push_back(f); p.delete(); f.delete(); }
    out = new cv.Mat();
    cv.merge(flat, out);
    cv.cvtColor(out, out, cv.COLOR_RGB2RGBA);
    planes.delete(); flat.delete(); rgb.delete();
  } else if (filter === 'gray' || filter === 'bw') {
    const g = new cv.Mat();
    cv.cvtColor(warped, g, cv.COLOR_RGBA2GRAY);
    const f = flatten(cv, g);
    g.delete();
    if (filter === 'gray') contrast(cv, f, 1.15, -18);
    else {
      const block = Math.max(15, (Math.round(Math.max(w, h) / 70) | 1));
      cv.adaptiveThreshold(f, f, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, block, 12);
    }
    out = new cv.Mat();
    cv.cvtColor(f, out, cv.COLOR_GRAY2RGBA);
    f.delete();
  } else {
    out = warped.clone();
  }
  warped.delete();

  if (rotate) {
    const code = { 90: cv.ROTATE_90_CLOCKWISE, 180: cv.ROTATE_180, 270: cv.ROTATE_90_COUNTERCLOCKWISE }[rotate];
    cv.rotate(out, out, code);
  }
  const result = { width: out.cols, height: out.rows, data: new Uint8ClampedArray(out.data) };
  out.delete();
  return result;
}

self.onmessage = async (e) => {
  const { id, cmd, args } = e.data;
  try {
    let res;
    if (cmd === 'load') { await loadCV(); res = true; }
    else if (cmd === 'detect') res = await detect(args);
    else if (cmd === 'process') res = await process(args);
    const transfer = res && res.data ? [res.data.buffer] : [];
    self.postMessage({ id, ok: true, res }, transfer);
  } catch (err) {
    self.postMessage({ id, ok: false, error: String((err && err.message) || err) });
  }
};
