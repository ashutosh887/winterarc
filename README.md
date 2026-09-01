# WinterArc

A habit tracker for a fixed run of days. October 1 through December 31 is the winter arc, but you can
set any start and end date you want. You never have to wait for the season either: when the arc is
still weeks away, setup offers a warm-up that runs from today up to the day before it starts, and the
tracker then offers to roll you into the arc with the same habits. Everything is stored in your
browser. No account, no server, works offline.

Live: https://trywinterarc.vercel.app

## Stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui.

## Run locally

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Environment

Copy `.env.example` to `.env.local`. It runs fine empty. `VITE_CLARITY_ID` enables Microsoft Clarity on the hosted site only.

## Where things live

- `src/config.ts` is the source of truth for content: templates, resources, quotes, challenges.
- `src/lib/types.ts` holds the domain types every other module is written against.
- `src/hooks/useArc.ts` holds all arc state, the derived stats and the actions. Views read one `arc` object from it.
- `src/views/` holds one component per route; `src/App.tsx` is the shell, nav and dialogs.
- `src/lib/` holds dates, routes, storage, presets and habit ids.
- `src/components/ui/` holds the shadcn components.
- `public/` holds the icons, OG image, robots.txt and sitemap.xml.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
