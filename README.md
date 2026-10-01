# REAL-AI Educator Studio (DentEdTech™)

AI capacity building for dental educators, built on the REAL-AI framework
(Reflective Integration, Equity by Design, Authentic Clinical Alignment, Learning-Centred Partnership).

**Iteration 0 (v3): a conjectural prototype in a design-based research programme.** All instruments, scenarios and design principles are unvalidated drafts.

Modules:
- **Capacity profile:** two separate draft instruments: practice (16 REAL-AI items) and institutional conditions (Scott's three pillars, plus a decoupling probe), with an AI development plan via Haiku. No combined score.
- **Scenarios:** seven evidence-anchored dilemmas in two groups. The REAL-AI fit rating is revealed only after the educator submits a reflection; coaching debrief via Sonnet.
- **Practice log:** practice changes (Planned → Enacted → Reviewed), development plans and scenario reflections, kept in the browser and printable as a personal development record (not accreditation evidence).
- **Accreditation:** how the REAL-AI pillars relate to accreditation themes.
- **Design rationale** (`/rationale`, footer link): for supervisors, examiners and collaborators.

EN/AR with RTL. All Arabic is a draft translation that needs human review.

## Run locally
```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Deploy to Vercel
1. Push this folder to a new GitHub repo (e.g. `Aymankh1977/realai-educator-studio`).
2. In Vercel: **Add New → Project → Import** the repo. Framework is detected as Next.js.
3. Add environment variables: `ANTHROPIC_API_KEY` (required), `ACCESS_CODES` (optional, comma-separated),
   `RATE_LIMIT` (optional, AI requests per IP per 10 minutes, default 20), `MODEL_FAST` / `MODEL_COACH` (optional overrides).
4. Deploy. Every push to `main` redeploys automatically.

## Where to edit
- `content/*.json`: all framework content (pillars, both instruments, scenarios, design principles, accreditation and rationale text), each object with `version`, `status` and `provenance`. Record every change in `content/CHANGELOG.md`.
- `lib/i18n.js`: interface text (EN/AR).
- `app/api/coach/route.js`: prompts and model choice. The API key never reaches the browser.
- `research/`: design documentation. After changing `content/`, run `npm run research:docs` to regenerate the generated files.

## Data and ethics
No responses are stored server-side. Answers, reflections and the practice log stay in the browser (localStorage).
Only the pillar means and the decoupling rating, or a scenario reflection, are sent to the Anthropic API for coaching.
The CSV export (with optional participant code) is for research use only under an approved ethics protocol.
Platform-based research data collection is designed in `research/ethics-and-data.md` but not implemented.
