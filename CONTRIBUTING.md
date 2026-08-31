# Contributing

One focused change per pull request.

## Run it

```bash
npm install
npm run dev
```

## Where things live

`src/lib/types.ts` holds the domain types. `src/hooks/useArc.ts` holds all arc
state, the derived stats and the actions, and every view reads that one `arc`
object. `src/views/` has one component per route and `src/App.tsx` is the shell.
Put logic in the hook, not in a view.

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
lint-staged runs `oxlint --fix` on staged files in the `pre-commit` hook, which
then runs `npm run typecheck`. A commit that does not type-check will not land.

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

### Quotes have to be real

Every quote is a real line by a named person with a source anyone can check:

```ts
{ text: "...", author: "Annie Dillard", source: "The Writing Life, 1989" }
```

Do not write a quote in the app's voice, and do not reword someone else's into a
new one. An earlier in-house set had a dozen unattributed reworks of living
authors baked into a public share image, which is what this rule exists to stop.

Source from the book, a transcript, or a [Quote Investigator](https://quoteinvestigator.com)
ruling. Do not trust quote-aggregator sites: they confidently credit Mike
Murdock's line to James Clear and Will Durant's to Shaquille O'Neal. If you
cannot find a primary source, leave it out.

Keep it under about 90 characters, and do not assume the arc runs from October
to December. Anyone can set any dates, so a line about winter is wrong for half
the people reading it.

## Pull requests

Fill in the template: What, Why, How.
Add a screenshot for any UI change.
Tick the checklist: lint passes, build passes, conventional commit title, no console errors, responsive checked.

## Issues

Open an issue for bugs and ideas, or message [@ashutosh887_](https://x.com/ashutosh887_) on X.
