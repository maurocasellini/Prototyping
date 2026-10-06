#!/usr/bin/env python3
"""Builds all CMV Tools into dist/<app>/ (one folder per subdomain).

Every app is a static site that runs completely in the browser. Third-party engines
(OpenCV, Tesseract, Whisper, …) are downloaded from npm in pinned versions and verified via
SHA-256, then self-hosted next to the app. The PDF Toolkit has its own build (pdf/web/build.py),
which is run and copied to dist/pdf/. Only the Python standard library is needed (works on Vercel).

    python3 build.py              # all apps
    python3 build.py scan hub     # selected apps
"""
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, ".vendor-cache")
DIST = os.path.join(HERE, "dist")
SHARED = os.path.join(HERE, "shared")

NPM = "https://registry.npmjs.org"
# name: (tarball url, sha256)
PACKAGES = {
    "opencv": (f"{NPM}/@techstark/opencv-js/-/opencv-js-5.0.0-release.1.tgz",
               "5f2289421462489de42444d8ddc59ed035de13458fd8d9d390616f9c53b35434"),
    "tesseract": (f"{NPM}/tesseract.js/-/tesseract.js-7.0.0.tgz",
                  "9a93bf51c3387f945d10a24bf8b3a4bf2e45c7c7161b8242aafbaf9d3c4b606a"),
    "tesseract-core": (f"{NPM}/tesseract.js-core/-/tesseract.js-core-7.0.0.tgz",
                       "ba584355515eaff877552022853c0e71f2cb70466e759d1d6940484929718ee0"),
    "tess-deu": (f"{NPM}/@tesseract.js-data/deu/-/deu-1.0.0.tgz",
                 "929782d1d505ae09a568c41f2ea73182e84bb323205340abd72654584cd27b2c"),
    "tess-eng": (f"{NPM}/@tesseract.js-data/eng/-/eng-1.0.0.tgz",
                 "c9bddf2e2f0a214ac7918f3f4a3caf45e09ce8674fe26662ae7787ac8927f7bb"),
    "pdf-lib": (f"{NPM}/pdf-lib/-/pdf-lib-1.17.1.tgz",
                "a7cc1eaf12e41e612a7be581162a63b18118aefc01e90f6a1f35347b1f324a1c"),
    "transformers": (f"{NPM}/@huggingface/transformers/-/transformers-4.3.0.tgz",
                     "95eb8e17d84b162cc4e4c859937bbae0c4dc58bd085147cd4219cb8de47881aa"),
    # the exact ONNX Runtime build that transformers.js 4.3.0 bundles (for its .wasm file)
    "ort-dev": (f"{NPM}/onnxruntime-web/-/onnxruntime-web-1.31.0-dev.20260914-8d85527a0.tgz",
                "0de27582f3e3189dec4a2082513a0af1ea79ae7fd3039bbfe634a526e173cbe0"),
    # Whisper (OpenAI, MIT) as quantized ONNX in transformers.js layout (Xenova/whisper-*)
    "whisper-base": (f"{NPM}/sts-whisper-base/-/sts-whisper-base-1.0.0.tgz",
                     "4a023210a1f60880ed1ebb03bc4283835927164b5afbc937f765a17e6a282307"),
    "whisper-tiny": (f"{NPM}/sts-whisper-tiny/-/sts-whisper-tiny-1.0.0.tgz",
                     "f4f1da6ed8a2773ac1dd9d96f4f5b0689fcc78e534a7d87db918a961136a274a"),
    "ffmpeg": (f"{NPM}/@ffmpeg/ffmpeg/-/ffmpeg-0.12.15.tgz",
               "c8a23365fb39b46d3d1d9baa2e74b522d00ce5d57e8b20471ad2665eaad38e3e"),
    "ffmpeg-core": (f"{NPM}/@ffmpeg/core/-/core-0.12.10.tgz",
                    "d00089ce82e1bdf637ddbe42e0c3d41a1ba8cf4c9e825e7fa4d0bb970e844bd4"),
    "jsq-jpeg": (f"{NPM}/@jsquash/jpeg/-/jpeg-1.6.0.tgz", "b546f01dce888337bf132c5113b78a91a8ad76c1fe54740b2632546dda3b41b8"),
    "jsq-webp": (f"{NPM}/@jsquash/webp/-/webp-1.5.0.tgz", "b543cb1fc17e99c31e992a71d70da570d1bc1871ce3a88440df067e5b2e6ee9e"),
    "jsq-avif": (f"{NPM}/@jsquash/avif/-/avif-2.1.1.tgz", "b6c6204b63f9cb17aac7d6ee92b8a4aeba2403dccd49ffc9a93b778923049b5b"),
    "jsq-oxipng": (f"{NPM}/@jsquash/oxipng/-/oxipng-2.3.0.tgz", "e7d523bae6803574dd0e28296b7239f0d4689b0c195a9fbc4ff7657834c3196d"),
    "wasm-feature-detect": (f"{NPM}/wasm-feature-detect/-/wasm-feature-detect-1.9.0.tgz",
                            "c56c60a94f74cde3fd08abc609fc9ef97683b501acd40c2bc7eaf5ad2632c5b3"),
    "libheif": (f"{NPM}/libheif-js/-/libheif-js-1.23.5.tgz", "d0bfe7198bd624c524cef8ccf78e15ceb42683c87598c64c2e13ced0d8680932"),
    "exifr": (f"{NPM}/exifr/-/exifr-7.1.3.tgz", "cf2515f5eed3a60ed33d5d4ad709af6acbe5d69a36e0d36924d80cb8b66a0dc2"),
    # IS-Net background removal model by IMG.LY (AGPL-3.0), stored as hashed chunks
    "imgly-data": (f"{NPM}/@imgly/background-removal-data/-/background-removal-data-1.4.5.tgz",
                   "ca7789abb39370727c9a098310b53bce41518d200000423c7107f8c01bbce946"),
    "qrcode": (f"{NPM}/qrcode-generator/-/qrcode-generator-2.0.4.tgz",
               "02e2e18a99a90b02dad940851f59b7c3c5fd1ab79cbdece8595cb06328878159"),
}

