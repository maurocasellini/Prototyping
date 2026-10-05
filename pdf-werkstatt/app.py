"""PDF-Werkstatt – lokaler PDF-Werkzeugkasten. Startet einen Server auf 127.0.0.1
(nur dieser Rechner). Mit --window erscheint die Oberfläche in einem eigenen Mac-Fenster,
sonst im Browser."""
import atexit
import io
import json
import os
import shutil
import socket
import sys
import tempfile
import threading
import time
import traceback
import uuid
import webbrowser

# Homebrew-Pfade (Tesseract, LibreOffice) auch beim Start per Doppelklick finden
os.environ["PATH"] = os.pathsep.join(["/opt/homebrew/bin", "/usr/local/bin", os.environ.get("PATH", "")])

try:
    import pymupdf
    from flask import Flask, abort, jsonify, request, send_file, send_from_directory

    import pdftools
except Exception as _err:  # bei Doppelklick-Start sonst unsichtbar
    if sys.platform == "darwin" and "--app" in sys.argv:
        import subprocess
        msg = str(_err).replace('"', "'")[:400]
        subprocess.run(["osascript", "-e", f'display alert "PDF Werkstatt konnte nicht starten." message "{msg}"'])
    raise

BASE = os.path.dirname(os.path.abspath(__file__))
WORK = tempfile.mkdtemp(prefix="pdf-werkstatt-")
atexit.register(shutil.rmtree, WORK, ignore_errors=True)

app = Flask(__name__, static_folder=os.path.join(BASE, "static"), static_url_path="/static")
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 ** 3

FILES = {}  # id -> {path, name, size}
LOCK = threading.Lock()


def register(path, name):
    fid = uuid.uuid4().hex[:12]
    entry = {"id": fid, "path": path, "name": name, "size": os.path.getsize(path)}
    with LOCK:
        FILES[fid] = entry
    return describe(entry)


def describe(entry):
    out = {k: entry[k] for k in ("id", "name", "size")}
    if entry["name"].lower().endswith(".pdf"):
        try:
            doc = pymupdf.open(entry["path"])
            out["encrypted"] = bool(doc.needs_pass)
            if not doc.needs_pass:
                out["pages"] = doc.page_count
                out["sizes"] = [[round(p.rect.width, 2), round(p.rect.height, 2)] for p in doc]
            doc.close()
        except Exception:
            out["broken"] = True
    return out


def get(fid):
    e = FILES.get(fid)
    if not e:
        abort(404)
    return e


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.get("/api/capabilities")
def caps():
    return jsonify(pdftools.capabilities())


@app.post("/api/upload")
def upload():
    out = []
    for fs in request.files.getlist("files"):
        name = os.path.basename(fs.filename or "datei")
        path = os.path.join(WORK, uuid.uuid4().hex + os.path.splitext(name)[1].lower())
        fs.save(path)
        out.append(register(path, name))
    return jsonify(out)


@app.get("/api/file/<fid>")
def file_info(fid):
    return jsonify(describe(get(fid)))


@app.get("/api/file/<fid>/download")
def download(fid):
    e = get(fid)
    return send_file(e["path"], as_attachment=True, download_name=e["name"])


@app.get("/api/file/<fid>/raw")
def raw(fid):
    e = get(fid)
    return send_file(e["path"], download_name=e["name"])


@app.get("/api/file/<fid>/page/<int:n>")
def page_image(fid, n):
    e = get(fid)
    width = int(request.args.get("w", 200))
    ext = os.path.splitext(e["name"])[1].lower()
    try:
        doc = pymupdf.open(e["path"])
        if doc.needs_pass:
            abort(403)
        page = doc[n]
        zoom = min(width / page.rect.width, 6)
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        data = pix.tobytes("jpg", jpg_quality=88) if width > 500 else pix.tobytes("png")
    except Exception:
        if ext in pdftools.IMAGE_EXT:
            return send_file(e["path"])
        abort(404)
    resp = send_file(io.BytesIO(data), mimetype="image/jpeg" if width > 500 else "image/png")
    resp.headers["Cache-Control"] = "max-age=3600"
    return resp


@app.post("/api/run/<tool>")
def run(tool):
    fn = pdftools.TOOLS.get(tool)
    if not fn:
        abort(404)
    body = request.get_json(force=True)
    files = [get(fid) for fid in body.get("files", [])]
    if not files:
        return jsonify(error="Bitte zuerst eine Datei hinzufügen."), 400
    try:
        res = fn(files, body.get("params") or {})
    except pdftools.ToolError as ex:
        return jsonify(error=str(ex)), 400
    except Exception as ex:
        traceback.print_exc()
        return jsonify(error=f"Unerwarteter Fehler: {ex}"), 500
    if "json" in res:
        return jsonify(result=res["json"])
    path = os.path.join(WORK, uuid.uuid4().hex + os.path.splitext(res["name"])[1])
    with open(path, "wb") as fh:
        fh.write(res["data"])
    info = register(path, res["name"])
    info["info"] = res.get("info")
    info["input_size"] = sum(f["size"] for f in files)
    return jsonify(result=info)


