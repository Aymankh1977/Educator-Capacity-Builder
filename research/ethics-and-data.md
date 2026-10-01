# Ethics and data: Part B design (not implemented)

**Status: design only.** Nothing in this document is implemented. No server-side storage of user data exists in Iteration 0, and none may be added until Ayman confirms that ethics approval **2026-25106-46076**, or an amendment to it, covers platform-based data collection.

[AYMAN TO SUPPLY: confirmation that approval 2026-25106-46076 covers platform-based data collection, or the reference of the amendment that does]

## 1. Current data flows (Iteration 0, as built)

This section describes the platform as it is, so that the ethics application can be checked against it.

**In the browser only (`localStorage` and one cookie).** Nothing below leaves the device unless listed under "Sent to the server".

| Key | Contents |
|---|---|
| `realai_readiness` | Capacity-profile answers (26 items) and the optional participant code |
| `realai_journal` | Practice log: practice changes, development plans, scenario reflections, coach replies, the model name and usefulness ratings |
| `realai_code` | The access code the educator entered |
| `realai_lang` (cookie) | Interface language, `en` or `ar` |

**Sent to the server (`/api/coach`), only when the educator asks for feedback.**

- Development plan: the four practice pillar means, the three institutional pillar means, the decoupling item rating and the interface language. No item-level answers, no participant code.
- Scenario debrief: the scenario ID, the chosen option ID, the reflection text (at most 1,500 characters) and the interface language.
- Every request carries the access code in a header.

**On the server.** The request is checked against a per-IP rate limit (an in-memory list of request times for 10 minutes, per serverless instance, never written to storage) and against the access codes. The prompt is then sent to the Anthropic API, and the reply is returned to the browser. Nothing is stored server-side.

**Points the ethics application must cover.** Reflection text is free text and is processed by a third party (Anthropic) to generate feedback; participants should be told not to include identifiable details about students, patients or colleagues. The hosting provider is Vercel. [AYMAN TO SUPPLY: confirm the Vercel function region and the current Anthropic API data-retention terms before submission]

## 2. Research mode

- An environment flag `RESEARCH_MODE`, default `off`. With it off, the platform behaves exactly as in Iteration 0.
- With it on, an informed-consent screen appears **before any research data leaves the browser**. It links to the participant information sheet and offers four separate opt-ins:
  - (a) capacity-profile scores;
  - (b) scenario reflections;
  - (c) practice-log entries;
  - (d) coach feedback ratings.
- Each opt-in is independent. Declining all of them still allows full use of the platform for professional development.
- Consent is recorded with the consent-form version, and the screen reappears if the version changes.

[AYMAN TO SUPPLY: decision on whether coach reply text is stored with (b) reflections, with (d) ratings, or not at all]

## 3. Pseudonymous participant ID and withdrawal

- A random participant ID (for example from `crypto.randomUUID()`) is generated in the browser when the participant consents, and kept in `localStorage`.
- No names or email addresses are collected.
- The ID is shown on screen, with an instruction to keep a copy. It is the only key needed to withdraw.
- Withdrawal: the participant enters or confirms their ID on a withdrawal screen; all rows for that ID are deleted from every table (Section 5). The withdrawal window must match the participant information sheet.

## 4. Cohorts

- The access code acts as the cohort identifier.
- Raw access codes are not written to research data. Instead, a server-side mapping (an environment variable) translates each code to a cohort label, and only the label is stored.
- Cohort-level views are shown only when a cohort has **n ≥ 5** participants, to prevent identification. Smaller cohorts are suppressed in views and exports.

## 5. Proposed storage

**Provider.** Vercel Postgres or Supabase, in an **EU region**, to meet UK GDPR. The final choice should follow the University's information-governance advice.

**Data model sketch.**

| Table | Columns |
|---|---|
| `participants` | `participant_id` (UUID, primary key), `cohort` (label), `consent_version`, `consent_scores`, `consent_reflections`, `consent_practice`, `consent_ratings` (booleans), `created_at` |
| `profile_submissions` | `id`, `participant_id`, `timepoint` (for example `pre`, `post`), `practice_instrument_version`, `institutional_instrument_version`, `responses` (item ID → 1–5), `practice_means`, `institutional_means`, `decoupling`, `submitted_at` |
| `reflections` | `id`, `participant_id`, `scenario_id`, `scenario_version`, `option_id`, `prompt` (as shown), `reflection_text`, `lang`, `submitted_at` |
| `practice_entries` | `id`, `participant_id`, `pillar`, `intention`, `enactment`, `consequence`, `evidence_type`, `status` (planned, enacted, reviewed), `updated_at` |
| `coach_ratings` | `id`, `participant_id`, `kind` (plan or debrief), `entry_ref`, `model`, `value` (useful, partly, not useful), `why`, `rated_at` |

Rows are written only for the categories the participant opted into.

**Retention period.** [AYMAN TO SUPPLY: retention period from the approved protocol and the University's records retention schedule]

**Deletion process.**

- On withdrawal: delete all rows for the participant ID across all tables, and record only the date and the fact of a withdrawal (no ID).
- At the end of the retention period: a scheduled job deletes all research data, and the deletion is logged.
- Backups: provider backups expire within a defined period after deletion. [AYMAN TO SUPPLY: confirm the provider's backup retention]

## 6. Admin export

- A CSV export by cohort and timepoint, for pre/post comparison.
- Columns follow the browser CSV export (see `instrument-codebook.md`), plus `participant_id`, `cohort` and `timepoint`.
- Restricted to the research team behind authentication; cohorts with fewer than 5 participants are suppressed.

## 7. Data minimisation

- The coach API continues to receive only what it needs: pillar means and the decoupling rating for plans, and the scenario, option and reflection for debriefs.
- Participant IDs, cohort labels and consent records are never sent to the coach API or to Anthropic.
- Item-level answers stay in the browser unless the participant opts into (a).
