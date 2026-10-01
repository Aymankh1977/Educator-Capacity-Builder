# Content changelog

Every change to the files in `content/` is recorded here: the version, what changed, and why (the evidence).
Status values: `draft`, `delphi-reviewed`, `validated`. All content is currently `draft`.

## 0.3.0 — Iteration 0 (v3)

- **Architecture.** Framework content moved out of `lib/realai.js` into versioned JSON files in `content/`. Every object now carries `id`, `version`, `status`, `provenance` and `ar_status`. Why: DR8 (design must be revisable from Studies 2–3 and the Delphi without code changes); DP6.
- **Pillars (`pillars.json`).** Text unchanged from v2. Marked `definitionStatus: "working"` and shown in the interface as "Working definition, pending alignment with the published framework". Why: the verbatim definitions from the REAL-AI paper are still to be supplied (`realai-definitions.md`).
- **Practice instrument (`items-practice.json`).** The 16 v1/v2 items carried over unchanged, now labelled draft instrument v0.3. Why: they remain researcher-drafted, face-valid items pending Delphi review (Study 5).
- **Institutional-conditions instrument (`items-institutional.json`).** New: 9 items across Scott's regulative, normative and cultural-cognitive pillars (IC-C1 and IC-C2 reverse-scored), plus the decoupling probe IC-D1, reported separately. Why: DR2 (profile institutional conditions alongside practice); DR7 (decoupling probe).
- **Design principles (`design-principles.json`).** New: DP1–DP7, Iteration 0, draft for Delphi review.
- **Arabic.** All Arabic text is marked `ar_status: "draft — needs human review"`.
