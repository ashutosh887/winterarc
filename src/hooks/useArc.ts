import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { site, templates, challenges, quotes as QUOTES } from '@/config'
import { PRESETS } from '@/lib/presets'
import { ALL_WEEKDAYS, MAX_WAIT_DAYS, addDays, arcPresets, daysBetween, getDefaultArc, getRecommendedArc, parseYMD, todayYMD, warmUpBefore, weekdayOf } from '@/lib/date'
import { PATHS, viewForPath } from '@/lib/routes'
import { clearArcStorage, readStore, writeStore } from '@/lib/storage'
import { customHabitId } from '@/lib/habits'
import { useLocalStorage } from './useLocalStorage'
import type {
  Achievement, ArcMode, ArcRange, BeforeInstallPromptEvent, Entries, Habit, HabitId, ISODate,
  MonthGroup, Settings, View,
} from '@/lib/types'

/** True when this page is already running as the installed app. */
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true
}

/** The banner is a once-per-session offer, tracked apart from the prompt itself. */
function installHintDismissed() {
  try { return sessionStorage.getItem('wa_install_hint') === 'dismissed' } catch { return false }
}

/**
 * Every piece of arc state, its derived values and the actions that change it.
 * Lifted out of App so the views can be plain components that read one object.
 */
export function useArc() {
  const [settings, setSettings] = useLocalStorage<Settings | null>('wa_settings_v2', null, v => v === null || (typeof v === 'object' && !Array.isArray(v)))
  const [habits, setHabits] = useLocalStorage<Habit[]>('wa_habits', [], Array.isArray)
  const [habitsV2, setHabitsV2] = useLocalStorage<Habit[] | null>('wa_habits_v2', null, v => v === null || Array.isArray(v))
  const [entries, setEntries, entriesBroken] = useLocalStorage<Entries>('wa_entries', {}, v => v !== null && typeof v === 'object' && !Array.isArray(v))
  const [view, setView] = useState<View>(() => viewForPath(window.location.pathname) ?? 'landing')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [today, setToday] = useState<ISODate>(todayYMD())
  const [selectedDate, setSelectedDate] = useState<ISODate>(todayYMD())
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(1)
  const [tmpName, setTmpName] = useState('')
  const [tmpStart, setTmpStart] = useState<ISODate>(() => getRecommendedArc().start)
  const [tmpEnd, setTmpEnd] = useState<ISODate>(() => getRecommendedArc().end)
  const [tmpSelected, setTmpSelected] = useState<Set<HabitId>>(new Set())
  const [customName, setCustomName] = useState('')
  const [customList, setCustomList] = useState<Habit[]>([])
  const [tmpDays, setTmpDays] = useState<number[]>(ALL_WEEKDAYS)
  const arcLength = useMemo(() => daysBetween(tmpStart, tmpEnd), [tmpStart, tmpEnd])
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [stars, setStars] = useState<number | null>(null)
  const [heroReady, setHeroReady] = useState(false)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(() => window.waInstallPrompt ?? null)
  const [installed, setInstalled] = useState(isStandalone)
  const [installOutcome, setInstallOutcome] = useState<'accepted' | 'dismissed' | null>(null)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const [copied, setCopied] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [streakInfo, setStreakInfo] = useState(false)
  const [weeksOpen, setWeeksOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [backupBeforeReset, setBackupBeforeReset] = useState(true)
  const [promptCopied, setPromptCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const overlayDown = useRef(false)

  useEffect(() => {
    if (installed) return
    // The prompt is captured even when the banner was dismissed. Dismissing the
    // banner hides the banner, it must not throw away the event the Install
    // page needs to offer a real install button later in the same session.
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
      if (!installHintDismissed()) setShowInstallHint(true)
    }
    const onInstalled = () => {
      setInstalled(true)
      setInstallEvent(null)
      setInstallOutcome('accepted')
      setShowInstallHint(false)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    // Anything that fired before this effect ran is waiting in the holder.
    if (window.waInstallPrompt) setInstallEvent(window.waInstallPrompt)
    const t = installHintDismissed() ? 0 : window.setTimeout(() => setShowInstallHint(true), 2500)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      clearTimeout(t)
    }
  }, [installed])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200))
    const id = idle(() => setHeroReady(true))
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [])

  useEffect(() => {
    const DAY = 86400000
    const cached = readStore<{ n: number; at: number } | null>('wa_stars', null)
    if (cached && typeof cached.n === 'number' && Date.now() - cached.at < DAY) setStars(cached.n)
  }, [])

  // fetched on intent, not on load, so a visit never contacts a third party by itself
  const starsAsked = useRef(false)
  function loadStars() {
    if (starsAsked.current || stars !== null) return
    starsAsked.current = true
    fetch('https://api.github.com/repos/ashutosh887/winterarc', { signal: AbortSignal.timeout(5000) })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (typeof d?.stargazers_count !== 'number') return
        setStars(d.stargazers_count)
        writeStore('wa_stars', { n: d.stargazers_count, at: Date.now() })
      })
      .catch(() => {})
  }

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    try {
      const old = localStorage.getItem('wa_settings')
      if (old && !settings) { setSettings(JSON.parse(old)); localStorage.removeItem('wa_settings') }
      const oldH = localStorage.getItem('wa_habits')
      if (oldH && habitsV2 === null) { const h = JSON.parse(oldH); if (Array.isArray(h) && h.length) setHabitsV2(h) }
    } catch {}
  }, [])

  const effectiveHabits = useMemo(() => {
    const raw = habitsV2 ?? habits
    return Array.isArray(raw) ? raw.filter(h => h && typeof h.id === 'string' && typeof h.name === 'string') : []
  }, [habitsV2, habits])
  const hasData = settings && effectiveHabits.length > 0
  // Recomputed as `today` ticks, so a tab left open overnight on Sep 30 wakes up
  // knowing the winter arc has begun.
  const recommended = useMemo(() => getRecommendedArc(today), [today])
  const winterArc = useMemo(() => getDefaultArc(today), [today])
  const presets = useMemo(() => arcPresets(today), [today])
  /** The warm-up setup offers, measured against the winter arc rather than a saved run. */
  const setupWarmUp = useMemo(() => warmUpBefore(winterArc.start, today), [winterArc, today])
  const start = settings?.start ?? recommended.start
  const end = settings?.end ?? recommended.end
  const totalDays = useMemo(() => daysBetween(start, end), [start, end])
  const activeDaysKey = Array.isArray(settings?.activeDays) && settings.activeDays.length
    ? [...settings.activeDays].sort().join(',')
    : ALL_WEEKDAYS.join(',')
  const activeDays = useMemo(() => activeDaysKey.split(',').map(Number), [activeDaysKey])
  const isActiveDay = useCallback((d: ISODate) => activeDays.includes(weekdayOf(d)), [activeDays])
  const allDates = useMemo(() => Array.from({ length: totalDays }, (_, i) => addDays(start, i)), [start, totalDays])

  const [undo, setUndo] = useState<{ date: ISODate; entry: Record<HabitId, boolean> } | null>(null)
  const selectedIsFuture = selectedDate > today
  const arcStarted = today >= start
  const daysToStart = arcStarted ? 0 : daysBetween(today, start) - 1
  const arcEnded = today > end
  const arcMode: ArcMode = settings?.mode === 'warmup' ? 'warmup' : 'arc'
  const isWarmUp = arcMode === 'warmup'
  /** Offered while the arc is still ahead, so the wait is spent building the habit. */
  const warmUp = useMemo(() => (arcStarted ? null : warmUpBefore(start, today)), [arcStarted, start, today])
  /**
    * What a finished run rolls into. An arc already under way is trimmed to start
    * today, because handing somebody a grid that opens on five weeks of red days
    * they were never able to log is a lie about what happened.
    */
  const nextArc = useMemo(
    () => (today > winterArc.start && today <= winterArc.end ? { start: today, end: winterArc.end } : winterArc),
    [today, winterArc],
  )
  /** True when the target was cut short because the arc is already under way. */
  const nextArcTrimmed = nextArc.start !== winterArc.start
  /**
   * Nothing rolls over into itself, and nothing rolls over into a window most of
   * a year away. Either case sends them to setup instead.
   */
  const canRollOver = arcEnded
    && !(nextArc.start === start && nextArc.end === end)
    && daysBetween(today, nextArc.start) - 1 <= MAX_WAIT_DAYS
  const runNoun = isWarmUp ? 'Warm-up day' : 'Day'
  /** What to call the day counter wherever it appears next to a number. */
  const runLabel = isWarmUp ? 'Warm-up' : 'Day'
  const isPerfectDay = useCallback((d: ISODate) => {
    const e = entries[d] || {}
    return effectiveHabits.length > 0 && effectiveHabits.every(h => e[h.id])
  }, [entries, effectiveHabits])

  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
    const byKey = new Map<string, { key: string; label: string; dates: ISODate[] }>()
    allDates.forEach(d => {
      const key = d.slice(0, 7)
      let group = byKey.get(key)
      if (!group) {
        group = { key, label: fmt.format(parseYMD(d)), dates: [] }
        byKey.set(key, group)
      }
      group.dates.push(d)
    })
    return [...byKey.values()].map((m): MonthGroup => ({
      ...m,
      scheduled: m.dates.filter(isActiveDay).length,
      perfect: m.dates.filter(d => isActiveDay(d) && isPerfectDay(d)).length,
    }))
  }, [allDates, isActiveDay, isPerfectDay])

  const focusMonth = useMemo(() => {
    const clamped = today < start ? start : today > end ? end : today
    return clamped.slice(0, 7)
  }, [today, start, end])

  const [openMonths, setOpenMonths] = useState<string[]>([])
  useEffect(() => { setOpenMonths([focusMonth]) }, [focusMonth])

  useEffect(() => {
    const tick = () => setToday(prev => {
      const now = todayYMD()
      if (now === prev) return prev
      setSelectedDate(sel => (sel === prev ? now : sel))
      return now
    })
    const id = setInterval(tick, 60000)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); window.removeEventListener('focus', tick) }
  }, [])

  useEffect(() => {
    const onPop = () => setView(viewForPath(window.location.pathname) ?? 'landing')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // an onboarded visitor landing on / goes straight to the tracker, including from the installed app
  const routedOnce = useRef(false)
  useEffect(() => {
    if (routedOnce.current) return
    routedOnce.current = true
    if (viewForPath(window.location.pathname) === null) window.history.replaceState({}, '', '/')
    if (hasData && (viewForPath(window.location.pathname) ?? 'landing') === 'landing') {
      setView('tracker')
      window.history.replaceState({}, '', PATHS.tracker)
    }
  }, [hasData])

  // the tracker and dashboard need data, so fall back rather than render nothing
  useEffect(() => {
    if (!hasData && (view === 'tracker' || view === 'dashboard')) return
    const path = PATHS[view] ?? '/'
    if (window.location.pathname !== path) window.history.replaceState({}, '', path)
  }, [view, hasData])
  useEffect(() => {
    if (selectedDate < start) setSelectedDate(start)
    else if (selectedDate > end) setSelectedDate(today < start ? start : today > end ? end : today)
  }, [start, end, selectedDate, today])

  const stats = useMemo(() => {
    let perfect = 0, totalChecked = 0, totalPossible = 0, cur = 0, best = 0, c = 0, scheduled = 0
    const isPerfect = isPerfectDay
    allDates.forEach(d => {
      const e = entries[d] || {}
      if (!isActiveDay(d)) return
      totalChecked += effectiveHabits.filter(h => e[h.id]).length
      scheduled++
      totalPossible += effectiveHabits.length
      if (isPerfect(d)) perfect++
    })
    const lastLogged = allDates.filter(d => Object.values(entries[d] || {}).some(Boolean)).pop()
    let anchor = today >= allDates[0] ? (today > end ? end : today) : (lastLogged ?? null)
    // today is still in progress, so an unfinished today should not zero a live streak
    if (anchor === today && isActiveDay(today) && !isPerfect(today)) anchor = addDays(today, -1)
    if (anchor) {
      for (let i = allDates.length - 1; i >= 0; i--) {
        const d = allDates[i]
        if (d > anchor) continue
        if (!isActiveDay(d)) continue
        if (isPerfect(d)) cur++; else break
      }
    }
    allDates.forEach(d => {
      if (!isActiveDay(d)) return
      if (isPerfect(d)) { c++; best = Math.max(best, c) } else c = 0
    })
    const pct = totalPossible ? Math.round((totalChecked / totalPossible) * 100) : 0
    const perfectPct = scheduled ? Math.round((perfect / scheduled) * 100) : 0
    const dayNum = today < start ? 0 : today > end ? totalDays : daysBetween(start, today)
    return { perfect, scheduled, totalChecked, totalPossible, pct, perfectPct, streak: cur, bestStreak: best, dayNum, remaining: Math.max(0, totalDays - dayNum) }
  }, [allDates, entries, effectiveHabits, start, end, totalDays, isActiveDay, isPerfectDay, today])

  const dayDoneCount = useMemo(() => {
    const e = entries[selectedDate] || {}
    return effectiveHabits.filter(h => e[h.id]).length
  }, [entries, selectedDate, effectiveHabits])
  const dayComplete = effectiveHabits.length > 0 && dayDoneCount === effectiveHabits.length
  const dailyPct = effectiveHabits.length ? Math.round((dayDoneCount / effectiveHabits.length) * 100) : 0
  const dayPct = totalDays ? Math.round((stats.dayNum / totalDays) * 100) : 0

  const runHeadline = `${runNoun} ${stats.dayNum} of ${totalDays}`
  const runShort = `${runNoun} ${stats.dayNum}/${totalDays}`

  const quote = useMemo(() => QUOTES[stats.dayNum % QUOTES.length], [stats.dayNum])
  // Attribution travels with the quote everywhere it goes: the header, the image
  // and the shared text. A quote leaving the app without its author is the bug.
  const quoteCredit = quote.source ? `${quote.author}, ${quote.source}` : quote.author
  const quoteShareText = `"${quote.text}"\n\u2014 ${quote.author}`

  const achievements = useMemo(() => challenges.map(c => {
    const value = c.metric === 'checks' ? stats.totalChecked
      : c.metric === 'perfect' ? stats.perfect
      : c.metric === 'streak' ? stats.bestStreak
      : stats.pct
    const target = c.target || stats.scheduled || totalDays
    const isPct = c.metric === 'pct'
    return {
      ...c, value, target, isPct,
      unlock: value >= target,
      pct: Math.min(100, Math.round((value / target) * 100)),
      progress: isPct ? `${value}% of ${target}%` : `${value} of ${target}`,
    }
  }), [stats, totalDays])

  function toggleHabit(date: ISODate, habitId: HabitId) {
    if (date > today || date < start || date > end) return
    setUndo(null)
    setEntries(prev => {
      const cur = { ...(prev[date] || {}) }
      cur[habitId] = !cur[habitId]
      if (!cur[habitId]) delete cur[habitId]
      return { ...prev, [date]: cur }
    })
  }
  /**
   * Same habits, same rest days, a new window. Entries are keyed by date and are
   * never touched here, so a day logged during a warm-up is still in the browser
   * and still in the JSON export. It just stops counting toward the new arc.
   */
  function switchArc(range: ArcRange, mode: ArcMode) {
    setSettings({
      start: range.start,
      end: range.end,
      mode,
      name: settings?.name ?? null,
      activeDays: Array.isArray(settings?.activeDays) && settings.activeDays.length ? settings.activeDays : ALL_WEEKDAYS,
    })
    setSelectedDate(today < range.start ? range.start : today > range.end ? range.end : today)
    setUndo(null)
  }
  function startWarmUp() { if (warmUp) switchArc(warmUp, 'warmup') }
  function startWinterArc() { switchArc(nextArc, 'arc') }
  /** Keeps the length they chose and drags the whole window onto today. */
  function startToday() { switchArc({ start: today, end: addDays(today, Math.max(0, totalDays - 1)) }, 'arc') }

  function startOnboarding() {
    setTmpName(settings?.name ?? '')
    setTmpStart(settings?.start ?? recommended.start)
    setTmpEnd(settings?.end ?? recommended.end)
    setTmpSelected(new Set(effectiveHabits.map(h => h.id)))
    setCustomList(effectiveHabits.filter(h => h.tier === 'custom'))
    setTmpDays(Array.isArray(settings?.activeDays) && settings.activeDays.length ? settings.activeDays : ALL_WEEKDAYS)
    setOnboardStep(1); setShowOnboarding(true)
  }
  function completeOnboarding() {
    const chosen = [...PRESETS.filter(p => tmpSelected.has(p.id)), ...customList]
    if (!chosen.length) { alert('Pick at least one habit. Three to five works well.'); return }
    if (!tmpStart || !tmpEnd || isNaN(parseYMD(tmpStart).getTime()) || isNaN(parseYMD(tmpEnd).getTime())) { alert('Pick valid start and end dates'); return }
    if (parseYMD(tmpStart) > parseYMD(tmpEnd)) { alert('Start date must be before end date'); return }
    if (arcLength > 730) { alert('Keep the arc under two years. Pick a closer end date.'); return }
    if (chosen.length > 10 && !confirm(`You picked ${chosen.length} habits. Recommended max is 10. Continue?`)) return
    // Picking the offered warm-up range is what marks a run as a warm-up. Typing
    // those exact dates by hand means the same thing, so it is treated the same.
    const mode: ArcMode = setupWarmUp && tmpStart === setupWarmUp.start && tmpEnd === setupWarmUp.end ? 'warmup' : 'arc'
    setSettings({ start: tmpStart, end: tmpEnd, name: tmpName.trim() || null, activeDays: tmpDays.length ? tmpDays : ALL_WEEKDAYS, mode })
    setHabitsV2(chosen); setHabits(chosen)
    setShowOnboarding(false); goTo('tracker'); setSelectedDate(tmpStart)
  }
  function addCustom() {
    const name = customName.trim()
    if (!name) return
    // id comes from the name, not the clock, so removing a habit and adding it
    // back under the same name reunites it with its own history
    const id = customHabitId(name, [...PRESETS.map(p => p.id), ...customList.map(h => h.id)])
    setCustomList(prev => [...prev, { id, name, icon: 'flag', tier: 'custom', desc: '' }])
    setTmpSelected(s => new Set([...s, id])); setCustomName('')
  }
  function applyTemplate(tid: string) {
    const t = templates.find(x => x.id === tid); if (!t) return
    setTmpName(settings?.name ?? tmpName)
    setTmpStart(settings?.start ?? recommended.start); setTmpEnd(settings?.end ?? recommended.end)
    setTmpSelected(new Set(t.habitIds)); setCustomList([])
    setTmpDays(Array.isArray(settings?.activeDays) && settings.activeDays.length ? settings.activeDays : ALL_WEEKDAYS)
    setOnboardStep(2); setShowOnboarding(true)
  }
  function exportJSON() {
    const data = { settings: { start, end, name: settings?.name ?? null, activeDays }, habits: effectiveHabits, entries, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `winter-arc-${start}_${end}.json`; a.click(); URL.revokeObjectURL(url)
  }
  function csvEscape(s: string | number) {
    const v = String(s)
    const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
    return `"${safe.replace(/"/g, '""')}"`
  }
  function exportCSV() {
    const header = ['date', ...effectiveHabits.map(h => csvEscape(h.name)), 'perfect']
    const rows = allDates.map(d => {
      const e = entries[d] || {}
      const vals = effectiveHabits.map(h => e[h.id] ? '1' : '0')
      const perfect = effectiveHabits.length && effectiveHabits.every(h => e[h.id]) ? '1' : '0'
      return [d, ...vals, perfect].join(',')
    })
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `winter-arc-${start}_${end}.csv`; a.click(); URL.revokeObjectURL(url)
  }
  function resetAll() {
    const clear = () => {
      clearArcStorage()
      window.location.replace('/')
    }
    if (!backupBeforeReset) return clear()
    exportJSON()
    // give the download a moment to start before the page navigates away
    setTimeout(clear, 1200)
  }
  const llmPrompt = useMemo(() => `Here is my habit data from ${start} to ${end}. Habits: ${effectiveHabits.map(h => h.name).join(', ')}. Days elapsed: ${stats.dayNum} of ${totalDays}. Perfect days: ${stats.perfect} (${stats.perfectPct}%). Checks completed: ${stats.pct}%. Current streak: ${stats.streak}, best ${stats.bestStreak}.\nRaw entries: ${JSON.stringify(entries).slice(0, 4000)}\n\nTell me which habit I miss most and on which weekdays. Then give me one change to make this week. Keep it under 150 words and skip the pep talk.`, [start, end, effectiveHabits, stats, totalDays, entries])

  function drawShareCard({ achievement }: { achievement?: Achievement } = {}) {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = 1200, H = 630, PAD = 64
    canvas.width = W; canvas.height = H

    ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#27272a'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, W - 2, H - 2)

    const box = (x: number, y: number, w: number, h: number, r: number, fill: string) => {
      ctx.fillStyle = fill
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r)
      else ctx.rect(x, y, w, h)
      ctx.fill()
    }

    // same mark as the favicon and the OG image, so the three read as one brand
    const mark = (cx: number, cy: number, r: number) => {
      const u = r / 32
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = '#18181b'; ctx.fill()
      ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 2 * u; ctx.stroke()
      const pt = (x: number, y: number): [number, number] => [cx + (x - 32) * u, cy + (y - 32) * u]
      const poly = (pts: [number, number][], fill: string) => {
        ctx.beginPath()
        pts.forEach(([x, y], i) => { const [a, b] = pt(x, y); if (i) ctx.lineTo(a, b); else ctx.moveTo(a, b) })
        ctx.closePath(); ctx.fillStyle = fill; ctx.fill()
      }
      poly([[11, 45], [26, 19], [34, 33], [39, 25], [53, 45]], '#fafafa')
      poly([[22.2, 27.5], [29.8, 27.5], [26, 21]], '#18181b')
    }
    mark(PAD + 15, 62, 15)
    ctx.fillStyle = '#fafafa'; ctx.font = '700 21px ui-sans-serif,system-ui'
    ctx.fillText('WINTERARC', PAD + 40, 70)
    const markWidth = 40 + ctx.measureText('WINTERARC').width
    ctx.fillStyle = '#52525b'; ctx.font = '400 17px ui-monospace,monospace'
    ctx.fillText(site.tagline, PAD + markWidth + 18, 70)

    ctx.fillStyle = '#fafafa'; ctx.font = '800 58px ui-sans-serif,system-ui'
    ctx.fillText(achievement ? achievement.label : runHeadline, PAD, 148)
    ctx.fillStyle = '#a1a1aa'; ctx.font = '400 21px ui-sans-serif,system-ui'
    // never cut a habit name mid-word on a public image; drop to a count instead
    const names = effectiveHabits.map(h => h.name)
    let sub = achievement ? achievement.desc : names.join(', ')
    if (!achievement && sub.length > 74) {
      const kept: string[] = []
      for (const n of names) {
        if ([...kept, n].join(', ').length > 60) break
        kept.push(n)
      }
      const rest = names.length - kept.length
      sub = kept.length ? `${kept.join(', ')} and ${rest} more` : `${names.length} habits`
    }
    ctx.fillText(sub.length > 74 ? `${sub.slice(0, 71)}...` : sub, PAD, 184)

    const cells: [string, string][] = [
      ['PERFECT', `${stats.perfect}`],
      ['COMPLETION', `${stats.pct}%`],
      ['STREAK', `${stats.streak}`],
      ['BEST', `${stats.bestStreak}`],
    ]
    const cw = (W - PAD * 2 - 12 * 3) / 4
    cells.forEach(([label, value], i) => {
      const x = PAD + i * (cw + 12)
      box(x, 214, cw, 88, 16, '#18181b')
      ctx.fillStyle = '#71717a'; ctx.font = '500 12px ui-monospace,monospace'
      ctx.fillText(label, x + 18, 244)
      ctx.fillStyle = '#fafafa'; ctx.font = '700 34px ui-sans-serif,system-ui'
      ctx.fillText(value, x + 18, 284)
    })

    // the grid reflows so any arc length lands inside the same band
    const gy = 330, bandH = 170, gap = 5
    const n = allDates.length
    let cols = Math.ceil(Math.sqrt(n * (W - PAD * 2) / bandH))
    cols = Math.max(14, Math.min(cols, n))
    let cell = Math.floor((W - PAD * 2 - gap * (cols - 1)) / cols)
    let rows = Math.ceil(n / cols)
    while (rows * (cell + gap) > bandH && cell > 4) {
      cell -= 1
      cols = Math.floor((W - PAD * 2 + gap) / (cell + gap))
      rows = Math.ceil(n / cols)
    }
    const gridW = cols * cell + (cols - 1) * gap
    const gx = Math.round((W - gridW) / 2)

    allDates.forEach((d, i) => {
      const e = entries[d] || {}
      const done = effectiveHabits.filter(h => e[h.id]).length
      let color
      if (!isActiveDay(d)) color = '#151517'
      else if (d > today) color = '#27272a'
      else if (done === 0) color = '#4c1d1d'
      else if (done === effectiveHabits.length) color = '#fafafa'
      else color = '#a1a1aa'
      box(gx + (i % cols) * (cell + gap), gy + Math.floor(i / cols) * (cell + gap), cell, cell, Math.min(5, cell / 3), color)
    })

    const fit = (text: string, max: number) => {
      if (ctx.measureText(text).width <= max) return text
      let cut = text
      while (cut.length > 1 && ctx.measureText(`${cut}...`).width > max) cut = cut.slice(0, -1)
      return `${cut}...`
    }
    const textW = W - PAD * 2
    ctx.fillStyle = '#d4d4d8'; ctx.font = '400 20px ui-sans-serif,system-ui'
    ctx.fillText(fit(`"${quote.text}"`, textW), PAD, 544)
    ctx.fillStyle = '#71717a'; ctx.font = '400 15px ui-sans-serif,system-ui'
    ctx.fillText(fit(`\u2014 ${quoteCredit}`, textW), PAD, 570)

    ctx.fillStyle = '#52525b'; ctx.font = '500 14px ui-monospace,monospace'
    ctx.fillText(site.domain.replace('https://', ''), PAD, 600)
    const legend: [string, string][] = [['#fafafa', 'all'], ['#a1a1aa', 'some'], ['#4c1d1d', 'none']]
    let lx = W - PAD
    for (let i = legend.length - 1; i >= 0; i--) {
      const [c, label] = legend[i]
      const tw = ctx.measureText(label).width
      lx -= tw
      ctx.fillStyle = '#52525b'
      ctx.fillText(label, lx, 600)
      lx -= 10
      box(lx - 10, 589, 10, 10, 3, c)
      lx -= 26
    }
    return canvas.toDataURL('image/png')
  }
  function shareCardBlob({ achievement }: { achievement?: Achievement } = {}): Promise<Blob | null> {
    return new Promise(resolve => {
      const canvas = canvasRef.current
      if (!canvas) return resolve(null)
      drawShareCard({ achievement })
      if (typeof canvas.toBlob !== 'function') return resolve(null)
      canvas.toBlob(b => resolve(b), 'image/png')
    })
  }
  function downloadImage(achievement?: Achievement) {
    const url = drawShareCard({ achievement })
    if (!url) return
    const a = document.createElement('a'); a.href = url; a.download = achievement ? `winter-arc-${achievement.id}.png` : `winter-arc-${isWarmUp ? 'warmup-' : ''}day${stats.dayNum}.png`; a.click()
  }
  function shareToX(achievement?: Achievement) {
    downloadImage(achievement)
    const text = achievement
      ? `${achievement.label}. ${runShort}, ${stats.pct}% done, streak ${stats.streak}.\n\n${quoteShareText}\n`
      : `${runShort}. ${stats.perfect} perfect days, ${stats.pct}% done, streak ${stats.streak}.\n\n${quoteShareText}\n`
    const url = site.domain
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer,width=600,height=400')
  }
  function shareToWhatsApp(achievement?: Achievement) {
    const text = achievement
      ? `${achievement.label} unlocked. ${runShort}, ${stats.pct}% done, streak ${stats.streak}.\n\n${quoteShareText}\n\n${site.domain}`
      : `WinterArc. ${runShort}, ${stats.pct}% done, streak ${stats.streak}.\n\n${quoteShareText}\n\n${site.domain}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }
  async function nativeShare(achievement?: Achievement) {
    const text = achievement
      ? `${achievement.label}. ${achievement.desc}\n\n${quoteShareText}`
      : `${runShort}, ${stats.pct}% done\n\n${quoteShareText}`
    if (!navigator.share) return shareToX(achievement)
    const payload = { title: 'WinterArc', text, url: site.domain }
    try {
      const blob = await shareCardBlob({ achievement })
      if (blob) {
        const file = new File([blob], 'winter-arc.png', { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ ...payload, files: [file] })
          return
        }
      }
    } catch {}
    try { await navigator.share(payload) } catch {}
  }
  const navLinks = [
    { label: 'Winter arc', onClick: () => goTo('about'), active: view === 'about' },
    { label: 'Templates', onClick: () => goTo('templates'), active: view === 'templates' },
    { label: 'Resources', onClick: () => goTo('resources'), active: view === 'resources' },
    ...(hasData ? [
      { label: 'Tracker', onClick: () => goTo('tracker'), active: view === 'tracker' },
      { label: 'Dashboard', onClick: () => goTo('dashboard'), active: view === 'dashboard' },
    ] : []),
  ]

  useEffect(() => {
    if (view !== 'tracker' || !hasData || showOnboarding || confirmReset) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement as HTMLElement | null
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepDay(-1); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepDay(1); return }
      if (e.key === 't' || e.key === 'T') { setSelectedDate(today < end ? today : end); return }
      const i = Number(e.key)
      if (Number.isInteger(i) && i >= 1 && i <= Math.min(9, effectiveHabits.length)) {
        e.preventDefault()
        toggleHabit(selectedDate, effectiveHabits[i - 1].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    const open = showOnboarding || confirmReset || shareOpen
    if (!open) return
    const restoreTo = document.activeElement as HTMLElement | null
    const panel = () => document.querySelectorAll('[role="dialog"]')[document.querySelectorAll('[role="dialog"]').length - 1]
    const focusables = () => Array.from(
      panel()?.querySelectorAll<HTMLElement>('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])') ?? []
    ).filter(el => !(el as HTMLButtonElement).disabled && el.offsetParent !== null)
    const raf = requestAnimationFrame(() => focusables()[0]?.focus())
    const close = () => {
      if (confirmReset) setConfirmReset(false)
      else if (shareOpen) setShareOpen(false)
      else setShowOnboarding(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      else if (!panel()?.contains(document.activeElement)) { e.preventDefault(); first.focus() }
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      restoreTo?.focus?.()
    }
  }, [showOnboarding, confirmReset, shareOpen])

  const dayFmt = useMemo(() => new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'short' }), [])
  const longFmt = useMemo(() => new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }), [])
  const longYearFmt = useMemo(() => new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }), [])
  /** A date for running prose. The year appears only when it is not this one. */
  function longDate(d: ISODate) {
    return (d.slice(0, 4) === today.slice(0, 4) ? longFmt : longYearFmt).format(parseYMD(d))
  }
  function dayLabel(d: ISODate) {
    if (d === today) return 'Today'
    if (d === addDays(today, -1)) return 'Yesterday'
    return dayFmt.format(parseYMD(d))
  }
  function stepDay(delta: number) {
    const cap = today < end ? today : end
    const next = addDays(selectedDate, delta)
    if (next < start || next > cap) return
    setSelectedDate(next)
    setUndo(null)
  }
  const habitStreak = useCallback((id: HabitId) => {
    let count = 0
    for (let i = allDates.length - 1; i >= 0; i--) {
      const d = allDates[i]
      if (d > today) continue
      if (!isActiveDay(d)) continue
      if ((entries[d] || {})[id]) count++
      else if (d < today) break
    }
    return count
  }, [allDates, entries, isActiveDay, today])

  function copyPrompt() {
    navigator.clipboard?.writeText(llmPrompt).then(() => {
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 1800)
    }).catch(() => {})
  }
  function copyLink() {
    navigator.clipboard?.writeText(site.domain).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }
  function dismissInstallHint() {
    setShowInstallHint(false)
    try { sessionStorage.setItem('wa_install_hint', 'dismissed') } catch {}
  }
  /**
   * The only place that fires the native prompt, shared by the landing banner
   * and the Install page. A prompt event can be used once, so a declined
   * install clears it and the page falls back to the manual steps.
   */
  async function runInstall() {
    if (!installEvent) {
      if (view !== 'install') goTo('install')
      dismissInstallHint()
      return
    }
    setInstallOutcome(null)
    installEvent.prompt()
    let outcome: 'accepted' | 'dismissed' = 'dismissed'
    try { outcome = (await installEvent.userChoice).outcome } catch {}
    setInstallEvent(null)
    window.waInstallPrompt = null
    setInstallOutcome(outcome)
    if (outcome === 'accepted') setInstalled(true)
    dismissInstallHint()
  }

  /**
   * Backdrop dismissal that ignores a press which began inside the panel, so
   * dragging a text selection past the edge of a dialog never closes it.
   */
  function overlayProps(onDismiss: () => void) {
    return {
      onMouseDown: (e: MouseEvent<HTMLElement>) => { overlayDown.current = e.target === e.currentTarget },
      onClick: (e: MouseEvent<HTMLElement>) => {
        if (e.target === e.currentTarget && overlayDown.current) onDismiss()
      },
    }
  }

  function goTo(next: View) {
    const path = PATHS[next] ?? '/'
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setView(next)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    settings,
    setSettings,
    habits,
    setHabits,
    habitsV2,
    setHabitsV2,
    entries,
    setEntries,
    entriesBroken,
    view,
    setView,
    mobileMenuOpen,
    setMobileMenuOpen,
    today,
    setToday,
    selectedDate,
    setSelectedDate,
    showOnboarding,
    setShowOnboarding,
    onboardStep,
    setOnboardStep,
    tmpName,
    setTmpName,
    tmpStart,
    setTmpStart,
    tmpEnd,
    setTmpEnd,
    tmpSelected,
    setTmpSelected,
    customName,
    setCustomName,
    customList,
    setCustomList,
    tmpDays,
    setTmpDays,
    arcLength,
    showScrollTop,
    setShowScrollTop,
    stars,
    setStars,
    heroReady,
    setHeroReady,
    installEvent,
    setInstallEvent,
    installed,
    installOutcome,
    showInstallHint,
    setShowInstallHint,
    copied,
    setCopied,
    promptOpen,
    setPromptOpen,
    shareOpen,
    setShareOpen,
    streakInfo,
    setStreakInfo,
    weeksOpen,
    setWeeksOpen,
    confirmReset,
    setConfirmReset,
    resetting,
    setResetting,
    backupBeforeReset,
    setBackupBeforeReset,
    promptCopied,
    setPromptCopied,
    canvasRef,
    overlayProps,
    starsAsked,
    loadStars,
    effectiveHabits,
    hasData,
    start,
    end,
    totalDays,
    activeDaysKey,
    activeDays,
    isActiveDay,
    allDates,
    undo,
    setUndo,
    selectedIsFuture,
    arcStarted,
    daysToStart,
    arcEnded,
    arcMode,
    isWarmUp,
    warmUp,
    winterArc,
    nextArc,
    nextArcTrimmed,
    recommended,
    canRollOver,
    presets,
    setupWarmUp,
    runNoun,
    runLabel,
    runHeadline,
    runShort,
    switchArc,
    startWarmUp,
    startWinterArc,
    startToday,
    longDate,
    isPerfectDay,
    months,
    focusMonth,
    openMonths,
    setOpenMonths,
    routedOnce,
    stats,
    dayDoneCount,
    dayComplete,
    dailyPct,
    dayPct,
    quote,
    quoteCredit,
    quoteShareText,
    achievements,
    toggleHabit,
    startOnboarding,
    completeOnboarding,
    addCustom,
    applyTemplate,
    exportJSON,
    csvEscape,
    exportCSV,
    resetAll,
    llmPrompt,
    drawShareCard,
    shareCardBlob,
    downloadImage,
    shareToX,
    shareToWhatsApp,
    nativeShare,
    navLinks,
    dayFmt,
    dayLabel,
    stepDay,
    habitStreak,
    copyPrompt,
    copyLink,
    dismissInstallHint,
    runInstall,
    goTo,
  }
}

export type Arc = ReturnType<typeof useArc>
