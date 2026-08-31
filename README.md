# WinterArc

A habit tracker for the 92 days from October 1 to December 31, with graduation on January 1.
Everything is stored in your browser. No account, no server, works offline.

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

## Where things live

- `src/config.ts` is the source of truth for content: templates, resources, quotes, challenges.
- `src/App.jsx` holds the views and the tracker logic.
- `src/components/ui/` holds the shadcn components.
- `public/` holds the icons, OG image, robots.txt and sitemap.xml.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
