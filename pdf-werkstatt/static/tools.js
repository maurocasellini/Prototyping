// Werkzeug-Definitionen: daraus werden Startseite und Formulare generiert.
const PDF = '.pdf,application/pdf';
const IMG = 'image/*,.heic';
const OFFICE = '.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.ods,.csv,.ppt,.pptx,.odp,.html,.htm';

const PAGES_FIELD = { name: 'pages', label: 'Seiten', type: 'text', placeholder: 'leer = alle, z. B. 1-3, 5, 8-ende' };

const CATEGORIES = [
  { name: 'Bearbeiten & Unterschreiben', tools: ['edit', 'sign', 'scan', 'watermark', 'page_numbers', 'crop', 'flatten', 'metadata'] },
  { name: 'Organisieren', tools: ['merge', 'split', 'remove', 'extract', 'organize', 'rotate'] },
  { name: 'Optimieren', tools: ['compress', 'repair', 'ocr', 'grayscale'] },
  { name: 'In PDF umwandeln', tools: ['images_to_pdf', 'office_to_pdf'] },
  { name: 'Aus PDF umwandeln', tools: ['pdf_to_images', 'pdf_to_word', 'pdf_to_office', 'extract_text', 'extract_images'] },
  { name: 'Sicherheit & Prüfen', tools: ['protect', 'unlock', 'redact', 'compare'] },
];

