// Übungsvideos auf YouTube: je Übung mehrere Kandidaten in Wunschreihenfolge
// (bevorzugt von Frauen gezeigt, dann deutschsprachig). Die IDs stammen aus Suchergebnissen;
// ob ein Video noch verfügbar und einbettbar ist, prüft /api/videos täglich über YouTube-oEmbed.
export const VIDEO_CANDIDATES = {
  goblet_squat: ["kqO2OSbtm9c", "FQiMMHcWLLM", "I-41oPS373Y"],
  rdl: ["J3AsbKDVfpo", "08StUopZee8", "n9HS63PRILs"],
  incline_pushup: ["0CcVzNxrcdc", "xPxn9OLe7xQ"],
  one_arm_row: ["nehAvSrfUOg", "OjOqK2qS6-I"],
  plank: ["0Zr5Zj348Y8", "Y9ZRIlKG5xY", "OVJVdSEj9XM"],
  hip_thrust: ["yGS4x29B0fs", "3S7Y7htTdRU"],
  reverse_lunge: ["pPq5jrCnIuM", "f0UrZLvp3Dw", "ALl174GTuoY"],
  seated_press: ["qGtDCtYeRQM", "UT__oNcm6b8", "N1OPsP_Er0w"],
  band_pulldown: ["JlF6tkFRnco", "BzhnBfHf8Gw"],
  dead_bug: ["MLBmEWM07kE", "WHmEHsyUlX0"],
  step_up: ["5QRlS3Ubs7s", "G3990dTiIZY"],
  kb_deadlift: ["jdSqCs3WUuE", "Goi5qldlUf8"],
  db_bench: ["NtxDZxQHBwY", "2qOOGrcxuTE", "5Y3VZsLb1Ys"],
  farmers_walk: ["KBXAJnbr0Dk", "VBobkldqqvk"],
  jumps: ["tZ8gy_V6bxM", "2VD8I132byk", "0hU6do4RnOU"],
  cat_cow: ["UV3HnCpAFgw", "QA8_d7Lalso"],
  hip_flexor: ["LHB60511Rjw"],
  pelvic_floor: ["Zb1ntVeMCww", "j-Wya88L8d8", "rRugDMcy3qI", "GA9crVO85-A"],
  thoracic_rotation: ["R0MIgeQztW4", "YcrYwyJ6gtc"],
  box_breathing: ["wazCdqIBi2c", "lxlA_AcMF4M"],
  breathing_478: ["oQTIrRQ3DQo", "9ZhSpvxiAnY"],
  stopp: ["tStXi7f7Vgk", "p_ZZ_D8cCtI", "NT2IRxCplmE"],
  grounding: ["TsIGZklzSyc", "LteBsU-ySqA", "zZeZ0dslEq8"],
  body_scan: ["W4PEcGzMq28", "trfc1RtpImM", "LWZ617Kn41E"],
};

async function oembed(id) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent("https://www.youtube.com/watch?v=" + id)}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 86400 } });
    if (!r.ok) return null;
    const j = await r.json();
    return { id, title: String(j.title || "").slice(0, 140), channel: String(j.author_name || "").slice(0, 80) };
  } catch { return null; }
}

// Erstes verfügbares Video je Übung
export async function liveVideos() {
  const out = {};
  await Promise.all(Object.entries(VIDEO_CANDIDATES).map(async ([key, ids]) => {
    for (const id of ids) { const v = await oembed(id); if (v) { out[key] = v; break; } }
  }));
  return out;
}
