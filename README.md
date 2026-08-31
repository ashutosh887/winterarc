# TryWinterArc — Disappear for 90 days. Come back unrecognizable.

**Lock in while they coast. ❄️**

Free forever. No paywall. Open source Winter Arc tracker — Oct 1 → Dec 31 (92 days, Jan 1 graduation).  
100% local. No login. PWA installable. Works offline. Your data never leaves your device.

Live: **https://trywinterarc.vercel.app** → `trywinterarc.app` (custom domain pending) • also `https://winterarc-khaki.vercel.app`

## Features
- **92-day grid** — backfill any date, missed stays red, no restart
- **3 tiers** — Non-negotiables / Good Extras / Aesthetic + custom, cap 10
- **Rings** — animated `framer-motion` overall/daily/per-habit rings (zinc → premium)
- **Daily quote** — rotates by day number
- **Achievements** — 11 static badges, each shareable as PNG/X/WA
- **Share** — X, WhatsApp, native share, PNG canvas (1200×675)
- **Export** — JSON/CSV + one-click LLM prompt
- **PWA** — `vite-plugin-pwa`, offline, `trywinterarc.vercel.app`
- **Free forever** — MIT, no tracking, localStorage only

## Stack
Vite + React + Tailwind v4 + `vite-plugin-pwa` + `framer-motion` + `lucide-react` + `three`/`@react-three/fiber`/`drei` (subtle hero) + localStorage

## Dev
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # dist + SW
npm run preview # http://localhost:4173
```

## Deploy
Push to `main` → Vercel auto-deploys. Aliases: `trywinterarc.vercel.app` (SSO-gated, keep), `winterarc-khaki.vercel.app` (public). To add `trywinterarc.app`: `vercel domains add trywinterarc.app` + DNS.

## SEO & AEO
- `index.html` has canonical, OG (absolute URLs, 1200×630), Twitter, `theme-color`, `robots`, `JSON-LD` (SoftwareApplication + FAQPage + WebSite), `preconnect`, skip-link
- `public/robots.txt` + `public/sitemap.xml` + `public/og-image.png` + `apple-touch-icon.png`
- Headings: `h1` landing + `h2` FAQ/How it Works, FAQ is crawlable for AEO

## Data
- Keys: `wa_settings_v2` (`{name,start,end}`), `wa_habits_v2`, `wa_entries` (`{YYYY-MM-DD:{habitId:true}}`)
- Onboarding: Step 1 name → Step 2 dates → Step 3 habits

## Progress Log
- ✅ Scaffold Vite + Tailwind + PWA
- ✅ PWA icons, favicon, OG, apple-touch
- ✅ Landing premium minimal (hero + Three.js + free forever strip)
- ✅ Tracker rings (motion), achievements, share
- ✅ SEO/AEO, vercel alias cleanup, alias trywinterarc
- ✅ Onboarding name personalization, footer Built by Ashutosh Jha
- ⏳ Printable PDF, numeric inputs, notifications, import — see `IDEAS.md`

## Ideas
See `IDEAS.md`

## Support — free, just star ⭐
If you like it, drop a star on [ashutosh887/winterarc](https://github.com/ashutosh887/winterarc) and follow [@ashutosh887](https://github.com/ashutosh887) — it helps the community.

All features free forever. No paywall. Config-driven: edit `src/config.ts` for resources/templates/quotes.

## Credits
Built by [Ashutosh Jha](https://ashutosh887.in) — [GitHub](https://github.com/ashutosh887) • Built on [Vercel](https://vercel.com) — inspired by Winter Arc trend (Oct 1 → Dec 31, 92 days). Research: 3-5 binary habits, self-selected > assigned, one miss ≠ break.

## License
MIT — PRs welcome. Star us if it helped your arc.