FFMPEG = [
    ("ffmpeg", "package/dist/esm/", "ffmpeg/"),
    ("ffmpeg", "package/package.json", "ffmpeg/package.json"),
    ("ffmpeg-core", "package/dist/esm/ffmpeg-core.js", "ffmpeg/core/ffmpeg-core.js"),
    ("ffmpeg-core", "package/dist/esm/ffmpeg-core.wasm", "ffmpeg/core/ffmpeg-core.wasm"),
    ("ffmpeg-core", "package/package.json", "ffmpeg/core/package.json"),
]

# app: [(package, path inside the tarball, destination below <app>/vendor/)]
VENDOR = {
    "hub": [],
    "blockchaindemo": [],
    "scan": [
        ("opencv", "package/dist/opencv.js", "opencv.js"),
        ("opencv", "package/LICENSE", "LICENSE-opencv.txt"),
        ("tesseract", "package/dist/tesseract.min.js", "tesseract/tesseract.min.js"),
        ("tesseract", "package/dist/worker.min.js", "tesseract/worker.min.js"),
        ("tesseract", "package/LICENSE.md", "tesseract/LICENSE.md"),
        ("tesseract-core", "package/tesseract-core.wasm.js", "tesseract/tesseract-core.wasm.js"),
        ("tesseract-core", "package/tesseract-core-simd.wasm.js", "tesseract/tesseract-core-simd.wasm.js"),
        ("tesseract-core", "package/tesseract-core-lstm.wasm.js", "tesseract/tesseract-core-lstm.wasm.js"),
        ("tesseract-core", "package/tesseract-core-simd-lstm.wasm.js", "tesseract/tesseract-core-simd-lstm.wasm.js"),
        ("tesseract-core", "package/tesseract-core-relaxedsimd.wasm.js", "tesseract/tesseract-core-relaxedsimd.wasm.js"),
        ("tesseract-core", "package/tesseract-core-relaxedsimd-lstm.wasm.js", "tesseract/tesseract-core-relaxedsimd-lstm.wasm.js"),
        ("tesseract-core", "package/LICENSE", "tesseract/LICENSE-core"),
        ("tess-deu", "package/4.0.0_best_int/deu.traineddata.gz", "tessdata/deu.traineddata.gz"),
        ("tess-eng", "package/4.0.0_best_int/eng.traineddata.gz", "tessdata/eng.traineddata.gz"),
        ("pdf-lib", "package/dist/pdf-lib.min.js", "pdf-lib.min.js"),
        ("pdf-lib", "package/LICENSE.md", "LICENSE-pdf-lib.md"),
    ],
    "voice": [
        ("transformers", "package/dist/transformers.min.js", "transformers.min.js"),
        ("transformers", "package/LICENSE", "LICENSE-transformers.txt"),
        ("ort-dev", "package/dist/ort-wasm-simd-threaded.asyncify.mjs", "ort/ort-wasm-simd-threaded.asyncify.mjs"),
        ("ort-dev", "package/dist/ort-wasm-simd-threaded.asyncify.wasm", "ort/ort-wasm-simd-threaded.asyncify.wasm"),
        ("ort-dev", "package/package.json", "ort/package.json"),
        ("whisper-base", "package/models/Xenova/whisper-base/", "models/Xenova/whisper-base/"),
        ("whisper-tiny", "package/models/Xenova/whisper-tiny/", "models/Xenova/whisper-tiny/"),
    ] + FFMPEG,
    "image": [
        ("jsq-jpeg", "package/", "jsquash/jpeg/"),
        ("jsq-webp", "package/", "jsquash/webp/"),
        ("jsq-avif", "package/", "jsquash/avif/"),
        ("jsq-oxipng", "package/", "jsquash/oxipng/"),
        ("wasm-feature-detect", "package/dist/esm/index.js", "wasm-feature-detect/index.js"),
        ("wasm-feature-detect", "package/LICENSE", "wasm-feature-detect/LICENSE"),
        ("libheif", "package/libheif-wasm/libheif-bundle.mjs", "libheif/libheif-bundle.mjs"),
        ("libheif", "package/libheif-wasm/LICENSE", "libheif/LICENSE"),
        ("exifr", "package/dist/full.umd.js", "exifr.umd.js"),
        ("exifr", "package/LICENSE", "LICENSE-exifr.txt"),
        ("ort-dev", "package/dist/ort.wasm.min.mjs", "ort/ort.wasm.min.mjs"),
        ("ort-dev", "package/dist/ort-wasm-simd-threaded.mjs", "ort/ort-wasm-simd-threaded.mjs"),
        ("ort-dev", "package/dist/ort-wasm-simd-threaded.wasm", "ort/ort-wasm-simd-threaded.wasm"),
        ("imgly-data", "chunks:/models/small", "models/isnet-small.onnx"),
        ("imgly-data", "package/LICENSE.md", "models/LICENSE-isnet-imgly.md"),
    ],
}

