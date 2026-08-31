# Contributing

One focused change per pull request.

## Run it

```bash
npm install
npm run dev
```

## Before you push

```bash
npm run lint       # oxlint, must report 0 errors and 0 warnings
npm run typecheck  # tsc --noEmit, strict, must report 0 errors
npm run build      # must pass
```

## Environment

Copy `.env.example` to `.env.local`. Everything works with it empty.

`VITE_CLARITY_ID` turns on Microsoft Clarity on the hosted site so I can see which screens break. Leave it blank and the app makes no analytics calls at all. It never reads habit data, which lives in browser storage Clarity cannot touch.

## Commits

Conventional commits are enforced by commitlint via a husky `commit-msg` hook.
lint-staged runs `oxlint --fix` on staged files in the `pre-commit` hook.

```
feat: add minimal template
fix: correct grid date offset
docs: update contributing guide
```

Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `perf`, `test`, `build`, `ci`, `style`, `revert`.

## Adding content

Templates, resources, quotes and challenges all live in `src/config.ts`.
Add an entry there instead of editing components. Resource links must be real and reachable.
Use `lucide-react` icon names, no emoji.

## Pull requests

Fill in the template: What, Why, How.
Add a screenshot for any UI change.
Tick the checklist: lint passes, build passes, conventional commit title, no console errors, responsive checked.

## Issues

Open an issue for bugs and ideas, or message [@ashutosh887_](https://x.com/ashutosh887_) on X.
