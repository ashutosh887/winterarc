# winterarc

> **Disappear for 90 days. Come back unrecognizable.** — *Lock in while they coast.* ❄️

Free. No paywall. Open source **WinterArc** tracker — Oct 1 → Dec 31 (92 days, Jan 1 graduation).  
100% local. No login. PWA installable. Works offline. Your data never leaves your device.

**Live:** https://winterarc-khaki.vercel.app — also https://trywinterarc.vercel.app *(alias, same deploy)*

## Features
- **92-day grid** — backfill any date, missed stays red, no restart
- **3 tiers** — Non-negotiables / Good Extras / Aesthetic + custom, cap 10
- **Rings** — animated `framer-motion` overall/daily/per-habit
- **Daily quote** — 120 quotes, rotates by day, history + future preview
- **Templates & Resources** — dedicated pages, config-driven `src/config.ts`, all free
- **Achievements** — 11 static badges, each shareable as PNG / X / WhatsApp
- **Share** — X, WhatsApp, native share, PNG canvas (1200×675)
- **Export** — JSON / CSV + one-click LLM prompt
- **PWA** — offline, installable, `vite-plugin-pwa`
- **Free** — MIT, no tracking, `localStorage` only

## Stack
Vite + React + Tailwind v4 + `vite-plugin-pwa` + `framer-motion` + `lucide-react` + `three`/`@react-three/fiber`/`drei` + `localStorage`

## Dev
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist + SW
npm run preview  # http://localhost:4173
```

## Deploy
Push to `main` → Vercel auto-deploys. Public alias `winterarc-khaki.vercel.app` is canonical; `trywinterarc.vercel.app` is alias to same deploy. To add custom domain `winterarc.app`: `vercel domains add winterarc.app` + DNS.

## SEO & AEO
- `index.html` has `canonical`, OG absolute `1200×630`, Twitter, `theme-color`, `robots`, `JSON-LD` (`SoftwareApplication` + `FAQPage` + `WebSite`), `preconnect`, skip-link
- `public/robots.txt` + `public/sitemap.xml` + `public/og-image.png` + `public/apple-touch-icon.png`
- Headings: `h1` landing + `h2` FAQ / How it Works — crawlable for AEO

## Data
Keys: `wa_settings_v2` (`{name,start,end}`), `wa_habits_v2`, `wa_entries` (`{YYYY-MM-DD:{habitId:true}}`)  
Onboarding: Step 1 name → Step 2 dates → Step 3 habits. Config: `src/config.ts`

## Support — free, just star ⭐
If you like it, drop a star on [ashutosh887/winterarc](https://github.com/ashutosh887/winterarc) and follow [@ashutosh887](https://github.com/ashutosh887) — it helps!

## Credits
Built by [Ashutosh Jha](https://ashutosh887.in) — [GitHub](https://github.com/ashutosh887) • Built on [Vercel](https://vercel.com)

Inspired by Winter Arc trend (Oct 1 → Dec 31, 92 days). Research: 3–5 binary habits, self-selected > assigned, one miss ≠ break.

## License
MIT — PRs welcome.
