// Generates research/*.md from the versioned content files, so the documents cannot drift from the platform.
// Run with: npm run research:docs   (re-run after any change to content/*.json)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, "content", f), "utf8"));
const write = (f, body) => fs.writeFileSync(path.join(root, "research", f), body.trimEnd() + "\n");
const header = (src) => `<!-- Generated from ${src} by \`npm run research:docs\`. Do not edit by hand: edit the JSON and re-run. -->\n\n`;
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

// Conjecture map
const cm = read("conjecture-map.json");
write("conjecture-map.md", header("content/conjecture-map.json") + `# Conjecture map (${cm.iteration})

${cm.note}

**High-level conjecture.** ${cm.highLevel}

## Embodiment (what the platform contains)

${cm.embodiment.map((e) => `- **${e.id}** ${e.text}`).join("\n")}

## Mediating processes (what should happen when educators use it)

${cm.mediating.map((e) => `- **${e.id}** ${e.text}`).join("\n")}

## Outcomes

${cm.outcomesNote}

${cm.outcomes.map((e) => `- **${e.id}** ${e.text}`).join("\n")}

## Conjectures to test

${cm.conjectures}
`);

// Design requirements
const dr = read("design-requirements.json");
write("design-requirements.md", header("content/design-requirements.json") + `# Design requirements (version ${dr.version})

${dr.note}

| ID | Finding | Source | Design requirement |
|---|---|---|---|
${dr.requirements.map((r) => `| ${r.id} | ${cell(r.finding)} | ${cell(r.source)} | ${cell(r.requirement)} |`).join("\n")}
`);

// Design principles
const dp = read("design-principles.json");
write("design-principles.md", header("content/design-principles.json") + `# Design principles (${dp.iteration}, version ${dp.version})

This file is generated from \`content/design-principles.json\`, which is the source of truth. ${dp.note}

${dp.principles.map((d) => `## ${d.id} ${d.title}

${d.statement}

- **Rationale:** ${d.rationale}
- **Provenance:** ${d.provenance.map((p) => `${p.ref} (${p.type}${p.note ? `: ${p.note}` : ""})`).join("; ")}
- **Status:** ${d.statusNote} · **Version:** ${d.version}`).join("\n\n")}
`);

// Instrument codebook
const pr = read("items-practice.json");
const ic = read("items-institutional.json");
const pillars = read("pillars.json").pillars;
const pname = (k) => pillars.find((p) => p.key === k)?.name.en || k;
const icname = (k) => ic.pillars.find((p) => p.id === k)?.name.en || k;
const row = (i, pillar) => `| ${i.id} | ${pillar} | ${i.reverse ? "yes" : "no"} | ${i.version} | ${i.status} | ${cell(i.text.en)} | ${cell(i.text.ar)} |`;
const tableHead = "| ID | Pillar | Reverse-scored | Version | Status | Wording (EN) | Wording (AR, draft) |\n|---|---|---|---|---|---|---|";
const probe = ic.decouplingProbe;
write("instrument-codebook.md", header("content/items-practice.json and content/items-institutional.json") + `# Instrument codebook

Both instruments are **unvalidated drafts**. Scores are self-ratings, not measures of competence, and must not be used for appraisal, promotion or accreditation decisions. All Arabic wording is \`${pr.instrument.ar_status}\`.

Scale for every item: ${pr.instrument.scale.en}.

## Instrument 1: ${pr.instrument.name.en} (version ${pr.instrument.version}, ${pr.instrument.status})

Pillar mean = mean of the four items in that pillar. No reverse-scored items.

${tableHead}
${pr.items.map((i) => row(i, `${i.pillar} (${pname(i.pillar)})`)).join("\n")}

## Instrument 2: ${ic.instrument.name.en} (version ${ic.instrument.version}, ${ic.instrument.status})

${ic.instrument.reverseScoring}

Alignment with Study 3: ${ic.instrument.alignment}

${tableHead}
${ic.items.map((i) => row(i, icname(i.pillar))).join("\n")}

### Decoupling probe (reported separately; not part of any pillar mean)

${tableHead}
${row(probe, "none (separate)")}

Results text shown to the educator (EN): ${probe.resultsText.en}

## CSV export columns (capacity profile page)

| Column | Content |
|---|---|
| participant | Optional participant code typed by the educator |
| timestamp | ISO 8601 time of export |
| lang | Interface language (en or ar) |
| practice_instrument_version | Version of instrument 1 |
| institutional_instrument_version | Version of instrument 2 |
| mean_R, mean_E, mean_A, mean_L | Practice pillar means (2 decimal places) |
| mean_IC_regulative, mean_IC_normative, mean_IC_cultural_cognitive | Institutional pillar means after reverse-scoring |
| reverse_scored_items | Reverse-scored item IDs, separated by semicolons |
| ${[...pr.items, ...ic.items, probe].map((i) => i.id).join(", ")} | Raw responses (1–5), before any reverse-scoring |

No combined score across instruments is calculated or exported.
`);

// Citation register
const cr = read("citation-register.json");
write("citation-register.md", header("content/citation-register.json") + `# Citation register

Copied from Section 9 of the v3 brief (via \`content/citation-register.json\`). These are the only sources the platform may cite. Status: **T** = cited in thesis materials (check against the final thesis reference list); **V** = added in the v3 brief, verify before any thesis use. Format on the rationale page: author–date (Manchester-Harvard). Do not add DOIs.

${cr.fullReferences}

| Short cite | Status | Used for |
|---|---|---|
${cr.sources.map((s) => `| ${cell(s.short)}${s.detail ? `, ${cell(s.detail)}` : ""} | ${s.status} | ${cell(s.usedFor)} |`).join("\n")}
`);

console.log("research docs written: conjecture-map, design-requirements, design-principles, instrument-codebook, citation-register");
