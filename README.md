# TryWinterArc — Disappear for 90 days. Come back unrecognizable.

**Lock in while they coast. ❄️**

Free, open source Winter Arc tracker — Oct 1 → Dec 31 (92 days, Jan 1 graduation).  
100% local-first. No login. PWA installable. Works offline. Your data never leaves your device.

Live: `trywinterarc.app` (deploy to Vercel)

## Features
- **92-day grid** — backfill any past date, missed stays red, no restart (the research says one miss ≠ failure)
- **3 tiers** — Non-negotiables / Good Extras / Aesthetic + custom habits, cap 10 to avoid fatigue
- **Daily quote** rotating by day number — screenshot-worthy
- **Rings** — overall, daily %, and per-habit rings (live SVG, no canvas)
- **Achievements** — 11 static badges (First check, Perfect Day, 3/7/14/30 streak, Halfway, 10/30 perfect, 75%, Graduation). Each shareable.
- **Share** — X (Twitter intent), WhatsApp (`wa.me`), native share, PNG export (1200×675 canvas, TryWinterArc branding + quote + progress bar)
- **Export** — JSON / CSV + one-click LLM prompt for ChatGPT/Claude
- **PWA** — `vite-plugin-pwa`, offline cache, install on phone/desktop
- **Open source** — MIT, localStorage only, no tracking

## Stack
Vite + React + Tailwind v4 (`@tailwindcss/vite`) + `vite-plugin-pwa` + localStorage. No backend.

## Dev
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # dist/ + PWA sw
npm run preview
```

## Deploy (Vercel)
```bash
vercel --prod
# or push to GitHub → import in Vercel dashboard (framework: Vite, output: dist)
```
Build: `vite build` — static, no env vars. PWA requires HTTPS (Vercel gives it).

## Data
- Keys: `wa_settings_v2`, `wa_habits_v2`, `wa_entries`
- Schema: `{ start,end }`, `[{id,name,icon,tier,desc}]`, `{ "YYYY-MM-DD": { habitId: true } }`
- Migrate from `wa_settings`/`wa_habits` automatically.

## Ideas backlog
See `IDEAS.md`.

## License
MIT — free for everyone. PRs welcome.

## Credits
Inspired by Winter Arc trend (Oct1→Dec31, 92 days, 3-5 binary rules). Trend research agrees: 3-5 self-selected habits, missing one day doesn't break curve, visible grid is accountability.
