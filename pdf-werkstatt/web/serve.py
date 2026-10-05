#!/usr/bin/env python3
"""Local test server for the web version – behaves like Vercel (headers from vercel.json,
/pdf → /pdf/index.html). Testing only:  python3 web/serve.py  → http://127.0.0.1:8800/pdf"""
import http.server
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")
CFG = json.load(open(os.path.join(HERE, "..", "..", "vercel.json")))


def pattern(src):
    return re.compile("^" + src.replace("(.*)", "(.*)") + "$")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIST, **kw)

    def translate_path(self, path):
        clean = path.split("?")[0]
        for r in CFG.get("rewrites", []):
            if clean == r["source"]:
                path = r["destination"]
        return super().translate_path(path)

    def end_headers(self):
        clean = self.path.split("?")[0]
        for h in CFG.get("headers", []):
            if pattern(h["source"]).match(clean):
                for kv in h["headers"]:
                    self.send_header(kv["key"], kv["value"])
        super().end_headers()

    def log_message(self, fmt, *a):
        # Static file requests are normal. An /api request reaching the server would mean data left the device.
        if "/api/" in self.path:
            sys.stderr.write("!!! API REQUEST REACHED THE SERVER: %s %s\n" % (self.command, self.path))


Handler.extensions_map[".wasm"] = "application/wasm"
Handler.extensions_map[".webmanifest"] = "application/manifest+json"
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8800
print(f"http://127.0.0.1:{port}/pdf")
http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
