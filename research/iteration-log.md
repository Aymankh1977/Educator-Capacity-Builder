# Iteration log

Each entry records what changed in the design, why, and any evidence for or against the conjectures in the conjecture map (E3→M1, E5→M4→O1, E1→M2→O2).

## Iteration 0 (v3): conjectural prototype from Study 1 and the REAL-AI paper; supersedes v1–v2 researcher-drafted content

- **Date:** 1 October 2026
- **Content version:** 0.3.0
- **Status:** draft; not yet used in the field

### Changes from v2

- **A1 Content architecture.** All framework content moved from code into versioned JSON files in `content/`, each object carrying an ID, version, status, provenance and Arabic-review status. Pillar descriptions are shown as working definitions until the published definitions are supplied. Content changes are recorded in `content/CHANGELOG.md`.
- **A2 "Why this?" panels.** Every scenario and instrument section shows its provenance in plain language, its validation status and its version.
- **A3 Capacity profile.** The readiness check became a two-level capacity profile: the 16 practice items (draft instrument v0.3) and a new institutional-conditions instrument (nine items across Scott's three pillars, two of them reverse-scored, plus a separately reported decoupling probe). Results show the two profiles separately with a fixed "How to read this" box; no combined score exists. The CSV export and the development-plan request include both profiles.
- **A4 Scenario library.** Seven scenarios in two groups, each with its own reflection prompt. SC1–SC4 are new and evidence-anchored; SC5–SC7 keep their v2 text and gain provenance. The v2 radiograph scenario is retired, superseded by SC1. Reflection before rating is unchanged; each saved reflection now records the exact prompt and scenario version shown.
- **A5 Accreditation bridge.** New `/accreditation` page relating the REAL-AI pillars to accreditation themes, with the GDC-alignment framing for Saudi programmes and a fixed caution that outputs are not accreditation evidence.
- **A6 Practice log.** "My record" became the practice log, with a new practice-change entry (intention → enactment → consequence → evidence type) and status Planned → Enacted → Reviewed. No certificates, badges, completion percentages or evidence packs. The printout is headed "Personal development record — not accreditation evidence."
- **A7 Reflexive coach.** The system prompt now states that the coach is an AI system, limits its claims to what the evidence supports and separates individual action from institutional conditions. Every reply shows the model name and a "How useful was this?" rating, stored with the entry.
- **A8 Design rationale page.** New English-only `/rationale` page for supervisors, examiners and research collaborators, linked from the footer.
- **A9 Research documentation.** New `research/` folder: conjecture map, design requirements, design principles, instrument codebook and citation register (generated from `content/` by `npm run research:docs`), this iteration log, and the Part B ethics and data design (`ethics-and-data.md`, design only; no server-side storage).
- **A10 Home page.** Hero reframed around accreditation and educator capacity ("Building the capacity that accreditation assumes"), with the REAL letter animation kept, a link to the accreditation page under the pillars, and three steps: profile your practice and conditions; work through evidence-based dilemmas; log what you change, and what happens.

### Evidence on the conjectures

None yet. Iteration 0 has not been used in the field. The pilot (Study 6) and Study 7 are expected to provide evidence for or against E3→M1, E5→M4→O1 and E1→M2→O2.
