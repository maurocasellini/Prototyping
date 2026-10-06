/* English texts of Voice to Text (source texts are German). */
window.I18N_EN = {
  'Voice to Text': 'Voice to Text', 'Transkription': 'Transcription', 'Sprachmemo · Meeting · Interview': 'Voice memo · Meeting · Interview',
  'Gesprochenes wird': 'Speech becomes', 'Text': 'text',
  'Sprachnachricht, Meeting-Aufnahme oder Video hineinziehen – oder direkt aufnehmen. Whisper schreibt mit, inklusive Zeitmarken. Alles läuft auf deinem Gerät.':
    'Drop in a voice message, meeting recording or video – or record right here. Whisper writes it down, with timestamps. Everything runs on your device.',
  'Datei wählen': 'Choose file', 'Aufnehmen': 'Record',
  'Whisper von OpenAI – läuft lokal im Browser': 'Whisper by OpenAI – runs locally in your browser',
  'Deutsch, Englisch, Französisch, Italienisch & mehr': 'German, English, French, Italian & more',
  'Export als Text oder Untertitel (SRT/VTT)': 'Export as text or subtitles (SRT/VTT)',
  'Audio- oder Videodatei hierher ziehen': 'Drop an audio or video file here',
  'WhatsApp-Sprachnachricht, Memo, MP3, M4A, WAV, MP4 …': 'WhatsApp voice message, memo, MP3, M4A, WAV, MP4 …',
  'Aufnahme läuft': 'Recording', '■ Stopp & transkribieren': '■ Stop & transcribe', 'Verwerfen': 'Discard',
  'Datei': 'File', 'Sprache': 'Language', 'Deutsch': 'German', 'Englisch': 'English',
  'Französisch': 'French', 'Italienisch': 'Italian', 'Spanisch': 'Spanish', 'Portugiesisch': 'Portuguese', 'Niederländisch': 'Dutch',
  'Modell': 'Model', 'Ausgewogen (Whisper Base, 77 MB)': 'Balanced (Whisper Base, 77 MB)', 'Sehr genau (Whisper Small, 250 MB – Computer)': 'Most accurate (Whisper Small, 250 MB – computer)', 'Schnell (Whisper Tiny, 41 MB)': 'Fast (Whisper Tiny, 41 MB)',
  'Transkribieren': 'Transcribe',
  'Das Modell wird beim ersten Mal geladen und danach im Browser gespeichert. Faustregel: eine Minute Audio braucht je nach Gerät 10–40 Sekunden.':
    'The model is downloaded the first time and then kept in the browser. Rule of thumb: one minute of audio takes 10–40 seconds, depending on the device.',
  'Modell wird geladen …': 'Loading model …', 'Wird transkribiert …': 'Transcribing …', 'noch ca.': 'about', 'Audio wird gelesen …': 'Reading audio …',
  'Format wird umgewandelt …': 'Converting format …', 'Zeitmarken': 'Timestamps', 'Kopieren': 'Copy',
  'Andere Datei transkribieren': 'Transcribe another file', '… wird geschrieben': '… writing',
  'Kein Zugriff aufs Mikrofon. Bitte in den Browser-Einstellungen erlauben.': 'No access to the microphone. Please allow it in your browser settings.',
  'Aufnahme': 'Recording', 'Die Aufnahme ist zu kurz oder leer.': 'The recording is too short or empty.',
  'Die Spracherkennung konnte nicht gestartet werden.': 'Speech recognition could not be started.',
  'Kein gesprochener Text erkannt.': 'No speech recognized.', 'Transkription fehlgeschlagen: ': 'Transcription failed: ',
  'Noch kein Text vorhanden.': 'No text yet.', 'Text kopiert.': 'Text copied.', 'Kopieren nicht möglich.': 'Copying is not possible.',
  'Bitte warten, bis die Transkription fertig ist.': 'Please wait until the transcription is finished.',
  'Voice to Text · CM Ventures': 'Voice to Text · CM Ventures',
  'Die Transkription läuft vollständig in deinem Browser. Audio wird nur im Arbeitsspeicher deines Geräts verarbeitet und nie an einen Server gesendet – die Seite darf technisch keine Verbindung zu anderen Servern aufbauen (Content Security Policy). Mikrofon-Aufnahmen werden nicht gespeichert.':
    'Transcription runs entirely in your browser. Audio is only processed in your device’s memory and never sent to a server – the page is technically not allowed to connect to other servers (Content Security Policy). Microphone recordings are not stored.',
  'Open Source': 'Open source',
  'Spracherkennung: Whisper von OpenAI (MIT), als ONNX-Modell ausgeführt mit Transformers.js (Apache 2.0) und ONNX Runtime Web (MIT). Formate, die der Browser nicht selbst lesen kann (z. B. WhatsApp-Sprachnachrichten auf dem iPhone), werden mit FFmpeg (LGPL/GPL) umgewandelt.':
    'Speech recognition: Whisper by OpenAI (MIT), run as an ONNX model with Transformers.js (Apache 2.0) and ONNX Runtime Web (MIT). Formats the browser cannot read itself (e.g. WhatsApp voice messages on iPhone) are converted with FFmpeg (LGPL/GPL).',
  'Genauigkeit': 'Accuracy',
  'Whisper ist sehr gut, aber nicht fehlerfrei – besonders bei Dialekt, Fachbegriffen und Namen. Schweizerdeutsch wird in Hochdeutsch wiedergegeben. Wichtige Inhalte bitte gegenlesen.':
    'Whisper is very good, but not perfect – especially with dialects, technical terms and names. Swiss German is written as standard German. Please proofread important content.',
};
window.I18N_RULES = [
  [/^Wird transkribiert … (\d+) %/, 'Transcribing … $1 %'], [/ · noch ca\. /, ' · about '],
  [/^Transkription fehlgeschlagen: /, 'Transcription failed: '],
];
