# Content changelog

Every change to the files in `content/` is recorded here: the version, what changed, and why (the evidence).
Status values: `draft`, `delphi-reviewed`, `validated`. All content is currently `draft`.

## 0.3.0 — Iteration 0 (v3)

- **Architecture.** Framework content moved out of `lib/realai.js` into versioned JSON files in `content/`. Every object now carries `id`, `version`, `status`, `provenance` and `ar_status`. Why: DR8 (design must be revisable from Studies 2–3 and the Delphi without code changes); DP6.
- **Pillars (`pillars.json`).** Text unchanged from v2. Marked `definitionStatus: "working"` and shown in the interface as "Working definition, pending alignment with the published framework". Why: the verbatim definitions from the REAL-AI paper are still to be supplied (`realai-definitions.md`).
- **Practice instrument (`items-practice.json`).** The 16 v1/v2 items carried over unchanged, now labelled draft instrument v0.3. Why: they remain researcher-drafted, face-valid items pending Delphi review (Study 5).
- **Institutional-conditions instrument (`items-institutional.json`).** New: 9 items across Scott's regulative, normative and cultural-cognitive pillars (IC-C1 and IC-C2 reverse-scored), plus the decoupling probe IC-D1, reported separately. Why: DR2 (profile institutional conditions alongside practice); DR7 (decoupling probe).
- **Scenarios (`scenarios.json`).** Replaced with seven scenarios in two groups ("Classroom and clinic": SC1, SC2, SC5, SC6; "Programme and institution": SC3, SC4, SC7), each with its own reflection prompt.
  - SC1–SC4 are new and evidence-anchored. Why: DR3 (SC1), DR4 (SC2), DR7 and Meyer and Rowan (1977) (SC3), DR1 and DR5 (SC4).
  - SC5–SC7 keep their v2 text unchanged (previously `feedback-tool`, `reflections`, `module-policy`; recorded as `legacyId`) and gain provenance.
  - The v2 radiograph scenario is retired and superseded by SC1, which addresses the same situation with an evidence anchor (DR3). It is kept in the file with `retired: true` only so that earlier practice-log entries still display.
- **Design principles (`design-principles.json`).** New: DP1–DP7, Iteration 0, draft for Delphi review.
- **Arabic.** All Arabic text is marked `ar_status: "draft — needs human review"`.
