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

export function getDefaultArc(today: ISODate = todayYMD()): ArcRange {
  const d = parseYMD(today)
  const y = d.getMonth() === 11 && d.getDate() === 31 ? d.getFullYear() + 1 : d.getFullYear()
  return { start: `${y}-10-01`, end: `${y}-12-31` }
}

export const MAX_WARMUP_DAYS = 45

export const MAX_WAIT_DAYS = 120

export function warmUpBefore(target: ISODate, today: ISODate = todayYMD()): ArcRange | null {
  if (target <= today) return null
  const gap = daysBetween(today, target) - 1
  if (gap < 1 || gap > MAX_WARMUP_DAYS) return null
  return { start: today, end: addDays(target, -1) }
}

export function isMidArc(today: ISODate = todayYMD()): boolean {
  const winter = getDefaultArc(today)
  return today > winter.start && today <= winter.end
}

export function getRecommendedArc(today: ISODate = todayYMD()): ArcRange {
  const winter = getDefaultArc(today)
  const warm = warmUpBefore(winter.start, today)
  if (warm) return warm
  if (isMidArc(today)) return { start: today, end: winter.end }
  if (daysBetween(today, winter.start) - 1 > MAX_WAIT_DAYS) return { start: today, end: addDays(today, 89) }
  return winter
}

export const DEFAULT_START = getDefaultArc().start
export const DEFAULT_END = getDefaultArc().end

export function arcPresets(today: ISODate = todayYMD()): { label: string; range: ArcRange }[] {
  const winter = getDefaultArc(today)
  const warm = warmUpBefore(winter.start, today)
  return [
    ...(warm ? [{ label: 'Warm-up', range: warm }] : []),
    ...(isMidArc(today) ? [{ label: 'Rest of the arc', range: { start: today, end: winter.end } }] : []),
    { label: 'Winter arc', range: winter },
    { label: 'Start today', range: { start: today, end: addDays(today, 89) } },
    { label: 'Start tomorrow', range: { start: addDays(today, 1), end: addDays(today, 90) } },
    { label: '30 days', range: { start: addDays(today, 1), end: addDays(today, 30) } },
    { label: '60 days', range: { start: addDays(today, 1), end: addDays(today, 60) } },
  ]
}