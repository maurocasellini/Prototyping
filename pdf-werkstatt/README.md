# PDF-Werkstatt

Ein PDF-Werkzeugkasten im Stil von iLovePDF, der **komplett lokal auf deinem Mac** läuft.
Deine Dateien werden nirgends hochgeladen: Ein kleiner Server läuft nur auf `127.0.0.1`, die Oberfläche erscheint in einem eigenen Mac-Fenster.

## Installieren (einmalig)

1. Den Ordner `pdf-werkstatt` z. B. in **Dokumente** ablegen.
2. **Terminal** öffnen (`⌘ + Leertaste` → „Terminal“) und eingeben:
   ```
   bash ~/Documents/pdf-werkstatt/install.command
   ```
   Das dauert beim ersten Mal 1–3 Minuten und braucht einmal Internet.
3. Fertig: **„PDF Werkstatt“** liegt jetzt im Ordner **Programme** und öffnet sich automatisch.

Danach startest du die App wie jede andere über **Launchpad**, **Spotlight** (`⌘ + Leertaste` → „PDF Werkstatt“) oder
das **Dock** (App aus dem Programme-Ordner ins Dock ziehen). Kein Terminal mehr nötig.

- Die App öffnet sich in einem **eigenen Fenster** (kein Browser). „Herunterladen“ öffnet den Mac-Dialog
  „Sichern unter …“, „Vorschau“ öffnet das PDF in der App Vorschau.
- **Beenden:** `⌘Q` oder Fenster schliessen.
- Sollte das Fenster einmal nicht starten, öffnet sich die App automatisch im Browser (dann oben rechts „Beenden“).
- **Update:** neue Version in den Ordner legen und `install.command` nochmals ausführen.
- **Deinstallieren:** „PDF Werkstatt“ aus Programme löschen, optional auch `~/Library/Application Support/PDF-Werkstatt`.

**Voraussetzung:** Python 3 (bei macOS meist dabei). Fragt der Mac nach der Xcode-Lizenz:
`sudo xcodebuild -license accept`. Fehlt Python ganz: `xcode-select --install`.

Für Entwickler: `bash start.command` startet die App direkt im Terminal.

## Web-Version (ohne Upload)

Dieselbe Oberfläche läuft auch als Website – **komplett im Browser**. Die PDF-Engine (PyMuPDF) läuft per
WebAssembly ([Pyodide](https://pyodide.org)) im Tab, ein Service Worker beantwortet alle `api/…`-Anfragen lokal.
Es gibt keinen Server, der Dateien entgegennehmen könnte; eine Content-Security-Policy (`connect-src 'self'`)
verbietet der Seite zusätzlich jede Verbindung nach aussen. Nach dem ersten Besuch funktioniert sie offline.

- Bauen: `python3 web/build.py` → `web/dist/pdf/` (lädt die Engine-Dateien, geprüft per SHA-256)
- Lokal testen: `python3 web/serve.py` → http://127.0.0.1:8800/pdf (meldet jede /api-Anfrage, die den Server erreicht – es sollten null sein)
- Deployment: Vercel liest `vercel.json` im Repo-Hauptordner.
- Nicht verfügbar im Web (brauchen externe Programme): OCR, Office → PDF, PDF → Word/PowerPoint/Excel.

## Funktionen

| Bereich | Werkzeuge |
|---|---|
| Bearbeiten & Unterschreiben | **PDF bearbeiten** (Text, Datum, Bilder, Häkchen/Kreuz, Abdecken, Markieren, Formen, Schwärzen), **PDF unterschreiben** (zeichnen, tippen oder als Bild einfügen, auch für spätere Verwendung gespeichert), **Wie gescannt**, Wasserzeichen, Seitenzahlen, Zuschneiden, Verflachen, Metadaten |
| Organisieren | Zusammenfügen (auch mit Bildern), Teilen, Seiten entfernen, Seiten extrahieren, Organisieren (Seiten ziehen, drehen, duplizieren, leere Seiten einfügen, auch über mehrere PDFs), Drehen |
| Optimieren | **Komprimieren auf Zielgrösse** (z. B. 50 MB → 5 MB) oder in 3 Stufen, Reparieren, OCR (Text erkennen), Graustufen |
| In PDF umwandeln | Bilder (JPG, PNG, HEIC …) → PDF, Word/Excel/PowerPoint/HTML → PDF |
| Aus PDF umwandeln | PDF → JPG/PNG, PDF → Word, PDF → PowerPoint/Excel, Text extrahieren, Bilder extrahieren |
| Sicherheit | Passwortschutz (AES-256), Entsperren, Schwärzen (Begriffe, E-Mails, IBANs, Telefonnummern), zwei PDFs vergleichen |

Jedes Ergebnis kann direkt mit einem anderen Werkzeug **weiterverarbeitet** werden, ohne es vorher herunterzuladen
(z. B. unterschreiben → als Scan ausgeben → verkleinern).

### „Wie gescannt“

Lässt das PDF aussehen, als wäre es ausgedruckt und wieder eingescannt worden: leicht schief, nicht ganz bündig, Papierton,
ungleichmässige Ausleuchtung, Rauschen, Staubpunkte, auf Wunsch in Graustufen oder Schwarz-Weiss. Drei Stärken stehen zur Auswahl.
Im Editor gibt es dafür beim Speichern die Option **„Als Scan ausgeben“**: unterschreiben und scannen in einem Schritt.

### Tipps für den Editor

- Werkzeug oben wählen und auf die Seite klicken. Elemente lassen sich ziehen, über die Ecke vergrössern und mit `⌫` löschen.
- Doppelklick auf einen Text bearbeitet ihn. `⌘Z` macht rückgängig, `⌘D` dupliziert.
- **„Auf allen Seiten“** kopiert ein Element auf jede Seite, praktisch für Initialen bzw. Paraphe.
- **Schwärzen** entfernt den Inhalt darunter wirklich. **Abdecken** legt nur ein weisses Feld darüber.

## Optionale Zusatzprogramme

Einige Werkzeuge brauchen kostenlose Zusatzprogramme. Ohne sie funktioniert alles andere trotzdem.

| Werkzeug | Installation (mit [Homebrew](https://brew.sh)) |
|---|---|
| OCR (Text erkennen) | `brew install tesseract tesseract-lang` |
| Office → PDF, PDF → Excel/ODT | `brew install --cask libreoffice` |

Danach die App neu starten.

## Lizenz

Die PDF-Engine MuPDF/PyMuPDF steht unter der [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html); deshalb ist auch
dieser Code unter der AGPL-3.0 veröffentlicht. Schriften: SIL Open Font License 1.1 (siehe `static/fonts`, `web/pdf-fonts`).

## Technik

Python (Flask) + [PyMuPDF](https://pymupdf.readthedocs.io) für die PDF-Verarbeitung, Pillow/NumPy für den Scan-Effekt
und eine Oberfläche ohne Framework (`static/`). Temporäre Dateien liegen nur im System-Temp-Ordner und werden beim Beenden gelöscht.

```
install.command  erstellt die Mac-App „PDF Werkstatt“
mac/             App-Icon (make_icon.py erzeugt AppIcon.icns)
app.py        lokaler Server & API
pdftools.py   alle PDF-Operationen
scan.py       „Wie gescannt“-Effekt
static/       Oberfläche (Startseite, Werkzeuge, Editor, Unterschrift)
```
