#!/bin/bash
# Einmalig ausführen: installiert „PDF Werkstatt“ als normale Mac-App
# (Programme-Ordner, Launchpad, Spotlight, Dock). Danach kein Terminal mehr nötig.
# Für ein Update einfach erneut ausführen.
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

# Apple-Chip (M1/M2/…): alles ausdrücklich nativ (arm64) ausführen, nie unter Rosetta
RUN=""
[ "$(sysctl -n hw.optional.arm64 2>/dev/null)" = "1" ] && RUN="arch -arm64"

echo "  1/3  Werkzeuge installieren (einmalig, 1–3 Minuten) …"
mkdir -p "$SUP"
[ -x "$SUP/venv/bin/python" ] || $RUN python3 -m venv "$SUP/venv"
$RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check --upgrade pip
$RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check -r "$SRC/requirements.txt"
# Selbsttest: lassen sich die PDF-Bibliotheken laden?
if ! $RUN "$SUP/venv/bin/python" -c "import pymupdf, flask, PIL, numpy" 2>/dev/null; then
  echo "  Bibliotheken passen nicht zur Architektur – installiere neu …"
  rm -rf "$SUP/venv"
  $RUN python3 -m venv "$SUP/venv"
  $RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check --upgrade pip
  $RUN "$SUP/venv/bin/python" -m pip install --quiet --disable-pip-version-check -r "$SRC/requirements.txt"
fi

echo "  2/3  App erstellen in $DEST …"
# Laufende Version beenden (bei Updates)
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
  <key>LSUIElement</key><true/>
  <key>LSArchitecturePriority</key><array><string>arm64</string><string>x86_64</string></array>
</dict>
</plist>
PLIST

cat > "$APP/Contents/MacOS/$NAME" <<'LAUNCHER'
#!/bin/bash
# Startet den lokalen PDF-Werkstatt-Server im Hintergrund und öffnet den Browser.
SUP="$HOME/Library/Application Support/PDF-Werkstatt"
RES="$(cd "$(dirname "$0")/../Resources/app" && pwd)"
PY="$SUP/venv/bin/python"
if [ ! -x "$PY" ]; then
  osascript -e 'display alert "PDF Werkstatt ist nicht vollständig installiert." message "Bitte install.command im Ordner pdf-werkstatt erneut ausführen."'
  exit 1
fi
# Läuft schon? Dann nur das Fenster öffnen.
if [ -f "$SUP/port" ]; then
  PORT="$(cat "$SUP/port")"
  if curl -s -m 1 "http://127.0.0.1:$PORT/api/ping" >/dev/null 2>&1; then
    open "http://127.0.0.1:$PORT"
    exit 0
  fi
fi
cd "$RES" || exit 1
rm -f "$SUP/port"
# Auf Apple-Chips nativ starten (sonst lädt macOS die App evtl. unter Rosetta/x86_64)
RUN=""
[ "$(sysctl -n hw.optional.arm64 2>/dev/null)" = "1" ] && RUN="arch -arm64"
nohup $RUN "$PY" app.py --app --no-browser >"$SUP/log.txt" 2>&1 &
disown
# Warten, bis der Server antwortet, dann Browser öffnen – sonst Fehler anzeigen
for i in $(seq 1 60); do
  sleep 0.5
  if [ -f "$SUP/port" ]; then
    PORT="$(cat "$SUP/port")"
    if curl -s -m 1 "http://127.0.0.1:$PORT/api/ping" >/dev/null 2>&1; then
      open "http://127.0.0.1:$PORT"
      exit 0
    fi
  fi
done
MSG="$(tail -n 6 "$SUP/log.txt" 2>/dev/null | tr '"\\' "' " )"
osascript -e "display alert \"PDF Werkstatt konnte nicht starten.\" message \"$MSG\""
exit 1
LAUNCHER
chmod +x "$APP/Contents/MacOS/$NAME"

# Herkunftsmarkierung entfernen und lokal signieren, damit macOS nicht nachfragt
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
