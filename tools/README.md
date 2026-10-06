# CM Ventures Tools

Everyday tools that run **entirely in the browser**. Files are processed in the device’s memory and are never
uploaded. Each tool is a static site with its own subdomain; proven open-source engines do the work as WebAssembly.

| Tool | Domain | Engines |
|---|---|---|
| Hub (overview) | `tools.cmventures.xyz` | – |
| Doc Scanner | `scan.cmventures.xyz` | OpenCV.js (edge detection, perspective correction, scan look), Tesseract.js (OCR), pdf-lib |
| PDF Toolkit | `pdf.cmventures.xyz` | separate project in [`../pdf-werkstatt`](../pdf-werkstatt) |

Planned: voice memo → text (Whisper), image toolkit, video toolkit (FFmpeg), offline translator (Bergamot), QR codes.

## Privacy by design

- Content Security Policy `connect-src 'self'`: the pages cannot talk to any other server.
- All engines, fonts and icons are self-hosted – no third-party requests, no tracking, no cookies.
- OpenCV’s JavaScript bindings need `eval`, so the scanner’s image-processing worker (`scan/cv-worker.js`) – and
  only that worker – additionally allows `'unsafe-eval'`. It still cannot connect anywhere.
- A service worker caches each tool so it also works offline. Search engines are excluded (`noindex`, `robots.txt`).

## Structure

```
shared/         design (base.css, fonts), DE/EN translation (i18n.js), helpers (common.js), service worker
hub/            overview page with all tools
scan/           Doc Scanner (scan.js UI, cv-worker.js image processing)
build.py        builds dist/<app>/ – downloads pinned npm packages, verifies SHA-256, self-hosts them
serve.py        local test server that mimics vercel.json (8810 = preview-style paths, 8811 = scan subdomain)
make_icons.py   renders logo.svg → PNG icons (needs Playwright)
vercel.json     headers + host-based routing: <subdomain>.cmventures.xyz → dist/<app>/
```

```
python3 tools/build.py      # → tools/dist/
python3 tools/serve.py      # → http://127.0.0.1:8810/ and :8811/
```

## Deployment (Vercel)

One Vercel project with **Root Directory `tools`** serves every tool. A new tool needs its folder, an entry in
`build.py` (`VENDOR`) and `vercel.json` (`rewrites` + the host list in `redirects`), plus its domain in Vercel and a
CNAME record in DNS.

## Licenses

Code: AGPL-3.0 (see `../pdf-werkstatt/LICENSE`). OpenCV, Tesseract and Tesseract.js: Apache 2.0. pdf-lib: MIT.
Fonts: SIL Open Font License 1.1.
