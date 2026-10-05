# PDF Werkstatt

A privacy-first PDF toolkit that runs **entirely on your own device** – as a native Mac app or as a website that
processes everything inside the browser. Your files are never uploaded anywhere.

The interface is available in **English and German** (auto-detected, switchable in the header).

## Features

| Area | Tools |
|---|---|
| Edit & sign | **Edit PDF** (text, date, images, check marks/crosses, white-out, highlight, shapes, redaction), **Sign PDF** (draw, type or upload a signature – saved for next time), **Make it look scanned**, watermark, page numbers, crop, flatten, metadata |
| Organize | Merge (PDFs and images), split, remove pages, extract pages, organize (drag to reorder, rotate, duplicate, insert blank pages – across several PDFs), rotate |
| Optimize | **Compress to a target size** (e.g. 50 MB → 5 MB) or in three fixed levels, repair, OCR, grayscale |
| Convert to PDF | Images (JPG, PNG, HEIC …) → PDF, Word/Excel/PowerPoint/HTML → PDF |
| Convert from PDF | PDF → JPG/PNG, PDF → Word, PDF → PowerPoint/Excel, extract text, extract images |
| Security & review | Password protection (AES-256), unlock, redact (terms, email addresses, IBANs, phone numbers), compare two PDFs |

Every result can be passed straight on to another tool without downloading it first
(e.g. sign → export as scan → compress).

### “Make it look scanned”

Makes a PDF look as if it had been printed and scanned again: slightly skewed and offset, paper tone, uneven lighting,
noise and dust specks – in grayscale, colour or black & white, with three strength levels. In the editor the same effect
is available as **“Export as scan”** when saving, so signing and “scanning” happen in one step.

### Editor tips

- Pick a tool in the toolbar and click on the page. Drag elements to move them, drag the corner to resize, press `⌫` to delete.
- Double-click text to edit it. `⌘Z` undoes, `⌘D` duplicates.
- **“On all pages”** copies an element to every page – handy for initials.
- **Redact** permanently removes the content underneath. **White-out** only covers it with a white box.

## Mac app

### Install (once)

1. Put the `pdf-werkstatt` folder somewhere, e.g. in **Documents**.
2. Open **Terminal** (`⌘ + Space` → “Terminal”) and run:
   ```
   bash ~/Documents/pdf-werkstatt/install.command
   ```
   The first run takes 1–3 minutes and needs an internet connection once.
3. Done: **“PDF Werkstatt”** is now in your **Applications** folder and opens automatically.

From then on, start it like any other app via **Launchpad**, **Spotlight** (`⌘ + Space` → “PDF Werkstatt”) or the **Dock**.

- The app opens in its **own window** (no browser). “Download” shows the macOS “Save As…” dialog, “Preview” opens the file in Preview.
- **Quit:** `⌘Q` or close the window.
- If the native window cannot start, the app falls back to the browser (then use “Quit” in the top right).
- **Update:** replace the folder with the new version and run `install.command` again.
- **Uninstall:** delete “PDF Werkstatt” from Applications and optionally `~/Library/Application Support/PDF-Werkstatt`.

**Requirements:** Python 3.9+ (usually preinstalled on macOS). If macOS asks you to accept the Xcode licence:
`sudo xcodebuild -license accept`. If Python is missing: `xcode-select --install`.

For development, `bash start.command` runs the app directly in Terminal.

### Optional add-ons

A few tools need free external programs. Everything else works without them.

| Tool | Install (with [Homebrew](https://brew.sh)) |
|---|---|
| OCR (text recognition) | `brew install tesseract tesseract-lang` |
| Office → PDF, PDF → Excel/ODT | `brew install --cask libreoffice` |

Restart the app afterwards.

## Web version (no upload)

The same interface also runs as a website – **completely in the browser**. The PDF engine (PyMuPDF) runs as
WebAssembly ([Pyodide](https://pyodide.org)) inside the tab, and a service worker answers every `api/…` request locally.
There is no server that could receive files, and a Content Security Policy (`connect-src 'self'`) additionally forbids the
page from connecting anywhere else. After the first visit it even works offline.

- Build: `python3 web/build.py` → `web/dist/pdf/` (downloads the engine files and verifies them via SHA-256)
- Test locally: `python3 web/serve.py` → http://127.0.0.1:8800/pdf (reports every `/api` request that reaches the server – there should be none)
- Deploy: Vercel reads `vercel.json` (repository root, or `pdf-werkstatt/` if that is set as the root directory).
- Not available on the web (they need external programs): OCR, Office → PDF, PDF → Word/PowerPoint/Excel.

## Project structure

```
app.py            local server & API (Mac app)
pdftools.py       all PDF operations (shared by Mac app and web version)
scan.py           “make it look scanned” effect
static/           user interface (home, tools, editor, signature, DE/EN translation)
install.command   builds the “PDF Werkstatt” Mac app
start.command     developer start in Terminal
mac/              app icon (make_icon.py generates AppIcon.icns)
web/              web version (service worker, Pyodide worker, build script)
```

Built with Python (Flask) and [PyMuPDF](https://pymupdf.readthedocs.io); Pillow/NumPy for the scan effect; the interface
uses no framework. Temporary files live only in the system temp folder (Mac app) or in browser memory (web version)
and are deleted when the app is closed.

## License

The PDF engine MuPDF/PyMuPDF is licensed under the [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html), so this
project is published under the AGPL-3.0 as well (see `LICENSE`). Fonts: SIL Open Font License 1.1
(see `static/fonts` and `web/pdf-fonts`).
