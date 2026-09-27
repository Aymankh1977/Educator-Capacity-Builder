# REAL-AI Educator Studio (DentEdTech™)

AI capacity building for dental educators, built on the REAL-AI framework
(Reflective Integration, Equity by Design, Authentic Clinical Alignment, Learning-Centred Partnership).

MVP modules: **Readiness Check** (16 items, per-pillar profile, AI development plan via Haiku)
and **Scenario Studio** (4 dental scenarios, one per pillar, AI coaching debrief via Sonnet). EN/AR with RTL.

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
   `MODEL_FAST` / `MODEL_COACH` (optional overrides).
4. Deploy. Every push to `main` redeploys automatically.

## Where to edit
- `lib/realai.js`: pillar wording, readiness items, scenarios. Align pillar descriptions with the published REAL-AI paper.
- `lib/i18n.js`: interface text (EN/AR).
- `app/api/coach/route.js`: prompts and model choice. The API key never reaches the browser.

## Data and ethics
No responses are stored server-side. Readiness answers stay in the browser (localStorage);
only the four pillar means, or a scenario reflection, are sent to the Anthropic API for coaching.
The CSV export (with optional participant code) supports pre/post comparison for research use under the approved ethics protocol.
