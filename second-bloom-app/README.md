# Second Bloom

Begleiter für Frauen in Perimenopause und Menopause: Check-in, Erholung aus Uhr und Ring, Zyklus, Ernährung (Wochenplan, Einkaufsliste, Rezepte aus dem Kühlschrank), Krafttraining, Mental Coaching, Mikronährstoffe und Hormonwissen.

Technik und Datenlogik folgen Formstand (`maurocasellini/formstand`).

## Stack
- Next.js 15 (App Router) auf Vercel
- Vercel Blob (privat) als Dokumentenspeicher mit ETag-Schutz (`lib/store.js`, aus Formstand)
- Konten mit bcrypt und signiertem Cookie (`lib/auth.js`), Start-Konto **ADMIN / ADMIN** (muss beim ersten Login das Passwort ändern, wird gesperrt, sobald eine andere Admin ein eigenes Passwort hat)
- Geräte über intervals.icu (Garmin, Oura, WHOOP, Polar, COROS, Suunto): persönlicher API-Schlüssel, AES-256-GCM verschlüsselt, täglicher Abgleich per Cron
- Claude-API: Haiku 4.5 für alle Texte, Sonnet 5.5 mit Aufwand „low“ nur für Fotos; Monats- und Tageslimits, Kosten im Admin
- Die App-Oberfläche ist ein schlankes Vanilla-JS-Programm (`public/sb-app.js`), der Zustand liegt pro Konto in `db/u/<id>/state.json`

## Datenablage (Blob, Präfix `db/`)
| Dokument | Inhalt |
|---|---|
| `users.json` | Konten (Passwort als bcrypt-Hash) |
| `settings.json` | Registrierung offen, Claude-Schlüssel (verschlüsselt), Monatslimit |
| `ai_usage.json`, `ai_daily.json` | KI-Kosten pro Monat, Aufrufe pro Tag |
| `u/<id>/state.json` | App-Zustand: Profil, Check-ins, Ernährung, Training, Mental, Plan, Einkauf |
| `u/<id>/connections.json` | Geräte-Verbindungen |
| `u/<id>/daily.json` | Tageswerte der Uhr |

## Umgebungsvariablen
| Name | Zweck |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | kommt automatisch mit Vercel Blob |
| `ENCRYPTION_KEY` | 32 Bytes base64, verschlüsselt Schlüssel und signiert Sitzungen |
| `CRON_SECRET` | schützt den täglichen Abgleich |
| `ANTHROPIC_API_KEY` | optional (sensitive); alternativ im Admin hinterlegen |

## Lokal
```
npm install
# .env.local: LOCAL_STORE=./.local-store  SESSION_SECRET=…
npm run build && npm start
```
