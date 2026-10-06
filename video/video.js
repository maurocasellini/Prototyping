/* Video Toolkit: trim, shrink (H.264/AAC MP4), GIF, MP3, mute – FFmpeg (WebAssembly) in a worker.
   The input file is mounted read-only into FFmpeg (no copy in memory); nothing leaves the device. */
const { $, toast, download, share, fmtSize } = window.CMV;
const t = (s) => window.i18n(s);

let file = null, info = { duration: 0, w: 0, h: 0 }, result = null, running = false, action = 'shrink';
let ffmpeg = null, logs = [];

// ---------------------------------------------------------------- FFmpeg
async function engine(onLoad) {
  if (ffmpeg) return ffmpeg;
  onLoad && onLoad();
  const { FFmpeg } = await import('./vendor/ffmpeg/index.js');
  const f = new FFmpeg();
  f.on('log', ({ message }) => { logs.push(message); if (logs.length > 400) logs.shift(); onLog(message); });
  const base = new URL('./vendor/ffmpeg/core/', location.href).href;
  await f.load({ coreURL: base + 'ffmpeg-core.js', wasmURL: base + 'ffmpeg-core.wasm' });
  await f.createDir('/in');
  ffmpeg = f;
  return f;
}
let onLog = () => {};
const secs = (h, m, s) => +h * 3600 + +m * 60 + +s;

let mounted = false;
async function mount(f) {
  if (mounted) { await f.unmount('/in').catch(() => {}); mounted = false; }
  await f.mount('WORKERFS', { files: [file] }, '/in');
  mounted = true;
  return '/in/' + file.name;
}

// Duration/size via FFmpeg when the browser cannot read the file (e.g. HEVC .mov in Chrome)
async function probe() {
  const f = await engine();
  const input = await mount(f);
  logs = [];
  await f.exec(['-hide_banner', '-i', input]).catch(() => {});
  const all = logs.join('\n');
  const d = all.match(/Duration: (\d+):(\d+):([\d.]+)/);
  const v = all.match(/Video:.*?(\d{2,5})x(\d{2,5})/);
  return { duration: d ? secs(d[1], d[2], d[3]) : 0, w: v ? +v[1] : 0, h: v ? +v[2] : 0, audio: /Audio:/.test(all) };
}

// ---------------------------------------------------------------- Loading a video
async function useFile(f) {
  file = f; result = null;
  $('#v-name').textContent = f.name;
  $('#v-meta').textContent = fmtSize(f.size);
  $('#result').classList.add('hidden');
  const p = $('#player');
  if (p.src) URL.revokeObjectURL(p.src);
  p.src = URL.createObjectURL(f);
  show('work');
  info = await new Promise((res) => {
    const done = () => res({ duration: isFinite(p.duration) ? p.duration : 0, w: p.videoWidth, h: p.videoHeight });
    p.onloadedmetadata = done;
    p.onerror = () => res({ duration: 0, w: 0, h: 0 });
    setTimeout(done, 4000);
  });
  if (!info.duration || !info.w) {
    $('#v-meta').textContent = `${fmtSize(f.size)} · ${t('wird analysiert …')}`;
    try { info = await probe(); } catch { /* keep zeros */ }
  }
  $('#v-meta').textContent = [fmtSize(f.size), info.duration ? fmtTime(info.duration) : '', info.w ? `${info.w}×${info.h}` : ''].filter(Boolean).join(' · ');
  for (const id of ['#t-start', '#t-end']) $(id).max = info.duration || 0;
  $('#t-start').value = 0;
  $('#t-end').value = info.duration || 0;
  showTrim();
}
document.querySelectorAll('[data-pick]').forEach((inp) => inp.addEventListener('change', () => { if (inp.files[0]) useFile(inp.files[0]); inp.value = ''; }));
const drop = $('#drop');
['dragenter', 'dragover'].forEach((ev) => document.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => document.addEventListener(ev, (e) => { e.preventDefault(); if (ev === 'drop' || !e.relatedTarget) drop.classList.remove('over'); }));
document.addEventListener('drop', (e) => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) useFile(f); });