# Bare module imports in npm files → relative paths inside vendor/
IMPORT_MAP = {"wasm-feature-detect": "wasm-feature-detect/index.js"}
# Published apps
APPS = ["hub", "pdf", "scan", "voice", "blockchaindemo", "image"]

# Files above this size are served in parts (CDN limits); vendor/split.json lists them
SPLIT_AT = 45 * 1024 * 1024


def log(*a):
    print("  ", *a, flush=True)


def tarball(name):
    url, digest = PACKAGES[name]
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, os.path.basename(url))
    if os.path.exists(path):
        with open(path, "rb") as fh:
            data = fh.read()
        if hashlib.sha256(data).hexdigest() == digest:
            return data
    for attempt in range(4):
        try:
            log("downloading", url)
            req = urllib.request.Request(url, headers={"User-Agent": "cmv-tools-build"})
            with urllib.request.urlopen(req, timeout=300) as r:
                data = r.read()
            break
        except Exception as e:  # network hiccup: retry with backoff
            log("  failed:", e)
            if attempt == 3:
                raise SystemExit(f"Could not download {url}")
            time.sleep(2 ** (attempt + 1))
    if hashlib.sha256(data).hexdigest() != digest:
        raise SystemExit(f"Checksum mismatch for {url}")
    with open(path, "wb") as fh:
        fh.write(data)
    return data


_open = {}


def members(pkg, inner):
    """(relative name, bytes) for one file – or for every file below a directory ending in '/'."""
    if pkg not in _open:
        _open[pkg] = tarfile.open(fileobj=io.BytesIO(tarball(pkg)), mode="r:gz")
    tf = _open[pkg]
    if inner.startswith("chunks:"):          # IMG.LY data: reassemble a file from its sha256-named chunks
        import json
        res = json.loads(tf.extractfile("package/dist/resources.json").read())[inner[7:]]
        out = bytearray()
        for c in res["chunks"]:
            data = tf.extractfile("package/dist/" + c["hash"]).read()
            if hashlib.sha256(data).hexdigest() != c["hash"]:
                raise SystemExit(f"Checksum mismatch in chunk {c['hash']}")
            out += data
        if len(out) != res["size"]:
            raise SystemExit(f"Unexpected size for {inner}")
        return [("", bytes(out))]
    if not inner.endswith("/"):
        return [("", tf.extractfile(inner).read())]
    skip = (".d.ts", ".md", ".map", "package.json")
    return [(m.name[len(inner):], tf.extractfile(m).read())
            for m in tf.getmembers() if m.isfile() and m.name.startswith(inner)
            and (not m.name.endswith(skip) or os.path.basename(m.name).startswith("LICENSE"))]