const TOOLS = {
  edit: {
    title: 'PDF bearbeiten', icon: '✏️', color: '#7c3aed', view: 'editor',
    desc: 'Text, Bilder, Häkchen, Formen, Abdecken und Schwärzen – direkt auf der Seite.',
  },
  sign: {
    title: 'PDF unterschreiben', icon: '✍️', color: '#0f766e', view: 'editor', openSignature: true,
    desc: 'Unterschrift zeichnen, tippen oder als Bild einfügen – optional als „Scan“ ausgeben.',
  },
  scan: {
    title: 'Wie gescannt', icon: '🖨️', color: '#57534e', accept: PDF,
    desc: 'Lässt das PDF aussehen, als wäre es ausgedruckt und eingescannt worden (leicht schief, Rauschen, Papierton).',
    fields: [
      { name: 'intensity', label: 'Stärke', type: 'cards', default: 'mittel', options: [
        ['leicht', 'Leicht', 'Kaum sichtbar, sehr sauber'], ['mittel', 'Mittel', 'Typischer Bürokopierer'], ['stark', 'Stark', 'Alter Scanner, deutlich schief'] ] },
      { name: 'color', label: 'Farbe', type: 'select', default: 'gray', options: [['gray', 'Graustufen'], ['color', 'Farbe'], ['bw', 'Schwarz-Weiss (Fax-Look)']] },
      { name: 'dpi', label: 'Auflösung', type: 'select', default: '150', options: [['100', '100 dpi (klein)'], ['150', '150 dpi (Standard)'], ['200', '200 dpi'], ['300', '300 dpi (gross)']] },
    ],
  },
  watermark: {
    title: 'Wasserzeichen', icon: '💧', color: '#0284c7', accept: PDF, picker: true,
    desc: 'Text oder Bild über bzw. hinter den Inhalt legen.',
    fields: [
      { name: 'kind', label: 'Art', type: 'select', default: 'text', options: [['text', 'Text'], ['image', 'Bild']] },
      { name: 'text', label: 'Text', type: 'text', default: 'VERTRAULICH', showIf: { kind: 'text' } },
      { name: 'image', label: 'Bild', type: 'image', showIf: { kind: 'image' } },
      { name: 'imgscale', label: 'Bildbreite (% der Seite)', type: 'number', default: 40, showIf: { kind: 'image' } },
      { name: 'size', label: 'Schriftgrösse', type: 'number', default: 60, showIf: { kind: 'text' } },
      { name: 'color', label: 'Farbe', type: 'color', default: '#cc0000', showIf: { kind: 'text' } },
      { name: 'angle', label: 'Winkel (°)', type: 'number', default: 45, showIf: { kind: 'text' } },
      { name: 'opacity', label: 'Deckkraft', type: 'range', default: 30, min: 5, max: 100, unit: '%' },
      { name: 'layout', label: 'Anordnung', type: 'select', default: 'center', options: [['center', 'Einmal mittig'], ['tiled', 'Gekachelt (ganze Seite)']] },
      { name: 'layer', label: 'Ebene', type: 'select', default: 'over', options: [['over', 'Über dem Inhalt'], ['behind', 'Hinter dem Inhalt']] },
      PAGES_FIELD,
    ],
  },
  page_numbers: {
    title: 'Seitenzahlen', icon: '#️⃣', color: '#4f46e5', accept: PDF, picker: true,
    desc: 'Seitenzahlen hinzufügen – Position, Format und Startnummer frei wählbar.',
    fields: [
      { name: 'position', label: 'Position', type: 'select', default: 'bottom-center', options: [
        ['bottom-center', 'Unten Mitte'], ['bottom-right', 'Unten rechts'], ['bottom-left', 'Unten links'],
        ['top-center', 'Oben Mitte'], ['top-right', 'Oben rechts'], ['top-left', 'Oben links']] },
      { name: 'format', label: 'Format', type: 'text', default: 'Seite {n} von {total}', hint: '{n} = Seitenzahl, {total} = Gesamtzahl' },
      { name: 'start', label: 'Erste Nummer', type: 'number', default: 1 },
      { name: 'size', label: 'Schriftgrösse', type: 'number', default: 10 },
      { name: 'margin', label: 'Randabstand (mm)', type: 'number', default: 10 },
      { name: 'color', label: 'Farbe', type: 'color', default: '#333333' },
      PAGES_FIELD,
    ],
  },
  crop: {
    title: 'PDF zuschneiden', icon: '✂️', color: '#be123c', accept: PDF, picker: true,
    desc: 'Ränder abschneiden (in Millimetern).',
    fields: [
      { name: 'top', label: 'Oben (mm)', type: 'number', default: 10 },
      { name: 'right', label: 'Rechts (mm)', type: 'number', default: 10 },
      { name: 'bottom', label: 'Unten (mm)', type: 'number', default: 10 },
      { name: 'left', label: 'Links (mm)', type: 'number', default: 10 },
      PAGES_FIELD,
    ],
  },
  flatten: {
    title: 'PDF verflachen', icon: '🥞', color: '#78716c', accept: PDF,
    desc: 'Formularfelder und Kommentare fest einbrennen, damit nichts mehr verändert werden kann.',
  },
  metadata: {
    title: 'Metadaten', icon: '🏷️', color: '#a16207', accept: PDF,
    desc: 'Titel, Autor usw. ändern oder alle Metadaten entfernen.',
    fields: [
      { name: 'clear', label: 'Alle Metadaten entfernen', type: 'checkbox', default: false },
      { name: 'title', label: 'Titel', type: 'text', showIf: { clear: false } },
      { name: 'author', label: 'Autor', type: 'text', showIf: { clear: false } },
      { name: 'subject', label: 'Betreff', type: 'text', showIf: { clear: false } },
      { name: 'keywords', label: 'Stichwörter', type: 'text', showIf: { clear: false } },
    ],
  },
  merge: {
    title: 'PDF zusammenfügen', icon: '🧩', color: '#e5322d', accept: PDF + ',' + IMG, multiple: true, sortable: true,
    desc: 'Mehrere PDFs (und Bilder) in der gewünschten Reihenfolge zu einem PDF kombinieren. Reihenfolge per Ziehen ändern.',
    fields: [{ name: 'bookmarks', label: 'Lesezeichen pro Datei anlegen', type: 'checkbox', default: false }],
  },
  split: {
    title: 'PDF teilen', icon: '🪓', color: '#ea580c', accept: PDF,
    desc: 'Ein PDF in mehrere Dateien aufteilen.',
    fields: [
      { name: 'mode', label: 'Aufteilen', type: 'select', default: 'ranges', options: [['ranges', 'Nach Bereichen'], ['every', 'Alle N Seiten'], ['single', 'Jede Seite einzeln']] },
      { name: 'ranges', label: 'Bereiche', type: 'text', placeholder: '1-3, 4-6, 7-ende', hint: 'Jeder Bereich wird eine eigene Datei.', showIf: { mode: 'ranges' } },
      { name: 'every', label: 'Seiten pro Datei', type: 'number', default: 2, showIf: { mode: 'every' } },
    ],
  },
  remove: {
    title: 'Seiten entfernen', icon: '🗑️', color: '#dc2626', accept: PDF, picker: true,
    desc: 'Einzelne Seiten aus dem PDF löschen. Seiten anklicken oder eingeben.',
    fields: [{ ...PAGES_FIELD, label: 'Zu entfernende Seiten', placeholder: 'z. B. 2, 5-7' }],
  },
  extract: {
    title: 'Seiten extrahieren', icon: '📤', color: '#16a34a', accept: PDF, picker: true,
    desc: 'Ausgewählte Seiten in ein neues PDF übernehmen.',
    fields: [
      { ...PAGES_FIELD, label: 'Zu übernehmende Seiten', placeholder: 'z. B. 1, 3-4' },
      { name: 'separate', label: 'Jede Seite als eigene Datei (ZIP)', type: 'checkbox', default: false },
    ],
  },
  organize: {
    title: 'PDF organisieren', icon: '🗂️', color: '#d97706', accept: PDF, multiple: true, custom: 'organize',
    desc: 'Seiten per Ziehen sortieren, drehen, duplizieren, löschen oder leere Seiten einfügen. Auch über mehrere PDFs hinweg.',
  },
  rotate: {
    title: 'PDF drehen', icon: '🔄', color: '#9333ea', accept: PDF, picker: true,
    desc: 'Alle oder einzelne Seiten drehen.',
    fields: [
      { name: 'angle', label: 'Drehung', type: 'select', default: '90', options: [['90', '90° im Uhrzeigersinn'], ['180', '180°'], ['270', '90° gegen den Uhrzeigersinn']] },
      PAGES_FIELD,
    ],
  },
  compress: {
    title: 'PDF verkleinern', icon: '🗜️', color: '#059669', accept: PDF,
    desc: 'Dateigrösse reduzieren, indem Bilder neu berechnet und Daten optimiert werden.',
    fields: [
      { name: 'level', label: 'Stärke', type: 'cards', default: 'empfohlen', options: [
        ['niedrig', 'Gering', 'Beste Qualität'], ['empfohlen', 'Empfohlen', 'Gute Qualität, viel kleiner'],
        ['extrem', 'Stark', 'Kleinste Datei, sichtbarer Qualitätsverlust'], ['raster', 'Maximal', 'Seiten als Bild – Text nicht mehr markierbar'] ] },
      { name: 'dpi', label: 'Auflösung (dpi)', type: 'number', default: 100, showIf: { level: 'raster' } },
      { name: 'gray', label: 'In Graustufen umwandeln', type: 'checkbox', default: false },
    ],
  },
  repair: {
    title: 'PDF reparieren', icon: '🩹', color: '#0891b2', accept: PDF,
    desc: 'Beschädigte oder fehlerhafte PDFs neu aufbauen.',
  },
  ocr: {
    title: 'OCR – Text erkennen', icon: '🔎', color: '#2563eb', accept: PDF, needs: 'ocr',
    desc: 'Gescannte PDFs durchsuchbar und kopierbar machen (unsichtbare Textebene).',
    fields: [
      { name: 'lang', label: 'Sprache', type: 'select', default: 'deu+eng', options: [['deu+eng', 'Deutsch + Englisch'], ['deu', 'Deutsch'], ['eng', 'Englisch'], ['fra', 'Französisch'], ['ita', 'Italienisch'], ['deu+eng+fra+ita', 'DE + EN + FR + IT']] },
      { name: 'only_empty', label: 'Nur Seiten ohne vorhandenen Text', type: 'checkbox', default: true },
    ],
  },
  grayscale: {
    title: 'In Graustufen', icon: '🌗', color: '#525252', accept: PDF,
    desc: 'Farbiges PDF in Schwarz-Weiss/Graustufen umwandeln (Seiten werden zu Bildern).',
    fields: [{ name: 'dpi', label: 'Auflösung', type: 'select', default: '150', options: [['100', '100 dpi'], ['150', '150 dpi'], ['200', '200 dpi'], ['300', '300 dpi']] }],
  },
  images_to_pdf: {
    title: 'Bilder in PDF', icon: '🖼️', color: '#ca8a04', accept: IMG, multiple: true, sortable: true,
    desc: 'JPG, PNG, HEIC & Co. zu einem PDF zusammenfassen.',
    fields: [
      { name: 'size', label: 'Seitengrösse', type: 'select', default: 'a4', options: [['a4', 'A4'], ['letter', 'US Letter'], ['a5', 'A5'], ['a3', 'A3'], ['fit', 'Wie das Bild']] },
      { name: 'orientation', label: 'Ausrichtung', type: 'select', default: 'auto', options: [['auto', 'Automatisch'], ['portrait', 'Hochformat'], ['landscape', 'Querformat']] },
      { name: 'margin', label: 'Rand (mm)', type: 'number', default: 0 },
    ],
  },
  office_to_pdf: {
    title: 'Office in PDF', icon: '📄', color: '#1d4ed8', accept: OFFICE, multiple: true, needs: 'office',
    desc: 'Word, Excel, PowerPoint, OpenDocument, HTML und Text in PDF umwandeln.',
    fields: [{ name: 'merge', label: 'Mehrere Dateien zu einem PDF zusammenfügen', type: 'checkbox', default: false }],
  },
  pdf_to_images: {
    title: 'PDF in Bilder', icon: '📸', color: '#d97706', accept: PDF, picker: true,
    desc: 'Jede Seite als JPG oder PNG speichern.',
    fields: [
      { name: 'format', label: 'Format', type: 'select', default: 'jpg', options: [['jpg', 'JPG'], ['png', 'PNG']] },
      { name: 'dpi', label: 'Auflösung', type: 'select', default: '150', options: [['72', '72 dpi'], ['150', '150 dpi'], ['200', '200 dpi'], ['300', '300 dpi (Druck)']] },
      PAGES_FIELD,
    ],
  },
  pdf_to_word: {
    title: 'PDF in Word', icon: '📝', color: '#2563eb', accept: PDF, needs: 'pdf2docx',
    desc: 'PDF in ein bearbeitbares Word-Dokument (.docx) umwandeln.',
  },
  pdf_to_office: {
    title: 'PDF in PowerPoint / Excel', icon: '📊', color: '#c2410c', accept: PDF,
    desc: 'PowerPoint: jede Seite wird eine Folie. Excel/ODT über LibreOffice (experimentell).',
    fields: [{ name: 'target', label: 'Ziel', type: 'select', default: 'pptx', options: [['pptx', 'PowerPoint (.pptx)'], ['xlsx', 'Excel (.xlsx) – benötigt LibreOffice'], ['odt', 'OpenDocument Text (.odt) – benötigt LibreOffice']] }],
  },
  extract_text: {
    title: 'Text extrahieren', icon: '🔤', color: '#334155', accept: PDF,
    desc: 'Den gesamten Text als .txt-Datei speichern.',
  },
  extract_images: {
    title: 'Bilder extrahieren', icon: '🧲', color: '#0d9488', accept: PDF,
    desc: 'Alle im PDF eingebetteten Bilder in Originalqualität herauslösen.',
  },
  protect: {
    title: 'PDF schützen', icon: '🔒', color: '#1e293b', accept: PDF,
    desc: 'Mit Passwort verschlüsseln (AES-256).',
    fields: [
      { name: 'password', label: 'Passwort', type: 'password' },
      { name: 'password2', label: 'Passwort wiederholen', type: 'password' },
      { name: 'allow_print', label: 'Drucken erlauben', type: 'checkbox', default: true },
      { name: 'allow_copy', label: 'Kopieren erlauben', type: 'checkbox', default: true },
      { name: 'allow_edit', label: 'Bearbeiten erlauben', type: 'checkbox', default: false },
    ],
  },
  unlock: {
    title: 'PDF entsperren', icon: '🔓', color: '#65a30d', accept: PDF,
    desc: 'Passwortschutz und Einschränkungen entfernen (Passwort nötig, falls zum Öffnen verlangt).',
    fields: [{ name: 'password', label: 'Passwort (falls bekannt)', type: 'password' }],
  },
  redact: {
    title: 'Schwärzen', icon: '⬛', color: '#000000', accept: PDF,
    desc: 'Begriffe dauerhaft entfernen – der Text ist danach wirklich weg, nicht nur überdeckt. Freie Bereiche: im Editor „Schwärzen“ verwenden.',
    fields: [
      { name: 'terms', label: 'Begriffe (einer pro Zeile)', type: 'textarea', placeholder: 'Max Muster\n079 123 45 67' },
      { name: 'emails', label: 'Alle E-Mail-Adressen', type: 'checkbox', default: false },
      { name: 'iban', label: 'Alle IBANs', type: 'checkbox', default: false },
      { name: 'phones', label: 'Alle Telefonnummern', type: 'checkbox', default: false },
    ],
  },
  compare: {
    title: 'PDFs vergleichen', icon: '⚖️', color: '#7e22ce', accept: PDF, multiple: true, custom: 'compare', max: 2,
    desc: 'Zwei Versionen nebeneinander vergleichen – Unterschiede im Text werden hervorgehoben.',
  },
};
