# PDF-Werkstatt

Ein PDF-Werkzeugkasten im Stil von iLovePDF, der **komplett lokal auf deinem Mac** läuft.
Deine Dateien werden nirgends hochgeladen: Ein kleiner Server läuft nur auf `127.0.0.1` und wird über den Browser bedient.

## Starten

1. Den Ordner `pdf-werkstatt` irgendwo ablegen (z. B. unter `Programme` oder `Dokumente`).
2. **Doppelklick auf `start.command`.**
   - Beim ersten Start richtet sich die App selbst ein (1–2 Minuten, braucht einmal Internet).
   - Danach öffnet sich der Browser mit der PDF-Werkstatt.
3. Zum Beenden das Terminal-Fenster schliessen.

Falls macOS meldet, dass die Datei „von einem nicht verifizierten Entwickler“ stammt:
Rechtsklick auf `start.command` → **Öffnen** → **Öffnen**. Das ist nur beim ersten Mal nötig.

Alternativ im Terminal: `cd pdf-werkstatt && bash start.command`

**Voraussetzung:** Python 3. Ist meist schon da. Falls nicht: `xcode-select --install` oder `brew install python`.

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

## Technik

Python (Flask) + [PyMuPDF](https://pymupdf.readthedocs.io) für die PDF-Verarbeitung, Pillow/NumPy für den Scan-Effekt
und eine Oberfläche ohne Framework (`static/`). Temporäre Dateien liegen nur im System-Temp-Ordner und werden beim Beenden gelöscht.

```
app.py        lokaler Server & API
pdftools.py   alle PDF-Operationen
scan.py       „Wie gescannt“-Effekt
static/       Oberfläche (Startseite, Werkzeuge, Editor, Unterschrift)
```
