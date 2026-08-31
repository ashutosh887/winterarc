# Contributing

One focused change per pull request.

## Run it

```bash
npm install
npm run dev
```

## Before you push

```bash
npm run lint    # oxlint, must report 0 errors and 0 warnings
npm run build   # must pass
```

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
