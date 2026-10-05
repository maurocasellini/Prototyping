"""PDF-Werkstatt – lokaler PDF-Werkzeugkasten. Startet einen Server auf 127.0.0.1
(nur dieser Rechner) und öffnet die Oberfläche im Browser."""
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

import pymupdf
from flask import Flask, abort, jsonify, request, send_file, send_from_directory

import pdftools

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
IDLE_LIMIT = 15 * 60  # ohne offenes Browserfenster beendet sich die App nach 15 Minuten
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
    return jsonify(ok=True, app=APP_MODE)


@app.post("/api/quit")
def quit_app():
    threading.Timer(0.4, shutdown).start()
    return jsonify(ok=True)


def watchdog():
    while True:
        time.sleep(30)
        if time.time() - LAST_PING[0] > IDLE_LIMIT:
            shutdown()


def free_port(start=8765):
    for port in range(start, start + 50):
        with socket.socket() as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    return 0


if __name__ == "__main__":
    port = free_port()
    url = f"http://127.0.0.1:{port}"
    if APP_MODE:
        os.makedirs(os.path.dirname(PORT_FILE), exist_ok=True)
        with open(PORT_FILE, "w") as fh:
            fh.write(str(port))
        threading.Thread(target=watchdog, daemon=True).start()
    print(f"\n  PDF-Werkstatt läuft auf {url}\n  Zum Beenden: dieses Fenster schliessen oder Ctrl+C\n")
    if "--no-browser" not in sys.argv:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    app.run(host="127.0.0.1", port=port, threaded=True, debug=False)
