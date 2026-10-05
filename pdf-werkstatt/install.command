#!/bin/bash
# Run once: installs “PDF Werkstatt” as a regular Mac app
# (Applications folder, Launchpad, Spotlight, Dock). No Terminal needed afterwards.
# To update, simply run it again.
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
NAME="PDF Werkstatt"
SUP="$HOME/Library/Application Support/PDF-Werkstatt"
if [ -w /Applications ]; then DEST="/Applications"; else DEST="$HOME/Applications"; mkdir -p "$DEST"; fi
APP="$DEST/$NAME.app"

echo ""
echo "  PDF Werkstatt – Installation"
echo "  ────────────────────────────"

if ! command -v python3 >/dev/null 2>&1 || ! python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)' 2>/dev/null; then
  echo "  Python 3.9 oder neuer fehlt."
  echo "  Im Terminal ausführen:  xcode-select --install   und danach dieses Skript erneut starten."
  exit 1
fi

# Apple silicon (M1/M2/…): always run natively (arm64), never under Rosetta
RUN=""
[ "$(sysctl -n hw.optional.arm64 2>/dev/null)" = "1" ] && RUN="arch -arm64"

echo "  1/3  Werkzeuge installieren (einmalig, 1–3 Minuten) …"
mkdir -p "$SUP"
[ -x "$SUP/venv/bin/python" ] || $RUN python3 -m venv "$SUP/venv"
$RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check --upgrade pip
$RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check -r "$SRC/requirements.txt"
# Self-test: can the PDF libraries be loaded?
if ! $RUN "$SUP/venv/bin/python" -c "import pymupdf, flask, PIL, numpy" 2>/dev/null; then
  echo "  Bibliotheken passen nicht zur Architektur – installiere neu …"
  rm -rf "$SUP/venv"
  $RUN python3 -m venv "$SUP/venv"
  $RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check --upgrade pip
  $RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check -r "$SRC/requirements.txt"
fi

echo "  2/3  App erstellen in $DEST …"
# Stop a running instance (when updating)
if [ -f "$SUP/port" ]; then
  curl -s -m 2 -X POST "http://127.0.0.1:$(cat "$SUP/port")/api/quit" >/dev/null 2>&1 || true
  sleep 1
fi
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/app"
cp -R "$SRC/app.py" "$SRC/pdftools.py" "$SRC/scan.py" "$SRC/requirements.txt" "$SRC/static" "$APP/Contents/Resources/app/"
cp "$SRC/mac/AppIcon.icns" "$APP/Contents/Resources/AppIcon.icns"

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>PDF Werkstatt</string>
  <key>CFBundleDisplayName</key><string>PDF Werkstatt</string>
  <key>CFBundleIdentifier</key><string>local.pdf-werkstatt</string>
  <key>CFBundleExecutable</key><string>PDF Werkstatt</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>11.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>LSArchitecturePriority</key><array><string>arm64</string><string>x86_64</string></array>
</dict>
</plist>
PLIST

cat > "$APP/Contents/MacOS/$NAME" <<'LAUNCHER'
#!/bin/bash
# Starts PDF Werkstatt in its own window.
SUP="$HOME/Library/Application Support/PDF-Werkstatt"
RES="$(cd "$(dirname "$0")/../Resources/app" && pwd)"
PY="$SUP/venv/bin/python"
if [ ! -x "$PY" ]; then
  osascript -e 'display alert "PDF Werkstatt ist nicht vollständig installiert." message "Bitte install.command im Ordner pdf-werkstatt erneut ausführen."'
  exit 1
fi
# Already running? Then just open the window.
if [ -f "$SUP/port" ]; then
  PORT="$(cat "$SUP/port")"
  if curl -s -m 1 "http://127.0.0.1:$PORT/api/ping" >/dev/null 2>&1; then
    open "http://127.0.0.1:$PORT"
    exit 0
  fi
fi
cd "$RES" || exit 1
rm -f "$SUP/port"
# Start natively on Apple silicon (otherwise macOS may run the app under Rosetta/x86_64)
RUN=""
[ "$(sysctl -n hw.optional.arm64 2>/dev/null)" = "1" ] && RUN="arch -arm64"
# Own window (exec: the process stays “PDF Werkstatt” in the Dock, ⌘Q quits)
exec $RUN "$PY" app.py --app --window >"$SUP/log.txt" 2>&1
LAUNCHER
chmod +x "$APP/Contents/MacOS/$NAME"

# Remove the quarantine flag and sign locally so macOS does not prompt
xattr -cr "$APP" 2>/dev/null || true
codesign --force --deep -s - "$APP" >/dev/null 2>&1 || true
touch "$APP"

echo "  3/3  Fertig! PDF Werkstatt wird gestartet …"
echo ""
echo "  Ab jetzt startest du die App wie jede andere:"
echo "  • Launchpad oder Spotlight (⌘ + Leertaste → „PDF Werkstatt“)"
echo "  • oder aus dem Ordner „Programme“ ins Dock ziehen"
echo ""
echo "  Dieses Terminal-Fenster kannst du schliessen."
echo ""
open "$APP" 2>/dev/null || true
