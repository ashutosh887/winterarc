# Contributing to WinterArc

Thanks for helping. WinterArc is small on purpose. Keep it that way.

## How to help

- Pick an issue, or open one with a clear problem and a small fix.
- Keep PRs tight. One idea per PR. Less is better.

## Setup

```bash
npm install
npm run dev
npm run build
```

## Where things live

- `src/config.ts` — templates, resources, quotes. One file, no backend.
- `src/App.jsx` — grid, rings, tracker, landing.
- `index.html` — titles, descriptions, JSON-LD.
- `public/` — PWA icons, `sitemap.xml`, `robots.txt`.

## Rules

- Use icons from `lucide-react`. No emojis.
- Keep copy short and direct. No puff.
- One border style: `border-zinc-800`, `rounded-2xl`. No shine.
- Buttons: primary is white, secondary is `bg-zinc-900 border-zinc-800`. All pill, `rounded-full`.
- No new dependencies without a good reason.
- Run `npm run lint` and `npm run build` before you push.

## Feedback or ideas?

Open an issue or reach out on X: [@ashutosh887_](https://x.com/ashutosh887_). For code, send a PR against `main`.

## Commits

We use conventional commits. Example: `feat: add minimal template`, `fix: correct 92-day math`.
