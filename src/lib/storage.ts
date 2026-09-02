export const STORAGE_KEYS = [
  'wa_settings', 'wa_settings_v2', 'wa_habits', 'wa_habits_v2', 'wa_entries', 'wa_stars',
  'wa_reminders_fired',
] as const

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeStore(key: string, val: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(val))
    return true
  } catch {
    return false
  }
}

export function clearArcStorage(): void {
  for (const k of STORAGE_KEYS) {
    try { localStorage.removeItem(k) } catch { /* private mode */ }
  }
}