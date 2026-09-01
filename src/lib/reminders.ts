import type { Habit, ISODate, ReminderSlot, Reminders } from './types'

export const REMINDER_SLOTS: ReminderSlot[] = ['morning', 'evening']

export const SLOT_LABELS: Record<ReminderSlot, string> = {
  morning: 'Morning',
  evening: 'Evening',
}

/** Early enough to set the day up, late enough to still fix it. */
export const DEFAULT_REMINDERS: Reminders = { morning: '07:30', evening: '21:00' }

/**
 * How long after the set time a reminder is still worth showing. Without this a
 * tab opened at midnight would replay the morning reminder as if it were due.
 */
export const CATCH_UP_MINUTES = 30

/** Minutes past midnight, or null when the value is not a real 'HH:MM'. */
export function minutesOf(hhmm: string | null | undefined): number | null {
  if (typeof hhmm !== 'string' || !/^\d{2}:\d{2}$/.test(hhmm)) return null
  const [h, m] = hhmm.split(':').map(Number)
  if (h > 23 || m > 59) return null
  return h * 60 + m
}

export function nowMinutes(d: Date = new Date()): number {
  return d.getHours() * 60 + d.getMinutes()
}

/** True inside the window that starts at the set time and runs CATCH_UP_MINUTES. */
export function isDue(at: string | null, now: number): boolean {
  const t = minutesOf(at)
  return t !== null && now >= t && now < t + CATCH_UP_MINUTES
}

/** Anything unreadable falls back to the defaults rather than turning reminders off silently. */
export function normalizeReminders(v: unknown): Reminders {
  const r = v as Partial<Reminders> | null | undefined
  const slot = (x: unknown) => (typeof x === 'string' && minutesOf(x) !== null ? x : null)
  if (!r || typeof r !== 'object') return { morning: null, evening: null }
  return { morning: slot(r.morning), evening: slot(r.evening) }
}

export function anyReminderOn(r: Reminders | null | undefined): boolean {
  return !!r && (r.morning !== null || r.evening !== null)
}

/** 'HH:MM' rendered the way the person's own locale writes a clock time. */
export function clockLabel(hhmm: string | null): string {
  const mins = minutesOf(hhmm)
  if (mins === null) return 'Off'
  const d = new Date()
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0)
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d)
}

export interface ReminderText { title: string; body: string }

/** Says what is left, not that you should feel bad. Scolding gets permission revoked. */
export function reminderText(headline: string, habits: Habit[], entry: Record<string, boolean>): ReminderText {
  const undone = habits.filter(h => !entry[h.id]).map(h => h.name)
  const done = habits.length - undone.length
  const shown = undone.slice(0, 3).join(', ')
  const rest = undone.length > 3 ? ` and ${undone.length - 3} more` : ''
  return {
    title: headline,
    body: done === 0
      ? `Nothing checked yet. ${shown}${rest}.`
      : `${done} of ${habits.length} done. ${shown}${rest} left.`,
  }
}

/** One entry per slot per day, so a reload or a second tab never repeats a reminder. */
export function firedId(date: ISODate, slot: ReminderSlot): string {
  return `${date}:${slot}`
}

/** Yesterday's marks are dead weight, so the log only ever holds today's. */
export function pruneFired(fired: string[], today: ISODate): string[] {
  return Array.isArray(fired) ? fired.filter(k => typeof k === 'string' && k.startsWith(`${today}:`)) : []
}
