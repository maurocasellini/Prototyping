/* English texts of the Video Toolkit (source texts are German). */
window.I18N_EN = {
  'Video Toolkit': 'Video Toolkit', 'Video-Toolkit': 'Video toolkit', 'Kürzen · Verkleinern · GIF · Ton': 'Trim · Shrink · GIF · Audio',
  'Videos teilen,': 'Share videos', 'ohne sie hochzuladen': 'without uploading them',
  'Clip kürzen, für WhatsApp oder E-Mail verkleinern, in ein GIF verwandeln oder nur den Ton als MP3 speichern. FFmpeg läuft dafür direkt in deinem Browser.':
    'Trim a clip, shrink it for WhatsApp or email, turn it into a GIF or save just the audio as MP3. FFmpeg runs right in your browser.',
  'Video wählen': 'Choose video', 'MP4, MOV (iPhone), WebM, MKV, AVI': 'MP4, MOV (iPhone), WebM, MKV, AVI',
  'Zielgrösse für WhatsApp & E-Mail': 'Target size for WhatsApp & email', 'FFmpeg als WebAssembly – nichts verlässt dein Gerät': 'FFmpeg as WebAssembly – nothing leaves your device',
  'Video hierher ziehen': 'Drop a video here', 'oder': 'or', 'auswählen': 'browse', 'Video': 'Video',
  'Ausschnitt': 'Selection', 'Start': 'Start', 'Ende': 'End', '⇤ Hier': '⇤ Here', 'Hier ⇥': 'Here ⇥',
  'Aktuelle Position als Start': 'Use current position as start', 'Aktuelle Position als Ende': 'Use current position as end',
  'Was möchtest du?': 'What would you like to do?', 'Verkleinern / kürzen (MP4)': 'Shrink / trim (MP4)', 'GIF erstellen': 'Create GIF',
  'Nur Ton (MP3)': 'Audio only (MP3)', 'Ton entfernen': 'Remove audio', 'Ziel': 'Target', 'Ausgewogen (gute Qualität)': 'Balanced (good quality)',
  'WhatsApp (max. 16 MB)': 'WhatsApp (max. 16 MB)', 'E-Mail (max. 20 MB)': 'Email (max. 20 MB)', 'Möglichst klein': 'As small as possible',
  'Auflösung': 'Resolution', 'Wie Original': 'Same as original', 'Breite': 'Width', 'Bilder pro Sekunde': 'Frames per second',
  'Tipp: GIFs werden schnell gross – am besten nur wenige Sekunden auswählen.': 'Tip: GIFs get big quickly – best to select just a few seconds.',
  'Los': 'Go', 'Läuft auf deinem Gerät. Längere Videos brauchen etwas Geduld – der Tab muss dabei offen bleiben.': 'Runs on your device. Longer videos take a while – keep this tab open.',
  'Fertig': 'Done', 'Teilen / Sichern': 'Share / Save', 'Herunterladen': 'Download', 'Anderes Video': 'Another video',
  'wird analysiert …': 'analyzing …', 'Video-Engine wird geladen (ca. 32 MB) …': 'Loading video engine (about 32 MB) …', 'Wird umgewandelt …': 'Converting …', 'noch ca.': 'about',
  'Der Ausschnitt ist für diese Grösse zu lang – bitte kürzen.': 'The selection is too long for this size – please trim it.',
  'FFmpeg konnte die Datei nicht umwandeln.': 'FFmpeg could not convert the file.', 'Umwandlung fehlgeschlagen: ': 'Conversion failed: ',
  'Das Ergebnis ist grösser als das Original – das Video ist bereits sehr effizient gespeichert (z. B. HEVC vom iPhone). Tipp: kleinere Auflösung oder „Möglichst klein“ wählen.': 'The result is larger than the original – the video is already stored very efficiently (e.g. HEVC from an iPhone). Tip: choose a lower resolution or “As small as possible”.',
  'Bitte warten, bis die Umwandlung fertig ist.': 'Please wait until the conversion is finished.',
  'Das Video-Toolkit läuft vollständig in deinem Browser. Videos werden nur im Arbeitsspeicher deines Geräts verarbeitet und nie an einen Server gesendet – die Seite darf technisch keine Verbindung zu anderen Servern aufbauen (Content Security Policy).':
    'The video toolkit runs entirely in your browser. Videos are only processed in your device’s memory and never sent to a server – the page is technically not allowed to connect to other servers (Content Security Policy).',
  'Open Source': 'Open source',
  'FFmpeg (LGPL/GPL) als WebAssembly über ffmpeg.wasm (MIT), mit x264, LAME und weiteren Codecs. Die Engine (ca. 32 MB) wird beim ersten Mal geladen und danach im Browser gespeichert.':
    'FFmpeg (LGPL/GPL) as WebAssembly via ffmpeg.wasm (MIT), with x264, LAME and other codecs. The engine (about 32 MB) is downloaded the first time and then kept in the browser.',
  'Grenzen': 'Limits',
  'Die Umwandlung läuft auf dem Prozessor deines Geräts und ist langsamer als spezialisierte Apps. Sehr grosse Videos (über ca. 1 GB) können den Speicher des Browsers übersteigen.':
    'Conversion runs on your device’s processor and is slower than specialized apps. Very large videos (over about 1 GB) can exceed the browser’s memory.',
};
window.I18N_RULES = [
  [/^Wird umgewandelt … (\d+) %/, 'Converting … $1 %'], [/ · noch ca\. /, ' · about '], [/wird analysiert …/, 'analyzing …'],
  [/^Umwandlung fehlgeschlagen: /, 'Conversion failed: '],
];