def rewrite_imports(vendor):
    """npm packages import each other by bare name; browsers need relative paths."""
    import re
    for root, _, files in os.walk(vendor):
        for f in files:
            if not f.endswith((".js", ".mjs")):
                continue
            path = os.path.join(root, f)
            with open(path, encoding="utf-8", errors="surrogateescape") as fh:
                src = fh.read()
            new = src
            for name, target in IMPORT_MAP.items():
                rel = os.path.relpath(os.path.join(vendor, target), root).replace(os.sep, "/")
                if not rel.startswith("."):
                    rel = "./" + rel
                new = re.sub(r"""(from\s*|import\s*\(\s*)(['"])""" + re.escape(name) + r"""\2""", lambda m: f"{m.group(1)}{m.group(2)}{rel}{m.group(2)}", new)
            if new != src:
                with open(path, "w", encoding="utf-8", errors="surrogateescape") as fh:
                    fh.write(new)


def build_pdf():
    """The PDF Toolkit (Pyodide + PyMuPDF) has its own build; copy its output to dist/pdf/."""
    subprocess.run([sys.executable, os.path.join(HERE, "pdf", "web", "build.py")], check=True)
    out = os.path.join(DIST, "pdf")
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(os.path.join(HERE, "pdf", "web", "dist"), out)
    size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(out) for f in fs)
    log(f"pdf: {size / 1e6:.1f} MB")


def split_large(vendor):
    """Store files above SPLIT_AT as <name>.part0, .part1 … and list them in vendor/split.json."""
    parts = {}
    for root, _, files in os.walk(vendor):
        for f in files:
            path = os.path.join(root, f)
            size = os.path.getsize(path)
            if size <= SPLIT_AT:
                continue
            with open(path, "rb") as fh:
                n = 0
                while chunk := fh.read(SPLIT_AT):
                    with open(f"{path}.part{n}", "wb") as out:
                        out.write(chunk)
                    n += 1
            os.remove(path)
            parts[os.path.relpath(path, vendor).replace(os.sep, "/")] = {"parts": n, "size": size}
    if parts:
        with open(os.path.join(vendor, "split.json"), "w") as fh:
            json.dump(parts, fh, indent=1)


def build(app):
    if app == "pdf":
        return build_pdf()
    out = os.path.join(DIST, app)
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(os.path.join(HERE, app), out, ignore=shutil.ignore_patterns("__pycache__", ".*"))
    shutil.copytree(SHARED, os.path.join(out, "shared"), ignore=shutil.ignore_patterns("sw.js", "__pycache__", ".*"))
    version = hashlib.sha256()
    for root, _, files in sorted(os.walk(out)):
        for f in sorted(files):
            with open(os.path.join(root, f), "rb") as fh:
                version.update(fh.read())
    for pkg, inner, dest in VENDOR[app]:
        for rel, data in members(pkg, inner):
            target = os.path.join(out, "vendor", dest + rel)
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, "wb") as fh:
                fh.write(data)
        version.update(PACKAGES[pkg][1].encode())
    if os.path.isdir(os.path.join(out, "vendor")):
        rewrite_imports(os.path.join(out, "vendor"))
        split_large(os.path.join(out, "vendor"))
    with open(os.path.join(SHARED, "sw.js"), encoding="utf-8") as fh:
        sw = fh.read().replace("__BUILD__", version.hexdigest()[:12]).replace("__APP__", "cmv-" + app)
    with open(os.path.join(out, "sw.js"), "w", encoding="utf-8") as fh:
        fh.write(sw)
    size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(out) for f in fs)
    log(f"{app}: {size / 1e6:.1f} MB")


def main():
    apps = [a for a in sys.argv[1:] if not a.startswith("-")] or APPS
    print("Building", ", ".join(apps))
    os.makedirs(DIST, exist_ok=True)
    for app in apps:
        if app not in VENDOR and app != "pdf":
            raise SystemExit(f"Unknown app: {app}")
        build(app)
    with open(os.path.join(DIST, "robots.txt"), "w") as fh:
        fh.write("User-agent: *\nDisallow: /\n")
    print("done →", DIST)


if __name__ == "__main__":
    main()