function show(id) { for (const v of ['start', 'work', 'about']) $('#' + v).classList.toggle('hidden', v !== id); }
function route() { if (location.hash === '#about') { show('about'); window.scrollTo(0, 0); } else show(file ? 'work' : 'start'); }
window.addEventListener('hashchange', route);

const fmtTime = (s) => {
  s = Math.max(0, s);
  const m = Math.floor(s / 60), sec = s - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, '0')}`;
};

// ---------------------------------------------------------------- Trim
const range = () => {
  const a = +$('#t-start').value, b = +$('#t-end').value;
  return [Math.min(a, b), Math.max(a, b)];
};
function showTrim() {
  const [a, b] = range();
  $('#trim-out').textContent = `${fmtTime(a)} – ${fmtTime(b)} (${fmtTime(b - a)})`;
}
$('#t-start').addEventListener('input', () => { showTrim(); $('#player').currentTime = +$('#t-start').value; });
$('#t-end').addEventListener('input', () => { showTrim(); $('#player').currentTime = +$('#t-end').value; });
document.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => {
  $('#t-' + b.dataset.set).value = $('#player').currentTime;
  showTrim();
}));

// ---------------------------------------------------------------- Options
document.querySelectorAll('#action button').forEach((b) => b.addEventListener('click', () => {
  action = b.dataset.v;
  document.querySelectorAll('#action button').forEach((x) => x.classList.toggle('active', x === b));
  $('#opt-shrink').hidden = action !== 'shrink';
  $('#opt-gif').hidden = action !== 'gif';
}));
$('#target').addEventListener('change', () => { if ($('#target').value === 'small') $('#res').value = '480'; });

// output size: shorter side = res (keeps portrait videos upright), even numbers for H.264
function scaled(res) {
  if (!res || !info.w || Math.min(info.w, info.h) <= res) return null;
  const s = res / Math.min(info.w, info.h);
  return [Math.round((info.w * s) / 2) * 2, Math.round((info.h * s) / 2) * 2];
}

function command(input) {
  const [a, b] = range();
  const full = !info.duration || (a <= 0.05 && b >= info.duration - 0.05);
  const cut = full ? [] : ['-ss', a.toFixed(2), '-to', b.toFixed(2)];
  const dur = (full ? info.duration : b - a) || 1;
  const base = file.name.replace(/\.[^.]+$/, '');
  const head = ['-hide_banner', ...cut, '-i', input];
  if (action === 'gif') {
    const w = +$('#gif-w').value, fps = +$('#gif-fps').value;
    return { dur, out: `${base}.gif`, type: 'image/gif',
      args: [...head, '-vf', `fps=${fps},scale=${w}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`, '-loop', '0', 'out.gif'] };
  }
  if (action === 'mp3') {
    return { dur, out: `${base}.mp3`, type: 'audio/mpeg', args: [...head, '-vn', '-c:a', 'libmp3lame', '-b:a', '192k', 'out.mp3'] };
  }
  if (action === 'mute') {
    const ext = (file.name.match(/\.(mp4|mov|m4v|webm|mkv)$/i) || [, 'mp4'])[1].toLowerCase();
    return { dur, out: `${base} (ohne Ton).${ext}`, type: file.type || 'video/mp4', args: [...head, '-an', '-c:v', 'copy', `out.${ext}`] };
  }
  // shrink → H.264 / AAC MP4
  const target = $('#target').value;
  const size = scaled(+$('#res').value);
  const v = ['-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-profile:v', 'high'];
  let aBit = 128;
  if (target === 'whatsapp' || target === 'email') {
    const limit = (target === 'whatsapp' ? 16 : 20) * 1024 * 1024 * 0.92;
    aBit = 96;
    const vBit = Math.floor((limit * 8) / dur / 1000 - aBit);
    if (vBit < 120) throw new Error(t('Der Ausschnitt ist für diese Grösse zu lang – bitte kürzen.'));
    v.push('-b:v', `${vBit}k`, '-maxrate', `${Math.round(vBit * 1.3)}k`, '-bufsize', `${vBit * 2}k`);
  } else {
    v.push('-crf', target === 'small' ? '30' : '24');
    if (target === 'small') aBit = 80;
  }
  return { dur, out: `${base} (klein).mp4`, type: 'video/mp4',
    args: [...head, ...(size ? ['-vf', `scale=${size[0]}:${size[1]}`] : []), ...v, '-c:a', 'aac', '-b:a', `${aBit}k`, '-movflags', '+faststart', 'out.mp4'] };
}

// ---------------------------------------------------------------- Run
function progress(label, frac) {
  window.CMV.busy(label, frac);
}

$('#go').addEventListener('click', async () => {
  if (running || !file) return;
  running = true;
  $('#result').classList.add('hidden');
  try {
    const f = await engine(() => progress(t('Video-Engine wird geladen (ca. 32 MB) …'), null));
    const input = await mount(f);
    const job = command(input);
    const started = performance.now();
    onLog = (m) => {
      const tm = m.match(/time=(\d+):(\d+):([\d.]+)/);
      if (!tm) return;
      const p = Math.min(1, secs(tm[1], tm[2], tm[3]) / job.dur);
      const el = (performance.now() - started) / 1000;
      const eta = p > 0.03 ? ` · ${t('noch ca.')} ${fmtTime((el / p) * (1 - p))}` : '';
      progress(`${t('Wird umgewandelt …')} ${Math.round(p * 100)} %${eta}`, p);
    };
    progress(t('Wird umgewandelt …'), 0);
    logs = [];
    const code = await f.exec(job.args);
    const outName = job.args[job.args.length - 1];
    let data;
    try { data = await f.readFile(outName); } catch { data = null; }
    if (code !== 0 || !data || !data.length) {
      console.warn(logs.slice(-15).join('\n'));
      throw new Error(t('FFmpeg konnte die Datei nicht umwandeln.'));
    }
    await f.deleteFile(outName).catch(() => {});
    if (result) URL.revokeObjectURL(result.url);
    const blob = new Blob([data.buffer], { type: job.type });
    result = { blob, name: job.out, url: URL.createObjectURL(blob) };
    showResult();
    if (action === 'shrink' && blob.size > file.size) {
      toast(t('Das Ergebnis ist grösser als das Original – das Video ist bereits sehr effizient gespeichert (z. B. HEVC vom iPhone). Tipp: kleinere Auflösung oder „Möglichst klein“ wählen.'), true);
    }
  } catch (e) {
    console.error(e);
    toast(t('Umwandlung fehlgeschlagen: ') + e.message, true);
  } finally {
    onLog = () => {};
    running = false;
    window.CMV.busy(false);
  }
});

function showResult() {
  const d = Math.round((1 - result.blob.size / file.size) * 100);
  $('#r-meta').innerHTML = `<span data-no-i18n>${esc(result.name)}</span><br>${fmtSize(file.size)} → <b>${fmtSize(result.blob.size)}</b>${d > 0 ? ` (−${d} %)` : ''}`;
  const kind = result.blob.type.split('/')[0];
  for (const [id, k] of [['#r-video', 'video'], ['#r-img', 'image'], ['#r-audio', 'audio']]) {
    const el = $(id);
    el.hidden = k !== kind;
    if (k === kind) el.src = result.url; else el.removeAttribute('src');
  }
  $('#result').classList.remove('hidden');
  $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

$('#r-dl').addEventListener('click', () => result && download(result.blob, result.name));
$('#r-share').addEventListener('click', () => result && share(result.blob, result.name));
if (navigator.canShare && navigator.canShare({ files: [new File([''], 'a.mp4', { type: 'video/mp4' })] })) $('#r-share').classList.remove('hidden');
$('#other').addEventListener('click', () => {
  if (running) return toast(t('Bitte warten, bis die Umwandlung fertig ist.'));
  file = null; show('start');
});

route();
window.CMV.registerSW();
window.__video = { get result() { return result; }, get running() { return running; }, get info() { return info; } };