# ---------------------------------------------------------------- App-Modus (Mac-App ohne Terminal)
APP_MODE = "--app" in sys.argv
WINDOW_MODE = [False]  # True, sobald das native Fenster läuft
IDLE_LIMIT = 15 * 60  # Browser-Modus: ohne offenes Fenster nach 15 Minuten beenden
LAST_PING = [time.time()]
PORT_FILE = os.path.expanduser("~/Library/Application Support/PDF-Werkstatt/port")


def shutdown():
    try:
        os.remove(PORT_FILE)
    except OSError:
        pass
    shutil.rmtree(WORK, ignore_errors=True)
    os._exit(0)


@app.get("/api/ping")
def ping():
    LAST_PING[0] = time.time()
    return jsonify(ok=True, app=APP_MODE, window=WINDOW_MODE[0])


@app.post("/api/quit")
def quit_app():
    threading.Timer(0.4, shutdown).start()
    return jsonify(ok=True)


def watchdog():
    while True:
        time.sleep(30)
        if not WINDOW_MODE[0] and time.time() - LAST_PING[0] > IDLE_LIMIT:
            shutdown()


def free_port(start=8765):
    for port in range(start, start + 50):
        with socket.socket() as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    return 0


def wait_for_server(port, timeout=20):
    end = time.time() + timeout
    while time.time() < end:
        with socket.socket() as s:
            if s.connect_ex(("127.0.0.1", port)) == 0:
                return True
        time.sleep(0.1)
    return False


# ---------------------------------------------------------------- Natives Fenster (pywebview)
class Bridge:
    """Wird im Fenster als window.pywebview.api angeboten."""

    def save(self, fid):
        """„Sichern unter …“-Dialog des Mac, dann Datei kopieren."""
        import webview
        e = FILES.get(fid)
        if not e or not WINDOWS:
            return {"ok": False}
        kind = getattr(getattr(webview, "FileDialog", None), "SAVE", None) or webview.SAVE_DIALOG
        target = WINDOWS[0].create_file_dialog(kind, directory=os.path.expanduser("~/Documents"),
                                               save_filename=e["name"])
        if not target:
            return {"ok": False, "cancelled": True}
        target = target[0] if isinstance(target, (list, tuple)) else target
        shutil.copyfile(e["path"], target)
        return {"ok": True, "path": target, "name": os.path.basename(target)}

    def preview(self, fid):
        """PDF/Bild in der Mac-App „Vorschau“ öffnen."""
        import subprocess
        e = FILES.get(fid)
        if not e:
            return {"ok": False}
        folder = os.path.join(WORK, "vorschau", fid)
        os.makedirs(folder, exist_ok=True)
        path = os.path.join(folder, e["name"])
        if not os.path.exists(path):
            shutil.copyfile(e["path"], path)
        subprocess.Popen(["open", path])
        return {"ok": True}


WINDOWS = []


def run_window(url):
    """Öffnet die Oberfläche in einem eigenen Fenster. False, wenn pywebview fehlt."""
    try:
        import webview
    except Exception:
        return False
    WINDOW_MODE[0] = True
    win = webview.create_window("PDF Werkstatt", url, width=1320, height=880, min_size=(980, 640),
                                js_api=Bridge(), background_color="#F1F1EC", text_select=True)
    WINDOWS.append(win)

    def on_start():
        try:  # Name & Icon im Dock/Menü setzen
            from AppKit import NSApplication, NSImage
            from Foundation import NSBundle
            info = NSBundle.mainBundle().infoDictionary()
            info["CFBundleName"] = "PDF Werkstatt"
            icns = os.path.join(BASE, "..", "AppIcon.icns")
            if os.path.exists(icns):
                NSApplication.sharedApplication().setApplicationIconImage_(
                    NSImage.alloc().initWithContentsOfFile_(icns))
        except Exception:
            pass

    try:
        webview.start(on_start)
    except Exception:
        traceback.print_exc()
        WINDOW_MODE[0] = False
        return False
    shutdown()  # Fenster geschlossen → App beenden
    return True


if __name__ == "__main__":
    port = free_port()
    url = f"http://127.0.0.1:{port}"
    if APP_MODE:
        os.makedirs(os.path.dirname(PORT_FILE), exist_ok=True)
        with open(PORT_FILE, "w") as fh:
            fh.write(str(port))
        threading.Thread(target=watchdog, daemon=True).start()
    if "--window" in sys.argv:
        threading.Thread(target=lambda: app.run(host="127.0.0.1", port=port, threaded=True, debug=False),
                         daemon=True).start()
        wait_for_server(port)
        if not run_window(url):  # Fallback: Browser
            webbrowser.open(url)
            while True:
                time.sleep(3600)
    else:
        print(f"\n  PDF-Werkstatt läuft auf {url}\n  Zum Beenden: dieses Fenster schliessen oder Ctrl+C\n")
        if "--no-browser" not in sys.argv:
            threading.Timer(1.0, lambda: webbrowser.open(url)).start()
        app.run(host="127.0.0.1", port=port, threaded=True, debug=False)
