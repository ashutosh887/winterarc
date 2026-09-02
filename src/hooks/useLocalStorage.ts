import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { readStore, writeStore } from '@/lib/storage'

export function useLocalStorage<T>(
  key: string,
  initial: T,
  validate?: (v: unknown) => boolean,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [val, setVal] = useState<T>(() => {
    const raw = readStore<T>(key, initial)
    return validate && !validate(raw) ? initial : raw
  })
  const validateRef = useRef(validate)
  useEffect(() => { validateRef.current = validate })
  const initialRef = useRef(initial)
  useEffect(() => { initialRef.current = initial })
  const [broken, setBroken] = useState(false)
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
