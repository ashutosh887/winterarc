# WinterArc

A habit tracker for a fixed run of days. October 1 through December 31 is the winter arc, but you can
set any start and end date you want. Your habit data never leaves your browser. No account, no sign-in,
works offline.

Live: https://trywinterarc.vercel.app

## What it does

- **Any arc, any length.** Pick the dates, pick the habits from a template or write your own.
- **A warm-up so you never wait.** When the arc is still weeks away, setup offers a run from today up
  to the day before it starts, then rolls you into the arc with the same habits and your original dates.
- **Rest days.** Weekdays you mark as rest never count as a miss and never break a streak.
- **A grid for the whole run**, per habit rings, streaks, perfect days and completion.
- **Achievements** that unlock against checks, perfect days, streaks and percentage.
- **A share card** rendered to PNG in the browser, with the quote and its author.
- **Export** to JSON and CSV, plus a copyable prompt for feeding your run to an LLM.
- **Installable.** It is a PWA, opens on the tracker, and works with no network.

## Reminders

Two optional slots, morning and evening, stored as `HH:MM` in your browser. They use the browser
notification and your system sound.

There is no push server, so they fire only while WinterArc is open in a tab or installed as an app.
Nothing can wake a closed browser. A backgrounded tab can also be frozen by the browser through the
whole window, so when a reminder time passes without one reaching you, the check-in card says so
instead of staying silent. Rest days and finished days stay quiet, and so does a tab you are already
looking at.

On an iPhone, web notifications exist only once WinterArc is on your home screen.

## Privacy

Your habits, dates, entries and reminder times live in `localStorage` and are never sent anywhere.
There is no backend and no account.

Production loads [Microsoft Clarity](https://clarity.microsoft.com) for page views, clicks and
scrolling. It cannot read your habit data, because that never leaves `localStorage`. It is gated
behind `VITE_CLARITY_ID`, which is set on the deployed site only, so local dev and forks load no
analytics at all.

`vercel.json` carries the security headers. The CSP has no `script-src 'unsafe-inline'`, which is why
code that must run before the app bundle lives in `public/` and is loaded by URL. Adding a third party
script without adding it to the CSP fails silently.

## Stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Environment

Copy `.env.example` to `.env.local`. It runs fine empty. Setting `VITE_CLARITY_ID` loads Clarity
wherever the app runs, local dev included. Leave it blank and no analytics script loads.

## Where things live

- `src/config.ts` is the source of truth for content: templates, resources, quotes, challenges.
- `src/lib/types.ts` holds the domain types every other module is written against.
- `src/hooks/useArc.ts` holds all arc state, the derived stats and the actions. Views read one `arc` object from it.
- `src/views/` holds one component per route; `src/App.tsx` is the shell, nav and dialogs.
- `src/components/app/Surface.tsx` holds the layout tokens. Every page is built from these, not from
  hand typed padding and widths.
- `src/lib/` holds dates, routes, storage, presets, habit ids and the reminder rules.
- `src/components/ui/` holds the shadcn components.
- `public/sw-notify.js` is folded into the generated service worker so tapping a reminder opens the tracker.
- `public/` also holds the icons, OG image, robots.txt and sitemap.xml.

## Routes

`/` landing, `/winter-arc`, `/templates`, `/resources`, `/install`, `/feedback`, `/tracker`,
`/dashboard`. Real paths, no router dependency. `vercel.json` rewrites non asset paths to `index.html`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
