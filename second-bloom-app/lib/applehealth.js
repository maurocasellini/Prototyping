// Apple Health: Auswertung des Exports (export.xml aus «Alle Gesundheitsdaten exportieren») zu Tageswerten.
// Läuft im Browser: die Datei verlässt das Gerät nicht, an den Server gehen nur die Tageswerte.
const ASLEEP = /HKCategoryValueSleepAnalysisAsleep/;          // Core, Deep, REM, Unspecified, Asleep
const NO_FLOW = /None$/;                                       // HKCategoryValueMenstrualFlowNone / VaginalBleedingNone
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };
// "2024-05-01 23:10:00 +0200" → Date
const toDate = (s) => new Date(String(s).replace(" ", "T").replace(" ", "").replace(/([+-]\d\d)(\d\d)$/, "$1:$2"));

export function createAggregator(sinceDay) {
  const days = {};          // day → Sammelwerte
  const d = (day) => (days[day] ||= { sleep: {}, steps: {}, hrv: [], rhr: [], spo2: [], resp: [], weight: null, period: false });
  let records = 0;
  function record(tag) {
    const type = attr(tag, "type"); if (!type) return;
    const start = attr(tag, "startDate"), end = attr(tag, "endDate") || start;
    if (!start) return;
    const day = String(type.endsWith("SleepAnalysis") ? end : start).slice(0, 10);
    if (day < sinceDay) return;
    const src = attr(tag, "sourceName") || "?", val = attr(tag, "value"), num = Number(val);
    records++;
    switch (type) {
      case "HKCategoryTypeIdentifierSleepAnalysis":
        if (ASLEEP.test(val || "")) { const h = (toDate(end) - toDate(start)) / 36e5; if (h > 0 && h < 16) d(day).sleep[src] = (d(day).sleep[src] || 0) + h; }
        break;
      case "HKQuantityTypeIdentifierStepCount": if (num > 0) d(day).steps[src] = (d(day).steps[src] || 0) + num; break;
      case "HKQuantityTypeIdentifierHeartRateVariabilitySDNN": if (num > 0) d(day).hrv.push(num); break;
      case "HKQuantityTypeIdentifierRestingHeartRate": if (num > 0) d(day).rhr.push(num); break;
      case "HKQuantityTypeIdentifierOxygenSaturation": if (num > 0) d(day).spo2.push(num <= 1 ? num * 100 : num); break;
      case "HKQuantityTypeIdentifierRespiratoryRate": if (num > 0) d(day).resp.push(num); break;
      case "HKQuantityTypeIdentifierBodyMass": if (num > 0) d(day).weight = /lb/i.test(attr(tag, "unit") || "") ? num * 0.4536 : num; break;
      case "HKCategoryTypeIdentifierMenstrualFlow": if (val && !NO_FLOW.test(val)) d(day).period = true; break;
    }
  }
  // Teilstück des XML einlesen; unvollständige Tags am Ende werden für das nächste Stück aufgehoben
  let carry = "";
  function feed(text) {
    const s = carry + text;
    const re = /<Record\s[^>]*>/g;
    let m, last = 0;
    while ((m = re.exec(s))) { record(m[0]); last = re.lastIndex; }
    // ab dem letzten «<» nach dem letzten vollständigen Eintrag aufheben (auch angeschnittene wie «<Rec»)
    const tail = s.slice(last), lt = tail.lastIndexOf("<");
    carry = lt >= 0 ? tail.slice(lt) : "";
    if (carry.length > 100000) carry = ""; // Schutz bei kaputten Dateien
  }
  const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  const r1 = (x, k = 1) => x == null ? null : Math.round(x * 10 ** k) / 10 ** k;
  // Mehrere Quellen (iPhone + Uhr) zählen dasselbe doppelt: je Tag die Quelle mit dem höchsten Wert nehmen
  const maxSrc = (o) => { const v = Object.values(o); return v.length ? Math.max(...v) : null; };
  function result() {
    const rows = Object.entries(days).map(([day, x]) => {
      const row = {
        day, sleep_h: r1(maxSrc(x.sleep), 2), steps: x.steps && maxSrc(x.steps) != null ? Math.round(maxSrc(x.steps)) : null,
        hrv: r1(avg(x.hrv)), rhr: r1(avg(x.rhr)), spo2: r1(avg(x.spo2)), respiration: r1(avg(x.resp)), weight: r1(x.weight),
        phase: x.period ? "PERIOD" : null,
      };
      return Object.entries(row).some(([k, v]) => k !== "day" && v != null) ? row : null;
    }).filter(Boolean).sort((a, b) => (a.day < b.day ? -1 : 1));
    return { rows, records };
  }
  return { feed, result };
}
