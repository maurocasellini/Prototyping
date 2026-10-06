# CMV Tools

Everyday tools by CM Ventures that run **entirely in the browser**. Files are processed in the device’s memory and
are never uploaded. Each tool is a static site on its own subdomain; proven open-source engines do the work as
WebAssembly.

| Tool | Domain | Folder | Engines |
|---|---|---|---|
| Hub (overview) | `tools.cmventures.xyz` | [`hub/`](hub) | – |
| PDF Toolkit | `pdf.cmventures.xyz` | [`pdf/`](pdf) | MuPDF / PyMuPDF on Pyodide |
| Doc Scanner | `scan.cmventures.xyz` | [`scan/`](scan) | OpenCV.js, Tesseract.js (OCR), pdf-lib |
| Voice to Text | `voice.cmventures.xyz` | [`voice/`](voice) | Whisper via Transformers.js / ONNX Runtime, FFmpeg.wasm |
| Image Toolkit | `image.cmventures.xyz` | [`image/`](image) | Squoosh codecs (MozJPEG, WebP, AVIF, OxiPNG), libheif, exifr, IS-Net via ONNX Runtime |
| Video Toolkit | `video.cmventures.xyz` | [`video/`](video) | FFmpeg.wasm (x264, LAME, GIF) |
| Translator | `translate.cmventures.xyz` | [`translate/`](translate) | Mozilla Bergamot + Firefox Translations models (de, en, fr, it, es) |
| CM Ventures Blockchain Demo | `blockchaindemo.cmventures.xyz` | [`blockchaindemo/`](blockchaindemo) | none – own SHA-256, WebCrypto ECDSA |

In progress: QR codes.

## Privacy by design

- Content Security Policy `connect-src 'self'`: the pages cannot talk to any other server.
- All engines, models, fonts and icons are self-hosted – no third-party requests, no tracking, no cookies.
- OpenCV’s JavaScript bindings need `eval`, so the scanner’s image-processing worker (`scan/cv-worker.js`) – and
  only that worker – additionally allows `'unsafe-eval'`. It still cannot connect anywhere.
- Voice to Text is cross-origin isolated (COOP/COEP) for multi-threaded WebAssembly.
- A service worker caches each tool so it also works offline. Search engines are excluded (`noindex`, `robots.txt`).

## Structure

```
hub/ pdf/ scan/ voice/ image/ video/ translate/   one folder per tool
blockchaindemo/           blockchain simulation for teaching (no engines, no vendor files)
shared/                   design (base.css, fonts), DE/EN translation (i18n.js), helpers, service worker
build.py                  builds dist/<tool>/ – downloads pinned npm packages, verifies SHA-256, self-hosts them;
                          runs pdf/web/build.py for the PDF Toolkit
serve.py                  local test server that mimics vercel.json (one port per subdomain)
make_icons.py             renders logo.svg → PNG icons (needs Playwright)
make_vercel.py            generates vercel.json (headers + host-based routing: <subdomain>.cmventures.xyz → dist/<tool>/)
```

```
python3 build.py          # → dist/
python3 serve.py          # → http://127.0.0.1:8810/ (all tools as /<tool>/) and :8811 … :8819 (one per subdomain)
```

## Deployment (Vercel)

One Vercel project (`cmv-tools`, root directory = repository root) serves every tool. `vercel.json` maps each
subdomain to its folder in `dist/`.

Adding a tool: create its folder, add it to `VENDOR` and `APPS` in `build.py` and to `APPS` in the generator of
`vercel.json` (rewrites, redirect host list), then add the domain in Vercel and a CNAME record in DNS.

Large model files (> 45 MB) are stored in parts (`vendor/split.json`) and stitched together in the browser.

## Licenses

Code: AGPL-3.0 (see `LICENSE`) – required by MuPDF/PyMuPDF. OpenCV, Tesseract, Tesseract.js, Transformers.js:
Apache 2.0. Whisper, ONNX Runtime, pdf-lib: MIT. FFmpeg: LGPL/GPL. Fonts: SIL Open Font License 1.1.
