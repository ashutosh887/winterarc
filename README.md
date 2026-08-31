# WinterArc

A habit tracker for a fixed run of days. It defaults to October 1 through December 31, the winter arc,
but you can set any start and end date you want. Everything is stored in your browser. No account, no
server, works offline.

Live: https://trywinterarc.vercel.app

## Stack

React, Vite, Tailwind CSS, shadcn/ui.

## Run locally

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Environment

Copy `.env.example` to `.env.local`. It runs fine empty. `VITE_CLARITY_ID` enables Microsoft Clarity on the hosted site only.

## Where things live

- `src/config.ts` is the source of truth for content: templates, resources, quotes, challenges.
- `src/App.jsx` holds the views and the tracker logic.
- `src/components/ui/` holds the shadcn components.
- `public/` holds the icons, OG image, robots.txt and sitemap.xml.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
