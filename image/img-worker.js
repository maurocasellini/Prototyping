/* Image engine (module worker): HEIC decoding (libheif), encoding with the Squoosh codecs
   (MozJPEG, WebP, AVIF, OxiPNG) and background removal (IS-Net via ONNX Runtime).
   Everything runs locally; the files come from this site. */
const V = './vendor/';
const mods = {};
const lazy = (name, path) => (mods[name] ||= import(V + path));

// ---------- HEIC / HEIF (iPhone photos) → RGBA
async function decodeHeic(buf) {
  const factory = (await lazy('heif', 'libheif/libheif-bundle.mjs')).default;
  const lib = await (mods.heifLib ||= Promise.resolve(factory()));
  const decoder = new lib.HeifDecoder();
  const images = decoder.decode(new Uint8Array(buf));
  if (!images || !images.length) throw new Error('HEIC-Datei konnte nicht gelesen werden.');
  const img = images[0];
  const width = img.get_width(), height = img.get_height();
  const data = await new Promise((res, rej) => {
    img.display({ data: new Uint8ClampedArray(width * height * 4), width, height }, (d) => (d ? res(d) : rej(new Error('HEIC-Datei konnte nicht gelesen werden.'))));
  });
  images.forEach((i) => i.free && i.free());
  return { data: data.data, width, height };
}

// ---------- Encoding
async function encode({ data, width, height, format, quality }) {
  const img = new ImageData(new Uint8ClampedArray(data.buffer || data), width, height);
  if (format === 'jpeg') return (await lazy('jpeg', 'jsquash/jpeg/encode.js')).default(img, { quality, progressive: true, optimize_coding: true });
  if (format === 'webp') return (await lazy('webp', 'jsquash/webp/encode.js')).default(img, { quality, method: 4 });
  if (format === 'avif') return (await lazy('avif', 'jsquash/avif/encode.js')).default(img, { quality, speed: 7 });
  if (format === 'png') return (await lazy('png', 'jsquash/oxipng/optimise.js')).default(img, { level: 2, optimiseAlpha: true });
  throw new Error('Unbekanntes Format');
}

// ---------- Background removal (IS-Net, 1024×1024 input → alpha mask)
let session = null;
async function getSession(onProgress) {
  if (session) return session;
  const ort = await lazy('ort', 'ort/ort.wasm.min.mjs');
  ort.env.wasm.wasmPaths = new URL(V + 'ort/', self.location.href).href;
  ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1)) : 1;
  const res = await fetch(V + 'models/isnet-small.onnx');
  const total = +res.headers.get('content-length') || 44342436;
  const reader = res.body.getReader();
  const buf = new Uint8Array(total);
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (got + value.length > buf.length) throw new Error('Modell unvollständig');
    buf.set(value, got);
    got += value.length;
    onProgress(got / total);
  }
  session = await ort.InferenceSession.create(buf.subarray(0, got), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  session.ort = ort;
  return session;
}

async function removeBg({ data, width, height }) {
  // the caller sends the photo already scaled to 1024×1024
  const s = await getSession((p) => self.postMessage({ type: 'progress', p }));
  const N = 1024 * 1024;
  const input = new Float32Array(3 * N);
  for (let i = 0, j = 0; i < N; i++, j += 4) {
    input[i] = (data[j] - 128) / 256;
    input[i + N] = (data[j + 1] - 128) / 256;
    input[i + 2 * N] = (data[j + 2] - 128) / 256;
  }
  const out = await s.run({ input: new s.ort.Tensor('float32', input, [1, 3, 1024, 1024]) });
  const m = out.output.data;
  const mask = new Uint8ClampedArray(N);
  for (let i = 0; i < N; i++) mask[i] = m[i] * 255;
  return { mask, width: 1024, height: 1024 };
}

self.onmessage = async (e) => {
  const { id, cmd, args } = e.data;
  try {
    let res, transfer = [];
    if (cmd === 'heic') { res = await decodeHeic(args.buf); transfer = [res.data.buffer]; }
    else if (cmd === 'encode') { res = await encode(args); transfer = [res]; }
    else if (cmd === 'removeBg') { res = await removeBg(args); transfer = [res.mask.buffer]; }
    else if (cmd === 'warm') { await getSession((p) => self.postMessage({ type: 'progress', p })); res = true; }
    self.postMessage({ id, ok: true, res }, transfer);
  } catch (err) {
    self.postMessage({ id, ok: false, error: String((err && err.message) || err) });
  }
};
