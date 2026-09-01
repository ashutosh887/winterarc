// Domain types for a single arc. `ISODate` is always 'YYYY-MM-DD' in local time,
// never a Date and never a UTC string, because every comparison in the app is a
// string comparison and a timezone shift would move a day.
export type ISODate = string
export type HabitId = string

export type Tier = 'non-neg' | 'extra' | 'aesthetic' | 'custom'

export interface Habit {
  id: HabitId
  name: string
  icon: string
  tier: Tier
  desc: string
}

/** Only the habits done that day are present. An unchecked habit is absent, not `false`. */
export type DayEntry = Record<HabitId, boolean>
export type Entries = Record<ISODate, DayEntry>

/**
 * A warm-up is a short run taken before the arc it leads into. It behaves like
 * any other arc, and the only thing the mode changes is what the app calls it
 * and whether the tracker offers to roll it over when it ends.
 */
export type ArcMode = 'arc' | 'warmup'

export interface Settings {
  start: ISODate
  end: ISODate
  name: string | null
  /** Weekday numbers, 0 = Sunday, matching Date.getDay(). */
  activeDays: number[]
  /** Absent on arcs saved before warm-ups existed, which are all plain arcs. */
  mode?: ArcMode
  /** Absent on arcs saved before reminders existed, which means both slots off. */
  reminders?: Reminders
  /**
   * The arc a warm-up is leading into, stashed when the warm-up replaces it so
   * the roll-over can hand back the dates the person actually chose. Cleared as
   * soon as it is resumed.
   */
  next?: ArcRange
}

/** The two moments a day somebody wants nudging: setting up, and closing out. */
export type ReminderSlot = 'morning' | 'evening'

/**
 * Local reminder times as 'HH:MM' in 24 hour time, null when that slot is off.
 * These fire from the page or the service worker while the app is open. There is
 * no push server, so nothing here can reach a closed browser.
 */
export interface Reminders {
  morning: string | null
  evening: string | null
}

export type View =
  | 'landing' | 'about' | 'templates' | 'resources'
  | 'install' | 'feedback' | 'tracker' | 'dashboard'

export type ChallengeMetric = 'checks' | 'perfect' | 'streak' | 'pct'

export interface Challenge {
  id: string
  label: string
  icon: string
  desc: string
  metric: ChallengeMetric
  /** 0 means "every scheduled day", resolved against the arc at render time. */
  target: number
}

export interface Achievement extends Challenge {
  value: number
  isPct: boolean
  unlock: boolean
  pct: number
  progress: string
}

export interface Stats {
  perfect: number
  scheduled: number
  totalChecked: number
  totalPossible: number
  pct: number
  perfectPct: number
  streak: number
  bestStreak: number
  dayNum: number
  remaining: number
}

export interface Template {
  id: string
  name: string
  icon: string
  habitIds: HabitId[]
  desc: string
}

export interface Resource {
  name: string
  url: string
  desc: string
}

export interface ResourceGroup {
  title: string
  items: Resource[]
}

export interface MonthGroup {
  key: string
  label: string
  dates: ISODate[]
  scheduled: number
  perfect: number
}

export interface ArcRange {
  start: ISODate
  end: ISODate
}

/** Not in lib.dom: Chrome-only, and only fires when the PWA is installable. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    /** Set by public/pwa-install.js when the prompt fires before React mounts. */
    waInstallPrompt: BeforeInstallPromptEvent | null
  }
}

/**
 * Real quotes from named people, with a source anyone can check. Nothing here is
 * written in-house and dressed up as someone's wisdom, and nothing is a reworded
 * version of a line that belongs to a living author.
 */
export interface Quote {
  text: string
  author: string
  /** Book, essay or publication. Omitted only where the line has no single work. */
  source?: string
}
