import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { readStore, writeStore } from '@/lib/storage'

/**
 * State mirrored into localStorage, kept in step across tabs.
 *
 * Two tabs used to be blind to each other: each held its own copy of the whole
 * object and whichever wrote last silently erased the other's ticks. A tab now
 * adopts a sibling's write as soon as it lands. Genuinely simultaneous edits to
 * the same day still resolve last-write-wins, but a stale tab can no longer
 * flatten an hour of work it never saw.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
  validate?: (v: unknown) => boolean,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [val, setVal] = useState<T>(() => {
    const raw = readStore<T>(key, initial)
    return validate && !validate(raw) ? initial : raw
  })
  // kept in a ref so the storage listener never has to resubscribe
  const validateRef = useRef(validate)
  useEffect(() => { validateRef.current = validate })
  // the listener subscribes once, so it must not close over a stale initial value
  const initialRef = useRef(initial)
  useEffect(() => { initialRef.current = initial })
  const [broken, setBroken] = useState(false)
  // What this tab last wrote or accepted, so a write and its own echo never fight.
  // Seeded from the raw string rather than null, because otherwise the first effect
  // writes the default straight over a value that failed validation, and with no
  // import path that destroys the only copy of it.
  const lastRaw = useRef<string | null>((() => {
    try { return localStorage.getItem(key) } catch { return null }
  })())

  useEffect(() => {
    const raw = JSON.stringify(val)
    if (raw === lastRaw.current) return
    lastRaw.current = raw
    if (!writeStore(key, val)) setBroken(true)
  }, [key, val])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== localStorage) return
      // A removal is a reset in another tab. Ignoring it left this tab holding the
      // whole arc, and its next write put the data the user just deleted back.
      if (e.newValue === null) { lastRaw.current = null; setVal(initialRef.current); return }
      if (e.newValue === lastRaw.current) return
      let next: T
      try { next = JSON.parse(e.newValue) as T } catch { return }
      if (validateRef.current && !validateRef.current(next)) return
      lastRaw.current = e.newValue
      setVal(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [val, setVal, broken]
}
