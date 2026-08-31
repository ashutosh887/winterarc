# TryWinterArc — Backlog & Progress

## Shipped
- 92-day fixed arc Oct1-Dec31, Jan1 graduation, no restart
- 3 tiers + custom, cap 10, backfill any date
- Daily quote (by day number) + animated rings (framer-motion) + per-habit rings
- Heatmap 92 cells, streak, perfect, weekly
- localStorage only, PWA offline, open source MIT
- Export JSON/CSV + LLM prompt
- Share: X, WhatsApp, native share, PNG canvas (trywinterarc branding)
- Achievements 11 static, shareable
- Premium landing: hero + Three.js icosahedron (subtle) + free forever strip + product mock
- SEO/AEO: canonical, OG absolute, JSON-LD (SoftwareApplication, FAQPage, WebSite), robots.txt, sitemap.xml, sitemap absolute, OG 1200×630, skip-link, headings
- Vercel alias: trywinterarc.vercel.app + winterarc-khaki.vercel.app (cleaned git-main/ashutosh-887 aliases)
- Onboarding 3 steps: name → dates → habits, personalised header “Hey {name}”
- Navbar polished (zinc, Sparkles CTA), footer Built by Ashutosh Jha (ashutosh887.in) + GitHub
- PWA: favicon.svg, pwa-192/512, apple-touch-icon, og-image.png

## Next (not yet)
- [ ] Printable PDF 1-page 92-row grid
- [ ] Numeric inputs for water/protein vs binary
- [ ] Daily reflection 1-line journal
- [ ] Web notifications (local)
- [ ] Import JSON/CSV
- [ ] Habit notes per day
- [ ] Light/dark toggle (currently dark zinc)
- [ ] Reduce three bundle (lazy Canvas) — currently 1.24MB due to three/drei

## Tracking till now
- Scaffold → PWA → Landing minimal → Tracker → SEO → alias cleanup → name onboarding → premium polish → docs
- Build: vite 8.2.2, vite-plugin-pwa generateSW, 16 precached, gzip ~71kb (without three lazy)
- Aliases kept: 2, removed: 2, domains: ashutosh887.in only

## X Growth Hooks
- Share card 1200×675, achievements static, daily quote screenshot, free forever banner
