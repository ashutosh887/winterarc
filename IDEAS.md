# Ideas

Open backlog. Nothing here is committed to.

How to use this file: add an item to the stage that matches what it blocks, not
how exciting it is. An item moves up a stage only when something concrete makes
it urgent, and the reason goes in the line. When you ship one, delete the line
in the same commit as the feature so this file never describes a past version.

Stages are about consequence, not effort:

- **Stage 1** is anything that makes a claim on the site false, loses data, or
  blocks the app on a device someone actually has.
- **Stage 2** is real friction for someone using the app daily.
- **Stage 3** is worth doing when there is room.

## Stage 1, blocks a clean public launch

- [ ] **Import JSON back into the tracker.** The export is a one way door. Until
      this exists the reset dialog can only offer a copy, not a restore, and the
      wording has to keep saying so.
- [ ] Make the repo public. The navbar star count 404s while it is private and
      falls back to the word "Star".
- [ ] Set Clarity masking to Balanced or Strict so habit names and the arc name
      never reach a recording, and block localhost so dev sessions stay out.
- [ ] Delete `.env.local`. It holds a live `VERCEL_OIDC_TOKEN`. Untracked and
      gitignored, but it is sitting in the folder.
- [ ] Remove the extra Vercel aliases: `winterarc-khaki`,
      `winterarc-ashutosh-887`, `winterarc-git-main-ashutosh-887`.

## Stage 2, daily use friction

- [ ] **Custom habit ids are `custom_${Date.now()}`.** Removing a custom habit
      and adding it back with the same name orphans all of its history.
- [ ] **No cross tab sync.** Two open tabs each write the whole `entries`
      object, so the last write silently wins.
- [ ] Numeric habits (water, protein) instead of only yes or no.
- [ ] One line daily reflection note, and per day notes on a habit.
- [ ] Local web notifications for a daily reminder.

## Stage 3, when there is room

- [ ] Printable one page grid, any arc length.
- [ ] Light theme toggle.
- [ ] Calendar day cells are 31px wide at 320px and 37px at 360px. Seven columns
      inside the page and card padding cannot reach 44px wide at those widths,
      so the cells are 44px tall instead. Only a different narrow layout fixes
      the width.

## Known duplication, safe to leave

These are not bugs. They are places the next person will drift if they copy the
line next to them rather than the component.

- `Eyebrow` in `src/components/app/Surface.jsx` is used 5 times, and its exact
  class string is hand typed at 19 more sites. Four of those have already
  drifted to a different font size.
- `Disclosure` is used once, and the same chevron toggle is hand rolled twice
  more, one of which rotates the opposite way.
- `src/components/ui/button.tsx` defaults every size to under 44px. Every call
  site overrides with `h-11`, so the app is fine and the component is a trap.
- `--color-accent` and `--color-accent-foreground` in `src/index.css` are unused.
  Left in place because `shadcn/tailwind.css` is imported and may resolve them.
