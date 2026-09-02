import type { Habit, HabitId } from './types'

export function customHabitId(name: string, taken: Iterable<HabitId>): HabitId {
  const slug = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  const base = `custom_${slug || 'habit'}`
  const used = new Set(taken)
  if (!used.has(base)) return base
  let n = 2
  while (used.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

export function isHabit(v: unknown): v is Habit {
  if (!v || typeof v !== 'object') return false
  const h = v as Partial<Habit>
  return typeof h.id === 'string' && typeof h.name === 'string'
}