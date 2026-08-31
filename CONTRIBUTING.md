# Contributing

WinterArc stays small. One focused change per PR.

## Setup

```bash
npm install
npm run dev
npm run build
```

## Where to edit

- `src/config.ts` — templates, resources, quotes
- `src/App.jsx` — tracker, grid, landing
- `src/components/ui/*` — shadcn components

No new deps without discussion. Use `lucide-react` for icons, no emojis.

## Raising a PR

1. Fork and branch: `feat/add-minimal-template` or `fix/grid-date-math`
2. Keep it tiny. One idea.
3. Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
4. Run before push:

```bash
npm run lint
npm run build
```

5. Open the PR against `main`. Fill the template. Link the issue if there is one. Add a screenshot for UI changes.

Checks: Husky + commitlint + lint-staged run on commit. CI builds.

## Style

- Borders: `border-zinc-800` + `rounded-2xl`
- Buttons: `shadcn` `Button` — `default` is white pill, `secondary` is zinc-900. Size `sm` for nav, `default` for CTAs.
- Copy: short, direct, no hype.

## Ideas or bugs?

Open an issue. Or message [@ashutosh887_](https://x.com/ashutosh887_) on X.
