// Thin loader over the versioned content files in /content.
// Edit framework content there (and record it in content/CHANGELOG.md), not here.
import pillarsFile from "@/content/pillars.json";
import practiceFile from "@/content/items-practice.json";
import institutionalFile from "@/content/items-institutional.json";
import scenariosFile from "@/content/scenarios.json";
import principlesFile from "@/content/design-principles.json";

const flat = (item) => ({ ...item, en: item.text.en, ar: item.text.ar });

export const PILLARS = pillarsFile.pillars;

export const PRACTICE_INSTRUMENT = practiceFile.instrument;
export const ITEMS = practiceFile.items.map(flat);

export const INSTITUTIONAL_INSTRUMENT = institutionalFile.instrument;
export const IC_PILLARS = institutionalFile.pillars;
export const IC_ITEMS = institutionalFile.items.map(flat);
export const DECOUPLING_ITEM = flat(institutionalFile.decouplingProbe);

// `pillar` (the first listed pillar) is kept for pages that colour a scenario by one pillar.
export const SCENARIOS = scenariosFile.scenarios.map((s) => ({ ...s, pillar: s.pillars[0] }));

export const DESIGN_PRINCIPLES = principlesFile.principles;

export const pillarByKey = (k) => PILLARS.find((p) => p.key === k);

// Mean score per pillar (1–5), or null if a pillar has no answers yet.
export function pillarMeans(answers) {
  const out = {};
  for (const p of PILLARS) {
    const vals = ITEMS.filter((i) => i.pillar === p.key).map((i) => answers[i.id]).filter(Boolean);
    out[p.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  return out;
}

// 1–5 mean mapped to 0–100 fill.
export const toPct = (mean) => (mean == null ? 0 : Math.round(((mean - 1) / 4) * 100));
