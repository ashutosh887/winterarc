import type { ArcRange, ISODate } from './types'

export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6]

export const WEEKDAYS: { i: number; short: string }[] = [
  { i: 1, short: 'Mon' }, { i: 2, short: 'Tue' }, { i: 3, short: 'Wed' },
  { i: 4, short: 'Thu' }, { i: 5, short: 'Fri' }, { i: 6, short: 'Sat' }, { i: 0, short: 'Sun' },
]

export function ymd(d: Date): ISODate {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function parseYMD(s: ISODate): Date {
  const [y, m, dd] = s.split('-').map(Number)
  return new Date(y, m - 1, dd)
}

/** Inclusive of both ends. Math.round absorbs the 23 or 25 hour day at a DST edge. */
export function daysBetween(a: ISODate, b: ISODate): number {
  return Math.round((parseYMD(b).getTime() - parseYMD(a).getTime()) / 86400000) + 1
}

export function addDays(s: ISODate, n: number): ISODate {
  const d = parseYMD(s)
  d.setDate(d.getDate() + n)
  return ymd(d)
}

export function todayYMD(): ISODate {
  return ymd(new Date())
}

export function weekdayOf(d: ISODate): number {
  return parseYMD(d).getDay()
}

export function isValidYMD(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parseYMD(s).getTime())
}

/** Oct 1 to Dec 31. On Dec 31 itself the arc that matters is next year's. */
export function getDefaultArc(): ArcRange {
  const now = new Date()
  const y = now.getMonth() === 11 && now.getDate() === 31 ? now.getFullYear() + 1 : now.getFullYear()
  return { start: `${y}-10-01`, end: `${y}-12-31` }
}

export const DEFAULT_START = getDefaultArc().start
export const DEFAULT_END = getDefaultArc().end

export const ARC_PRESETS: { label: string; range: () => ArcRange }[] = [
  { label: 'Winter arc', range: () => getDefaultArc() },
  { label: 'Start today', range: () => ({ start: todayYMD(), end: addDays(todayYMD(), 89) }) },
  { label: 'Start tomorrow', range: () => ({ start: addDays(todayYMD(), 1), end: addDays(todayYMD(), 90) }) },
  { label: '30 days', range: () => ({ start: addDays(todayYMD(), 1), end: addDays(todayYMD(), 30) }) },
  { label: '60 days', range: () => ({ start: addDays(todayYMD(), 1), end: addDays(todayYMD(), 60) }) },
]
