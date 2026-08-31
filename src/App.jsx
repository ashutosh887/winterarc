import { useEffect, useMemo, useState, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Flame, Trophy, ExternalLink, Sparkles, Snowflake, Shield, Zap, BookOpen, Dumbbell, Star, ArrowRight, ArrowUp, Heart, X, User, Settings, Menu, LayoutGrid, Compass,
  Footprints, Moon, Salad, Egg, Droplets, Target, Ban, Wind, NotebookPen, Sun, PhoneOff, TreePine, Coins, BrushCleaning, ShowerHead, AlarmClock,
  MountainSnow, Hourglass, Gem, Crown, Rocket, GraduationCap, Lock, Smartphone, Copy, ChevronDown
} from 'lucide-react'
import { site, resources, templates, challenges, quotes as QUOTES_CFG } from './config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
const ThreeHero = lazy(() => import('./ThreeHero'))

const ICON_MAP = {
  dumbbell: Dumbbell, footprints: Footprints, moon: Moon, salad: Salad, egg: Egg, droplets: Droplets, target: Target, ban: Ban,
  bookopen: BookOpen, wind: Wind, notebookpen: NotebookPen, sun: Sun, phoneoff: PhoneOff, treepine: TreePine, coins: Coins,
  brushcleaning: BrushCleaning, showerhead: ShowerHead, alarmclock: AlarmClock, flame: Flame, snowflake: Snowflake, star: Star,
  zap: Zap, shield: Shield, mountainSnow: MountainSnow, hourglass: Hourglass, gem: Gem, crown: Crown, rocket: Rocket, graduationcap: GraduationCap,
  check: Check, trophy: Trophy, lock: Lock, sparkles: Sparkles, heart: Heart,
}
function HabitIcon({ name, size = 16, className }) {
  const C = ICON_MAP[name]
  if (!C) return null
  return <C size={size} className={className} />
}

const ARC_PRESETS = [
  { label: 'Winter arc', range: () => getDefaultArc() },
  { label: '30 days', range: () => ({ start: todayYMD(), end: addDays(todayYMD(), 29) }) },
  { label: '60 days', range: () => ({ start: todayYMD(), end: addDays(todayYMD(), 59) }) },
  { label: '90 days', range: () => ({ start: todayYMD(), end: addDays(todayYMD(), 89) }) },
  { label: 'This month', range: () => { const d = new Date(); const y = d.getFullYear(), m = d.getMonth(); const p = x => String(x).padStart(2, '0'); return { start: `${y}-${p(m + 1)}-01`, end: `${y}-${p(m + 1)}-${p(new Date(y, m + 1, 0).getDate())}` } } },
]

const ROUTES = {
  '/': 'landing',
  '/winter-arc': 'about',
  '/templates': 'templates',
  '/resources': 'resources',
  '/install': 'install',
  '/feedback': 'feedback',
  '/tracker': 'tracker',
  '/dashboard': 'dashboard',
}
const PATHS = Object.fromEntries(Object.entries(ROUTES).map(([path, view]) => [view, path]))
const viewForPath = path => ROUTES[path.replace(/\/+$/, '') || '/'] ?? 'landing'

const getDefaultArc = () => {
  const y = new Date().getFullYear()
  return { start: `${y}-10-01`, end: `${y}-12-31` }
}
const DEFAULT_START = getDefaultArc().start
const DEFAULT_END = getDefaultArc().end

const TIER_LABELS = { 'non-neg': 'Non negotiables', extra: 'Good extras', aesthetic: 'Winter arc aesthetic', custom: 'Custom' }

const PRESETS = [
  { id: 'gym', name: 'Gym / Train 45m', icon: 'dumbbell', tier: 'non-neg', desc: 'Minimum 30 min. Walk counts.' },
  { id: 'steps', name: '10k Steps', icon: 'footprints', tier: 'non-neg', desc: 'Half before lunch.' },
  { id: 'sleep', name: 'Sleep 7.5h / In bed 22:30', icon: 'moon', tier: 'non-neg', desc: 'No snoozing. Up when alarm rings.' },
  { id: 'nutrition', name: 'No sugar & junk', icon: 'salad', tier: 'non-neg', desc: 'No / low sugar, no junk food.' },
  { id: 'protein', name: 'Protein target', icon: 'egg', tier: 'non-neg', desc: 'Track grams per day.' },
  { id: 'water', name: 'Water 2 to 3L', icon: 'droplets', tier: 'non-neg', desc: 'Spread through day.' },
  { id: 'work', name: 'Deep work 90m', icon: 'target', tier: 'non-neg', desc: 'Before email, phone away.' },
  { id: 'no-alcohol', name: 'No alcohol', icon: 'ban', tier: 'non-neg', desc: 'Yes or no, no exceptions.' },
  { id: 'reading', name: 'Reading 10 pages', icon: 'bookopen', tier: 'extra', desc: 'Non-fiction preferred.' },
  { id: 'meditation', name: 'Meditation 10m', icon: 'wind', tier: 'extra', desc: '5 to 15 min.' },
  { id: 'journaling', name: 'Journaling', icon: 'notebookpen', tier: 'extra', desc: 'Thoughts / gratitude.' },
  { id: 'sunlight', name: 'Morning sunlight', icon: 'sun', tier: 'extra', desc: 'Outside shortly after waking.' },
  { id: 'phone-am', name: 'No phone 60m AM', icon: 'phoneoff', tier: 'extra', desc: 'First 30 to 60 min.' },
  { id: 'phone-pm', name: 'No phone before bed', icon: 'moon', tier: 'extra', desc: 'Phone down by 21:00.' },
  { id: 'outside', name: 'Outside 20m', icon: 'treepine', tier: 'extra', desc: 'Survives cold. Indoor alt ok.' },
  { id: 'money', name: 'No unnecessary spend', icon: 'coins', tier: 'extra', desc: 'Track spend / no-buy.' },
  { id: 'clean', name: 'Clean room/desk', icon: 'brushcleaning', tier: 'extra', desc: '2-min reset before bed.' },
  { id: 'cold', name: 'Cold shower', icon: 'showerhead', tier: 'aesthetic', desc: 'Discipline rep.' },
  { id: 'wake5', name: '5 AM wake', icon: 'alarmclock', tier: 'aesthetic', desc: 'Fixed wake time daily.' },
  { id: 'pushups', name: '100 pushups', icon: 'flame', tier: 'aesthetic', desc: 'Challenge style.' },
]

const QUOTES = QUOTES_CFG

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }, [key, val])
  return [val, setVal]
}
function ymd(d) { const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0'); return `${y}-${m}-${dd}` }
function parseYMD(s) { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd) }
function daysBetween(a, b) { return Math.round((parseYMD(b) - parseYMD(a)) / 86400000) + 1 }
function addDays(s, n) { const d = parseYMD(s); d.setDate(d.getDate() + n); return ymd(d) }
function todayYMD() { return ymd(new Date()) }

function Ring({ pct, size = 44, stroke = 4, light = false, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? '#d4d4d8' : '#27272a'} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? '#18181b' : '#fafafa'} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (pct / 100) * c }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}



function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
      <path d="M11 45 L26 19 L34 33 L39 25 L53 45 Z" fill="#fafafa" />
      <path d="M22.2 27.5 L29.8 27.5 L26 21 Z" fill="#18181b" />
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

export default function App() {
  const [settings, setSettings] = useLocalStorage('wa_settings_v2', null)
  const [habits, setHabits] = useLocalStorage('wa_habits', [])
  const [habitsV2, setHabitsV2] = useLocalStorage('wa_habits_v2', null)
  const [entries, setEntries] = useLocalStorage('wa_entries', {})
  const [view, setView] = useState(() => viewForPath(window.location.pathname))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayYMD())
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(1)
  const [tmpName, setTmpName] = useState('')
  const [tmpStart, setTmpStart] = useState(DEFAULT_START)
  const [tmpEnd, setTmpEnd] = useState(DEFAULT_END)
  const [tmpSelected, setTmpSelected] = useState(new Set())
  const [customName, setCustomName] = useState('')
  const [customList, setCustomList] = useState([])
  const arcLength = useMemo(() => daysBetween(tmpStart, tmpEnd), [tmpStart, tmpEnd])
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [stars, setStars] = useState(null)
  const [heroReady, setHeroReady] = useState(false)
  const [installEvent, setInstallEvent] = useState(null)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const [copied, setCopied] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    if (standalone || sessionStorage.getItem('wa_install_hint') === 'dismissed') return
    const onPrompt = e => { e.preventDefault(); setInstallEvent(e); setShowInstallHint(true) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    const t = setTimeout(() => setShowInstallHint(true), 2500)
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); clearTimeout(t) }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 768) return
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200))
    const id = idle(() => setHeroReady(true))
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [])

  useEffect(() => {
    const DAY = 86400000
    try {
      const cached = JSON.parse(localStorage.getItem('wa_stars') || 'null')
      if (cached && Date.now() - cached.at < DAY) { setStars(cached.n); return }
    } catch {}
    fetch('https://api.github.com/repos/ashutosh887/winterarc')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (typeof d?.stargazers_count !== 'number') return
        setStars(d.stargazers_count)
        try { localStorage.setItem('wa_stars', JSON.stringify({ n: d.stargazers_count, at: Date.now() })) } catch {}
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const old = localStorage.getItem('wa_settings')
    if (old && !settings) { try { setSettings(JSON.parse(old)); localStorage.removeItem('wa_settings') } catch {} }
    const oldH = localStorage.getItem('wa_habits')
    if (oldH && habitsV2 === null) { try { const h = JSON.parse(oldH); if (h.length) setHabitsV2(h) } catch {} }
  }, [])

  const effectiveHabits = habitsV2 ?? habits
  const hasData = settings && effectiveHabits.length > 0
  const start = settings?.start ?? DEFAULT_START
  const end = settings?.end ?? DEFAULT_END
  const totalDays = useMemo(() => daysBetween(start, end), [start, end])
  const allDates = useMemo(() => Array.from({ length: totalDays }, (_, i) => addDays(start, i)), [start, totalDays])

  useEffect(() => {
    const onPop = () => setView(viewForPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // an onboarded visitor landing on / goes straight to the tracker, including from the installed app
  const routedOnce = useRef(false)
  useEffect(() => {
    if (routedOnce.current) return
    routedOnce.current = true
    if (hasData && viewForPath(window.location.pathname) === 'landing') {
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
    if (selectedDate > end) setSelectedDate(todayYMD() < start ? start : todayYMD() > end ? end : todayYMD())
  }, [start, end])

  const stats = useMemo(() => {
    let perfect = 0, totalChecked = 0, totalPossible = 0, cur = 0, best = 0, c = 0
    allDates.forEach(d => {
      const e = entries[d] || {}
      const done = effectiveHabits.filter(h => e[h.id]).length
      totalChecked += done; totalPossible += effectiveHabits.length
      if (effectiveHabits.length && done === effectiveHabits.length) perfect++
    })
    const today = todayYMD()
    for (let i = allDates.length - 1; i >= 0; i--) {
      const d = allDates[i]; if (d > today) continue
      const e = entries[d] || {}
      if (effectiveHabits.length && effectiveHabits.every(h => e[h.id])) cur++; else break
    }
    allDates.forEach(d => {
      const e = entries[d] || {}
      if (effectiveHabits.length && effectiveHabits.every(h => e[h.id])) { c++; best = Math.max(best, c) } else c = 0
    })
    const pct = totalPossible ? Math.round((totalChecked / totalPossible) * 100) : 0
    const perfectPct = allDates.length ? Math.round((perfect / allDates.length) * 100) : 0
    const dayNum = (() => { const t = todayYMD(); if (t < start) return 0; if (t > end) return totalDays; return daysBetween(start, t) })()
    return { perfect, totalChecked, totalPossible, pct, perfectPct, streak: cur, bestStreak: best, dayNum, remaining: Math.max(0, totalDays - (() => { const t = todayYMD(); if (t < start) return 0; if (t > end) return totalDays; return daysBetween(start, t) })()) }
  }, [allDates, entries, effectiveHabits, start, end, totalDays])

  const dailyPct = useMemo(() => {
    const e = entries[selectedDate] || {}
    const done = effectiveHabits.filter(h => e[h.id]).length
    return effectiveHabits.length ? Math.round((done / effectiveHabits.length) * 100) : 0
  }, [entries, selectedDate, effectiveHabits])

  const quote = useMemo(() => QUOTES[stats.dayNum % QUOTES.length], [stats.dayNum])

  const achievements = useMemo(() => challenges.map(c => {
    const value = c.metric === 'checks' ? stats.totalChecked
      : c.metric === 'perfect' ? stats.perfect
      : c.metric === 'streak' ? stats.bestStreak
      : stats.pct
    const target = c.target || totalDays
    return { ...c, value, target, unlock: value >= target, pct: Math.min(100, Math.round((value / target) * 100)) }
  }), [stats, totalDays])

  function toggleHabit(date, habitId) {
    setEntries(prev => {
      const cur = { ...(prev[date] || {}) }
      cur[habitId] = !cur[habitId]
      if (!cur[habitId]) delete cur[habitId]
      return { ...prev, [date]: cur }
    })
  }
  function startOnboarding() {
    setTmpName(settings?.name ?? '')
    setTmpStart(settings?.start ?? DEFAULT_START)
    setTmpEnd(settings?.end ?? DEFAULT_END)
    setTmpSelected(new Set(effectiveHabits.map(h => h.id)))
    setCustomList(effectiveHabits.filter(h => h.tier === 'custom'))
    setOnboardStep(1); setShowOnboarding(true)
  }
  function completeOnboarding() {
    const chosen = [...PRESETS.filter(p => tmpSelected.has(p.id)), ...customList]
    if (!chosen.length) { alert('Pick at least one habit. Three to five works well.'); return }
    if (!tmpStart || !tmpEnd || isNaN(parseYMD(tmpStart).getTime()) || isNaN(parseYMD(tmpEnd).getTime())) { alert('Pick valid start and end dates'); return }
    if (parseYMD(tmpStart) > parseYMD(tmpEnd)) { alert('Start date must be before end date'); return }
    if (chosen.length > 10 && !confirm(`You picked ${chosen.length} habits. Recommended max is 10. Continue?`)) return
    setSettings({ start: tmpStart, end: tmpEnd, name: tmpName.trim() || null })
    setHabitsV2(chosen); setHabits(chosen)
    setShowOnboarding(false); goTo('tracker'); setSelectedDate(tmpStart)
  }
  function addCustom() {
    if (!customName.trim()) return
    const id = 'custom_' + Date.now()
    setCustomList(prev => [...prev, { id, name: customName.trim(), icon: 'sparkles', tier: 'custom', desc: 'Custom' }])
    setTmpSelected(s => new Set([...s, id])); setCustomName('')
  }
  function applyTemplate(tid) {
    const t = templates.find(x => x.id === tid); if (!t) return
    setTmpName(settings?.name ?? tmpName)
    setTmpStart(settings?.start ?? DEFAULT_START); setTmpEnd(settings?.end ?? DEFAULT_END)
    setTmpSelected(new Set(t.habitIds)); setCustomList([]); setOnboardStep(2); setShowOnboarding(true)
  }
  function exportJSON() {
    const data = { settings: { start, end, name: settings?.name ?? null }, habits: effectiveHabits, entries, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `winter-arc-${start}_${end}.json`; a.click(); URL.revokeObjectURL(url)
  }
  function csvEscape(s) { return `"${String(s).replace(/"/g, '""')}"` }
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
    if (!confirm('Reset all WinterArc data? This cannot be undone. Are you sure?')) return
    for (const k of ['wa_settings_v2','wa_habits','wa_habits_v2','wa_entries']) localStorage.removeItem(k)
    location.reload()
  }
  const llmPrompt = `Here is my habit data from ${start} to ${end}. Habits: ${effectiveHabits.map(h => h.name).join(', ')}. Days elapsed: ${stats.dayNum} of ${totalDays}. Perfect days: ${stats.perfect} (${stats.perfectPct}%). Checks completed: ${stats.pct}%. Current streak: ${stats.streak}, best ${stats.bestStreak}.\nRaw entries: ${JSON.stringify(entries).slice(0, 4000)}\n\nTell me which habit I miss most and on which weekdays. Then give me one change to make this week. Keep it under 150 words and skip the pep talk.`

  function drawShareCard({ achievement } = {}) {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 1200, H = 630
    canvas.width = W; canvas.height = H
    ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#27272a'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, W - 2, H - 2)

    ctx.fillStyle = '#fafafa'; ctx.font = '700 22px ui-sans-serif,system-ui'
    ctx.fillText('WINTERARC', 64, 78)
    ctx.fillStyle = '#71717a'; ctx.font = '400 18px ui-monospace,monospace'
    ctx.fillText(site.tagline, 210, 78)

    if (achievement) {
      ctx.fillStyle = '#fafafa'; ctx.font = '800 62px ui-sans-serif,system-ui'
      ctx.fillText(achievement.label, 64, 176)
      ctx.fillStyle = '#a1a1aa'; ctx.font = '400 24px ui-sans-serif,system-ui'
      ctx.fillText(achievement.desc, 64, 214)
    } else {
      ctx.fillStyle = '#fafafa'; ctx.font = '800 62px ui-sans-serif,system-ui'
      ctx.fillText(`Day ${stats.dayNum} of ${totalDays}`, 64, 176)
      ctx.fillStyle = '#a1a1aa'; ctx.font = '400 24px ui-sans-serif,system-ui'
      ctx.fillText(effectiveHabits.map(h => h.name).join(', ').slice(0, 78), 64, 214)
    }

    const stat = (label, value, x) => {
      ctx.fillStyle = '#71717a'; ctx.font = '500 14px ui-monospace,monospace'
      ctx.fillText(label.toUpperCase(), x, 268)
      ctx.fillStyle = '#fafafa'; ctx.font = '700 38px ui-sans-serif,system-ui'
      ctx.fillText(value, x, 310)
    }
    stat('perfect days', `${stats.perfect}`, 64)
    stat('completion', `${stats.pct}%`, 304)
    stat('streak', `${stats.streak}`, 544)
    stat('best streak', `${stats.bestStreak}`, 784)

    const cols = 31, cell = 26, gap = 8, gx = 64, gy = 358
    allDates.forEach((d, i) => {
      const e = entries[d] || {}
      const done = effectiveHabits.filter(h => e[h.id]).length
      const future = d > todayYMD()
      const color = future ? '#18181b' : done === 0 ? '#3f1d1d' : done === effectiveHabits.length ? '#fafafa' : '#a1a1aa'
      const x = gx + (i % cols) * (cell + gap)
      const y = gy + Math.floor(i / cols) * (cell + gap)
      ctx.fillStyle = color
      ctx.beginPath(); ctx.roundRect(x, y, cell, cell, 6); ctx.fill()
    })

    ctx.fillStyle = '#a1a1aa'; ctx.font = 'italic 19px ui-sans-serif,system-ui'
    ctx.fillText(quote.slice(0, 76), 64, 552)
    ctx.fillStyle = '#52525b'; ctx.font = '500 15px ui-monospace,monospace'
    ctx.fillText('trywinterarc.vercel.app', 64, 588)
    return canvas.toDataURL('image/png')
  }
  function downloadImage(achievement) {
    const url = drawShareCard({ achievement }); const a = document.createElement('a'); a.href = url; a.download = achievement ? `winter-arc-${achievement.id}.png` : `winter-arc-day${stats.dayNum}.png`; a.click()
  }
  function shareToX(achievement) {
    const text = achievement
      ? `${achievement.label}. Day ${stats.dayNum}/${totalDays}, ${stats.pct}% done, streak ${stats.streak}.\n${site.tagline}\n`
      : `Day ${stats.dayNum}/${totalDays}. ${stats.perfect} perfect days, ${stats.pct}% done, streak ${stats.streak}.\n${site.hero}\n`
    const url = site.domain
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
  }
  function shareToWhatsApp(achievement) {
    const text = achievement
      ? `${achievement.label} unlocked. Day ${stats.dayNum}/${totalDays}, ${stats.pct}% done, streak ${stats.streak}. ${site.domain}`
      : `WinterArc day ${stats.dayNum}/${totalDays}. ${stats.pct}% done, streak ${stats.streak}. ${site.domain}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
  async function nativeShare(achievement) {
    const text = achievement ? `${achievement.label}. ${achievement.desc}` : `Day ${stats.dayNum}/${totalDays}, ${stats.pct}% done`
    if (navigator.share) { try { await navigator.share({ title: 'WinterArc', text, url: location.href }) } catch {} } else { shareToX(achievement) }
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
  async function runInstall() {
    if (!installEvent) { goTo('install'); dismissInstallHint(); return }
    installEvent.prompt()
    try { await installEvent.userChoice } catch {}
    setInstallEvent(null)
    dismissInstallHint()
  }

  function goTo(next) {
    const path = PATHS[next] ?? '/'
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setView(next)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-950">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800 pt-[env(safe-area-inset-top)]">
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button onClick={() => goTo('landing')} aria-label="WinterArc home" className="flex h-full items-center gap-2.5 shrink-0">
            <Logo size={26} />
            <span className="font-semibold tracking-[0.16em] text-[13px] text-white">WINTERARC</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden lg:flex items-center gap-0.5 lg:mr-2 lg:pr-3 lg:border-r lg:border-zinc-800">
              {navLinks.map(l => (
                <button
                  key={l.label}
                  onClick={l.onClick}
                  className={`h-9 px-3 rounded-full text-[13px] font-medium transition ${l.active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <a href={site.support.github} target="_blank" rel="noreferrer" aria-label="Star WinterArc on GitHub" className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-zinc-800 bg-zinc-900 text-[13px] font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition">
              <Star size={13} /> {stars === null ? 'Star' : stars.toLocaleString()}
            </a>

            <button onClick={startOnboarding} className="inline-flex shrink-0 items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-[13px] transition whitespace-nowrap">
              <span className="sm:hidden">{hasData ? 'Edit' : 'Set up'}</span>
              <span className="hidden sm:inline">{hasData ? 'Edit arc' : 'Set up your arc'}</span>
              <ArrowRight size={14} />
            </button>

            <button onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu" aria-expanded={mobileMenuOpen} className="lg:hidden shrink-0 w-9 h-9 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="lg:hidden sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-3 grid grid-cols-2 gap-2 [&>*:last-of-type]:col-span-2">
              {navLinks.map(l => (
                <button
                  key={l.label}
                  onClick={l.onClick}
                  className={`h-11 px-4 rounded-full text-sm font-medium border transition ${l.active ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-200 border-zinc-800'}`}
                >
                  {l.label}
                </button>
              ))}
              <a href={site.support.github} target="_blank" rel="noreferrer" className="col-span-2 h-11 px-4 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm font-medium inline-flex items-center justify-center gap-1.5">
                <Star size={14} /> Star on GitHub {stars !== null && `(${stars})`}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasData && view === 'tracker' && (
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 pt-4">
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 flex items-center gap-3">
            <span className="text-sm text-zinc-300 line-clamp-2 sm:truncate">{quote}</span>
            <span className="ml-auto hidden md:inline text-[11px] font-mono text-zinc-500">Day {stats.dayNum}/{totalDays}</span>
          </motion.div>
        </div>
      )}

      {hasData && view === 'tracker' && (() => {
        const prev = addDays(selectedDate, -1)
        if (prev < start || prev > end) return null
        const pe = entries[prev] || {}
        const done = effectiveHabits.filter(h => pe[h.id]).length
        const perfect = effectiveHabits.length && done === effectiveHabits.length
        return (
          <div className="max-w-[1040px] mx-auto px-5 sm:px-6 pt-3">
            <div className={`rounded-2xl border px-4 py-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono ${perfect ? 'bg-white text-zinc-900 border-white' : done > 0 ? 'bg-zinc-900 text-zinc-200 border-zinc-800' : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'}`}>
              <span className="font-medium">Yesterday {prev}:</span>
              <span className="font-semibold">{perfect ? 'Perfect' : `${done}/${effectiveHabits.length} done`}</span>
              <button onClick={() => setSelectedDate(prev)} className="ml-auto text-xs px-4 h-9 inline-flex items-center rounded-full underline decoration-zinc-600 hover:text-white transition">View</button>
            </div>
          </div>
        )
      })()}

      {view === 'landing' && (
        <main id="main">
          <section className="relative overflow-hidden aurora border-b border-zinc-800">
            {heroReady && <Suspense fallback={null}><ThreeHero /></Suspense>}
            <div className="max-w-[1040px] mx-auto px-5 sm:px-6 min-h-[calc(100dvh-3.5rem)] flex flex-col justify-center py-16">
            <motion.div variants={stagger} initial="hidden" animate="show" className="text-center">
              <motion.h1 variants={fadeUp} className="font-[800] tracking-[-0.045em] leading-[0.88] text-[56px] sm:text-[88px] lg:text-[104px] text-white">
                Lock in while<br />
                they coast.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 text-[18px] sm:text-[24px] font-medium text-zinc-400 max-w-[620px] mx-auto">
                Disappear for 90 days. Come back unrecognizable.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 max-w-[520px] mx-auto text-[15px] leading-6 text-zinc-500">
                Pick a few habits. Check them off daily. Nothing leaves your device.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={startOnboarding} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-white text-zinc-900 font-semibold text-[15px] hover:bg-zinc-100 transition">
                  Start your arc <ArrowRight size={16} />
                </button>
                <button onClick={() => { hasData ? goTo('tracker') : goTo('templates') }} className="w-full sm:w-auto inline-flex items-center justify-center px-7 h-12 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 font-medium text-[15px] hover:bg-zinc-800 hover:border-zinc-700 transition">
                  {hasData ? 'Open tracker' : 'Browse templates'}
                </button>
              </motion.div>
            </motion.div>
            </div>
          </section>

          <section className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }} className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Preview</div>
                <div className="text-[11px] font-mono text-zinc-600">Honest grid</div>
              </div>
              <div className="grid md:grid-cols-[300px_1fr] gap-0">
                <div className="p-5 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/40">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500">Day 14 · 3 of 5 done</div>
                  <div className="mt-3 space-y-2">
                    {[
                      { n: 'Gym 45m', icon: 'dumbbell', d: true },
                      { n: 'Sleep 7.5h', icon: 'moon', d: true },
                      { n: 'No sugar', icon: 'salad', d: true },
                      { n: 'Deep work 90m', icon: 'target', d: false },
                      { n: 'Reading 10p', icon: 'bookopen', d: false },
                    ].map(r => (
                      <div key={r.n} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${r.d ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>
                        <span className={`w-5 h-5 rounded-full border grid place-items-center ${r.d ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-700'}`}>{r.d ? <Check size={12} /> : null}</span>
                        <span className="w-7 h-7 rounded-full bg-zinc-800 grid place-items-center text-zinc-400"><HabitIcon name={r.icon} size={13} /></span>
                        <span className="font-medium">{r.n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] font-mono"><span className="text-zinc-500">3 of 5</span><span className="text-zinc-400">60%</span></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between"><span className="text-[11px] font-mono tracking-widest text-zinc-500">Full arc</span><span className="text-[11px] font-mono text-zinc-600">Missed stays visible</span></div>
                  <div className="mt-4 grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                    {Array.from({ length: 42 }, (_, i) => {
                      const v = i < 11 ? 'perfect' : i < 14 ? 'partial' : i < 16 ? 'miss' : i < 28 ? 'future' : 'empty'
                      const cls = v === 'perfect' ? 'bg-white border-white' : v === 'partial' ? 'bg-zinc-300 border-zinc-300' : v === 'miss' ? 'bg-red-500/15 border-red-500/20' : 'bg-zinc-800 border-zinc-800'
                      return <div key={i} className={`aspect-square rounded-sm border ${cls}`} />
                    })}
                  </div>
                  <div className="mt-4 flex gap-4 text-[11px] font-mono text-zinc-600">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white border border-white" /> perfect</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-300 border border-zinc-300" /> partial</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/15 border border-red-500/20" /> missed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section id="features" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 scroll-mt-[calc(3.5rem+env(safe-area-inset-top))]">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><LayoutGrid size={12} /> Features</div>
            <h2 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Stay honest.</h2>
            <p className="mt-1.5 text-sm text-zinc-500 max-w-[560px]">Three things, and none of them nag you.</p>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2 md:min-h-[280px]">
                <div className="p-6 sm:p-7 flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-full bg-white text-zinc-900 grid place-items-center"><Check size={16} /></div>
                  <h3 className="mt-3 text-[15px] font-semibold text-white">The grid does not lie</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">One square a day. White is clean, grey is partial, red is a miss. There is no reset button.</p>
                  <div className="mt-4 text-xs font-mono text-zinc-600">Local only · Export JSON/CSV anytime</div>
                </div>
                <div className="bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 p-5 grid place-items-center">
                  <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 w-full max-w-[360px]">
                    {Array.from({ length: 56 }, (_, i) => {
                      const c = i < 18 ? 'bg-white border-white' : i < 22 ? 'bg-zinc-300 border-zinc-300' : i < 24 ? 'bg-red-500/15 border-red-500/20' : 'bg-zinc-800 border-zinc-800'
                      return <div key={i} className={`aspect-square rounded-sm border ${c}`} />
                    })}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2 md:min-h-[280px]">
                <div className="bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 p-6 grid place-items-center order-2 md:order-1">
                  <div className="flex items-center gap-6">
                    <Ring pct={72} size={72}><span className="text-xs font-bold text-white">72%</span></Ring>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-200"><span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center"><Dumbbell size={13} /></span> Gym 72%</div>
                      <div className="flex items-center gap-2 text-sm text-zinc-200"><span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center"><Moon size={13} /></span> Sleep 84%</div>
                      <div className="flex items-center gap-2 text-sm text-zinc-200"><span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center"><Target size={13} /></span> Work 61%</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-7 flex flex-col justify-center order-1 md:order-2">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 grid place-items-center"><Trophy size={16} /></div>
                  <h3 className="mt-3 text-[15px] font-semibold text-white">Rings for each habit</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">See which habit is dragging and which one runs itself.</p>
                  <div className="mt-4 text-xs font-mono text-zinc-600">Updates live as you check the day</div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2 md:min-h-[280px]">
                <div className="p-6 sm:p-7 flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 grid place-items-center"><ExternalLink size={16} /></div>
                  <h3 className="mt-3 text-[15px] font-semibold text-white">Share only if you want</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">A PNG for X or WhatsApp. Nothing leaves the device until you tap share.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-white border border-white text-zinc-900 text-xs font-semibold">X Post</span>
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold">WhatsApp</span>
                    <span className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs">PNG</span>
                  </div>
                </div>
                <div className="bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 p-6 grid place-items-center">
                  <div className="w-full max-w-[320px] rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="text-[11px] font-mono tracking-widest text-zinc-500">WINTERARC · Day 34/92</div>
                    <div className="mt-2 text-sm font-semibold text-white">18 perfect · 64% · streak 5</div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full w-[64%] bg-white" /></div>
                    <div className="mt-3 text-xs text-zinc-500">Day 34 of 92. No filter, no caption needed.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="how" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 scroll-mt-[calc(3.5rem+env(safe-area-inset-top))]">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Zap size={12} /> How it works</motion.div>
              <motion.h2 variants={fadeUp} className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Set it up once. Then it is ten seconds a day.</motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-sm text-zinc-500 max-w-[560px]">Yes or no. No partial credit, no streak insurance.</motion.p>

              <div className="mt-8 grid sm:grid-cols-3 gap-6">
                {[
                  { n: '01', t: 'Set it up', d: 'Your dates, your habits. Five is plenty. Past seven you are lying to yourself.' },
                  { n: '02', t: 'Tap what you did', d: 'Backfill any past date. Forgetting to log is not the same as missing.' },
                  { n: '03', t: 'Watch the grid fill', d: 'Red stays red. That is the point.' },
                ].map(s => (
                  <motion.div variants={fadeUp} key={s.n} className="flex gap-4">
                    <div className="text-[13px] font-mono tracking-widest text-zinc-500 pt-0.5">{s.n}</div>
                    <div><div className="text-[14px] font-semibold text-white">{s.t}</div><div className="mt-1 text-[13px] leading-5 text-zinc-500">{s.d}</div></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

        </main>
      )}

      {view === 'templates' && (
        <main id="main">
          <section className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><BookOpen size={12} /> Templates</div>
            <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Start from a template</h1>
            <p className="mt-1.5 text-sm text-zinc-500">Pick one, then edit it in setup.</p>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(t => (
                <motion.div variants={fadeUp} key={t.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col hover:border-zinc-700 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300"><HabitIcon name={t.icon} size={16} /></span>
                    <span className="text-[15px] font-semibold text-white">{t.name}</span>
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-zinc-500">{t.desc}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5 flex-1 content-start">
                    {t.habitIds.map(hid => {
                      const h = PRESETS.find(p => p.id === hid)
                      return <span key={hid} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{h ? <><HabitIcon name={h.icon} size={11} /> {h.name}</> : hid}</span>
                    })}
                  </div>
                  <button onClick={() => applyTemplate(t.id)} className="mt-auto pt-4 inline-flex items-center gap-1.5 px-5 h-11 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition self-start">Use template <ArrowRight size={14} /></button>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </main>
      )}

      {view === 'resources' && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Compass size={12} /> Resources</div>
          <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Tools worth using</h1>
          <p className="mt-1.5 text-sm text-zinc-500">Everything here is usable without paying. No affiliate links.</p>
          <div className="mt-8 space-y-6">
            {Object.entries(resources).map(([key, cat]) => (
              <div key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-[15px] font-semibold text-white">{cat.title}</div>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {cat.items.map(it => (
                    <a key={it.name} href={it.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700 transition block group">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium text-white group-hover:text-zinc-200 transition">{it.name}</span><ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" /></div>
                      <div className="text-xs text-zinc-500 mt-1">{it.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2"><Star size={14} /> Quote of the day</h2>
              <span className="text-xs font-mono text-zinc-500">Day {stats.dayNum || 1}</span>
            </div>
            <blockquote className="mt-3 text-[15px] leading-6 text-zinc-200">{quote}</blockquote>
          </div>
        </main>
      )}

      {view === 'about' && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Snowflake size={12} /> The idea</div>
          <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">What a winter arc actually is</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 max-w-[620px]">
            A winter arc is the stretch of the year most people write off. School is grinding, work is grinding, the weather is bad, and the plan quietly becomes January. The idea is to use that window instead of waiting it out.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[15px] font-semibold text-white">Why the end of the year</div>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                Nobody is watching in October. There is no new year energy to borrow and nobody to perform for, so the only thing keeping you going is the habit itself. That is the whole test. If you can hold it through the worst stretch, January is a formality.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[15px] font-semibold text-white">Why a fixed window</div>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                An open ended habit has no finish line, so there is never a day you can point at. A fixed window gives you a start, an end, and a grid that fills in between. You either did it or you did not, and the grid remembers either way.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[15px] font-semibold text-white">Why the dates are yours</div>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                The default is October 1 to December 31 because that is what people mean by a winter arc. It is a default, not a rule. Set any start and end date in setup and the grid, the streaks and the badges all follow your dates.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[15px] font-semibold text-white">Why no streak insurance</div>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                Most trackers let you freeze a streak or repair a day. That turns the number into a score you protect rather than a record of what happened. Here a missed day stays red, and you can still fill in any past date you actually did.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="text-[15px] font-semibold text-white">How to not waste it</div>
            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-zinc-500">
              <li>Pick fewer habits than you think you can hold. Three you never miss beats eight you miss half of.</li>
              <li>Make every habit answerable with yes or no. "Eat better" is not a habit, "no sugar" is.</li>
              <li>Set a floor, not a target. The gym habit is showing up, not the perfect session.</li>
              <li>Missing one day is noise. Missing two in a row is the thing that ends arcs.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={startOnboarding} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition">Start your arc <ArrowRight size={14} /></button>
            <button onClick={() => goTo('templates')} className="inline-flex items-center h-11 px-5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm hover:bg-zinc-800 hover:border-zinc-700 transition">See templates</button>
          </div>
        </main>
      )}

      {view === 'install' && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Smartphone size={12} /> Install</div>
          <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Put it on your home screen</h1>
          <p className="mt-1.5 text-sm text-zinc-500 max-w-[560px]">WinterArc is a web app that installs like a native one. It opens without browser chrome, works offline, and your data stays in the same place it already is.</p>

          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <a href={site.domain} className="font-mono text-[13px] text-white underline decoration-zinc-700 hover:decoration-zinc-400 px-2">{site.domain.replace('https://', '')}</a>
            <button onClick={copyLink} className="ml-auto inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy link</>}
            </button>
          </div>

          {installEvent && (
            <button onClick={runInstall} className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition">
              Install now <ArrowRight size={14} />
            </button>
          )}

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'iPhone and iPad',
                note: 'Safari only. Chrome and in-app browsers cannot install it.',
                steps: ['Open the site in Safari', 'Tap the Share button in the toolbar', 'Scroll down and tap Add to Home Screen', 'Tap Add'],
              },
              {
                title: 'Android',
                note: 'Chrome, Edge, Samsung Internet and Brave all work.',
                steps: ['Open the site in Chrome', 'Tap the three dot menu', 'Tap Install app or Add to home screen', 'Confirm'],
              },
              {
                title: 'Desktop',
                note: 'Chrome, Edge and Brave. Safari on Mac uses Add to Dock.',
                steps: ['Open the site', 'Click the install icon at the right of the address bar', 'Click Install'],
              },
            ].map(p => (
              <div key={p.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col">
                <div className="text-[15px] font-semibold text-white">{p.title}</div>
                <div className="mt-1 text-[13px] leading-5 text-zinc-500">{p.note}</div>
                <ol className="mt-4 mb-auto space-y-2">
                  {p.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[13px] leading-5 text-zinc-300">
                      <span className="w-5 h-5 shrink-0 rounded-full border border-zinc-700 bg-zinc-950 grid place-items-center text-[10px] font-mono text-zinc-400">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="text-[15px] font-semibold text-white">What you should know on iOS</div>
            <ul className="mt-3 space-y-2 text-[13px] leading-5 text-zinc-500">
              <li>Apple only lets Safari add a web app to the home screen, so that step cannot be skipped.</li>
              <li>The installed copy keeps its own storage. If you set up your arc in Safari first, it carries over. If you set it up somewhere else, it does not.</li>
              <li>Storage is capped lower than a native app. A whole arc is a few kilobytes, so this will not bite you.</li>
              <li>Notifications need iOS 16.4 or later and only work after you add it to the home screen. WinterArc does not send any yet.</li>
            </ul>
          </div>
        </main>
      )}

      {view === 'feedback' && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><NotebookPen size={12} /> Feedback</div>
          <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Found a bug, want a feature</h1>
          <p className="mt-1 text-sm text-zinc-500 max-w-[560px]">There is no form here and no analytics. Everything goes through GitHub or X, so you can see what happened to your report.</p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Report a bug', body: 'Open an issue with what you did and what happened.', label: 'Open an issue', href: site.support.github + '/issues/new' },
              { title: 'Suggest a feature', body: 'Issues are fine. A pull request is better.', label: 'Read CONTRIBUTING', href: site.support.github + '/blob/main/CONTRIBUTING.md' },
              { title: 'Just say something', body: 'Short thoughts are easier to send on X.', label: '@ashutosh887_', href: 'https://x.com/ashutosh887_' },
            ].map(c => (
              <div key={c.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col">
                <div className="text-sm font-semibold text-white">{c.title}</div>
                <p className="mt-1.5 text-[13px] leading-5 text-zinc-500 flex-1">{c.body}</p>
                <a href={c.href} target="_blank" rel="noreferrer" className="mt-auto pt-4 inline-flex items-center gap-1.5 self-start px-5 h-11 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 text-sm hover:bg-zinc-800 hover:border-zinc-700 transition">
                  {c.label} <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="text-sm font-semibold text-white">Before you file</div>
            <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">Your data lives in this browser only. If the grid looks wrong, export JSON from the dashboard and attach it. Nothing in the export leaves your machine until you upload it yourself.</p>
          </div>
        </main>
      )}

      {(view === 'tracker' || view === 'dashboard') && !hasData && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-white grid place-items-center mx-auto"><ArrowRight size={18} /></div>
            <h2 className="mt-4 text-[22px] font-bold tracking-tight text-white">No arc yet</h2>
            <p className="mt-2 text-sm text-zinc-500">Start your arc to see the tracker. It takes 30 seconds.</p>
            <Button onClick={startOnboarding} className="mt-6 h-11 px-5">Start your arc <ArrowRight size={14} /></Button>
          </div>
        </main>
      )}

      {view === 'tracker' && hasData && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-8">
          <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex items-center gap-3">
              <Ring pct={Math.round((stats.dayNum / totalDays) * 100)} size={56}><span className="text-[10px] font-mono font-bold tabular-nums text-white">{stats.dayNum}/{totalDays}</span></Ring>
              <div className="min-w-0">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Day</div>
                <div className="text-lg font-bold text-white">{stats.remaining} left</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate">{start} to {end}</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex items-center gap-3">
              <Ring pct={stats.streak ? Math.min(100, (stats.streak / 7) * 100) : 0} size={56}><span className="text-zinc-300"><Flame size={18} /></span></Ring>
              <div className="min-w-0">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Streak</div>
                <div className="text-lg font-bold text-white">{stats.streak} <span className="text-xs font-mono text-zinc-500">best {stats.bestStreak}</span></div>
                <div className="text-[10px] font-mono text-zinc-500">{stats.perfect} perfect days</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex items-center gap-3">
              <Ring pct={stats.pct} size={56}><span className="text-xs font-bold tabular-nums text-white">{stats.pct}%</span></Ring>
              <div className="min-w-0">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Completion</div>
                <div className="text-lg font-bold text-white">{stats.totalChecked}<span className="text-xs font-mono text-zinc-500">/{stats.totalPossible}</span></div>
                <div className="text-[10px] font-mono text-zinc-500">checks logged</div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-500 px-2 hidden sm:inline">Share</span>
            <button onClick={() => shareToX()} className="flex-1 sm:flex-none px-5 h-10 rounded-full bg-white text-zinc-900 font-semibold text-xs hover:bg-zinc-100 transition">X Post</button>
            <button onClick={() => shareToWhatsApp()} className="flex-1 sm:flex-none px-5 h-10 rounded-full bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 transition">WhatsApp</button>
            <button onClick={() => downloadImage()} className="flex-1 sm:flex-none px-5 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-white text-xs hover:bg-zinc-700 transition">PNG</button>
            <button onClick={() => nativeShare()} className="flex-1 sm:flex-none sm:ml-auto px-5 h-10 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs hover:text-white hover:border-zinc-700 transition">More</button>
          </div>

          <div className="mt-6 grid lg:grid-cols-[360px_1fr] gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 h-fit">
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-semibold text-white">Daily check-in</div>
                <Ring pct={dailyPct} size={44} stroke={3}><span className="text-[11px] font-mono font-bold text-zinc-300">{dailyPct}%</span></Ring>
              </div>
              <div className="text-xs text-zinc-500 -mt-1">Pick any past date. Rings update live.</div>
              <input type="date" value={selectedDate} min={start} max={end} onChange={e => setSelectedDate(e.target.value)} className="mt-3 w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 min-h-11 text-base sm:text-sm text-white" />
              <div className="mt-4 space-y-2">
                {effectiveHabits.map(h => {
                  const done = !!(entries[selectedDate] || {})[h.id]
                  return (
                    <label key={h.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition ${done ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                      <input type="checkbox" checked={done} onChange={() => toggleHabit(selectedDate, h.id)} className="accent-zinc-900 w-4 h-4" />
                      <span className={`w-7 h-7 rounded-full grid place-items-center border ${done ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}><HabitIcon name={h.icon} size={14} /></span>
                      <span className={`text-sm flex-1 ${done ? 'text-zinc-900 font-medium' : 'text-zinc-200'}`}>{h.name}</span>
                      {done && <span className="text-zinc-900"><Check size={14} /></span>}
                    </label>
                  )
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono"><span className="text-zinc-400">{Object.keys(entries[selectedDate] || {}).length}/{effectiveHabits.length} done</span><span className={`${effectiveHabits.length && effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'text-white inline-flex items-center gap-1' : 'text-zinc-500'}`}>{effectiveHabits.length && effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? <><Check size={12} /> Perfect day</> : 'keep going'}</span></div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { const e = entries[selectedDate] || {}; const allDone = effectiveHabits.every(h => e[h.id]); const next = {}; effectiveHabits.forEach(h => next[h.id] = !allDone ? true : false); setEntries(prev => ({ ...prev, [selectedDate]: !allDone ? next : {} })) }} className="flex-1 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium border border-zinc-700 transition">{effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'Clear day' : 'Mark all done'}</button>
                <button onClick={() => setSelectedDate(todayYMD())} className="px-5 h-11 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition">Today</button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
              <div className="flex items-center justify-between"><div className="text-[15px] font-semibold text-white">{totalDays} day grid</div><div className="text-xs font-mono text-zinc-500">Missed stays visible · No restart</div></div>
              <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-1.5">
                {allDates.map(d => {
                  const e = entries[d] || {}; const done = effectiveHabits.filter(h => e[h.id]).length; const perfect = effectiveHabits.length > 0 && done === effectiveHabits.length; const isToday = d === todayYMD(); const isSelected = d === selectedDate; const isFuture = d > todayYMD()
                  let bg = 'bg-zinc-800 border-zinc-700'
                  if (isFuture) bg = 'bg-zinc-900 border-zinc-800 opacity-40'
                  else if (perfect) bg = 'bg-white border-white'
                  else if (done > 0) bg = 'bg-zinc-300 border-zinc-300'
                  else if (d < todayYMD()) bg = 'bg-red-500/15 border-red-500/20'
                  return (<button key={d} onClick={() => setSelectedDate(d)} className={`relative aspect-square rounded-md border flex flex-col items-center justify-center transition active:scale-95 hover:scale-[1.04] ${bg} ${isSelected ? 'ring-2 ring-inset ring-white' : ''}`} aria-label={`${d}, ${done} of ${effectiveHabits.length} done`} title={`${d} - ${done}/${effectiveHabits.length}`}><span className={`text-[11px] font-mono tabular-nums ${perfect ? 'text-zinc-900' : done > 0 ? 'text-zinc-900' : d < todayYMD() ? 'text-red-300' : 'text-zinc-500'}`}>{d.slice(8, 10)}</span><span className={`hidden sm:block text-[9px] font-mono ${perfect ? 'text-zinc-700' : 'text-zinc-500'}`}>{done}/{effectiveHabits.length}</span>{isToday && <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-zinc-900" />}</button>)
                })}
              </div>
              <div className="mt-6">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Habit rings</div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {effectiveHabits.map(h => {
                    const hits = allDates.filter(d => (entries[d] || {})[h.id]).length
                    const pct = Math.round((hits / totalDays) * 100)
                    return (
                      <div key={h.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 flex flex-col items-center gap-1.5">
                        <Ring pct={pct} size={56} stroke={4}><span className="text-zinc-200"><HabitIcon name={h.icon} size={16} /></span></Ring>
                        <div className="text-[11px] text-center leading-tight text-zinc-200 line-clamp-2" title={h.name}>{h.name}</div>
                        <div className="text-[11px] font-mono text-zinc-400">{pct}% · {hits}/{totalDays}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <button onClick={() => setPromptOpen(v => !v)} aria-expanded={promptOpen} className="w-full flex items-center justify-between gap-3 text-left">
              <span className="text-[15px] font-semibold text-white">Export and LLM prompt</span>
              <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                {promptOpen ? 'Hide' : 'Show'} <ChevronDown size={14} className={`transition-transform ${promptOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {promptOpen && (
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={copyPrompt} className="px-4 h-9 rounded-full bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition">{promptCopied ? 'Copied' : 'Copy prompt'}</button>
                  <button onClick={exportJSON} className="px-4 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-white text-xs hover:bg-zinc-700 transition">JSON</button>
                  <button onClick={exportCSV} className="px-4 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-white text-xs hover:bg-zinc-700 transition">CSV</button>
                  <button onClick={resetAll} className="ml-auto px-4 h-9 rounded-full bg-red-500/10 border border-red-500/15 text-red-300 text-xs font-semibold hover:bg-red-500/15 transition">Reset arc</button>
                </div>
                <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 overflow-auto max-h-56"><pre className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap break-words font-mono">{llmPrompt}</pre></div>
                <div className="mt-2 text-xs text-zinc-500">Paste this with your exported JSON. Nothing leaves the device until you do.</div>
              </div>
            )}
          </div>
        </main>
      )}

      {view === 'dashboard' && hasData && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center">
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Overall</div>
              <div className="mt-4">
                <Ring pct={stats.pct} size={160} stroke={10}>
                  <div className="text-center"><div className="text-3xl font-bold text-white">{stats.pct}%</div><div className="text-xs font-mono text-zinc-500">{stats.totalChecked}/{stats.totalPossible}</div></div>
                </Ring>
              </div>
              <div className="mt-4 text-sm text-zinc-300">{stats.perfect} perfect of {totalDays} · {stats.perfectPct}%</div>
              <div className="mt-auto pt-4 w-full grid grid-cols-2 gap-2">
                <button onClick={() => shareToX()} className="h-11 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition">Share X</button>
                <button onClick={() => downloadImage()} className="h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">Download PNG</button>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col">
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Weekly</div>
              <div className="mt-4 space-y-2">
                {(() => { const weeks = []; for (let i = 0; i < allDates.length; i += 7)weeks.push(allDates.slice(i, i + 7)); return weeks.map((week, wi) => {
                  const perfectInWeek = week.filter(d => effectiveHabits.length && effectiveHabits.every(h => (entries[d] || {})[h.id])).length
                  const checks = week.reduce((acc, d) => acc + effectiveHabits.filter(h => (entries[d] || {})[h.id]).length, 0)
                  const pct = week.length * effectiveHabits.length ? Math.round((checks / (week.length * effectiveHabits.length)) * 100) : 0
                  return (<div key={wi} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 flex items-center gap-3"><span className="text-xs font-mono text-zinc-500 w-9 shrink-0">W{wi + 1}</span><span className="text-xs text-zinc-400 flex-1">{week[0]?.slice(5)} to {week[week.length - 1]?.slice(5)}</span><span className="text-xs font-mono text-white">{perfectInWeek}/7</span><span className="text-xs font-mono text-zinc-400 w-10 text-right">{pct}%</span></div>)
                }) })()}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col">
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Quote of the day</div>
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="text-sm leading-6 text-zinc-200">{quote}</div>
              </div>
              <div className="mt-4 flex-1 flex flex-col space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-zinc-400 flex items-center gap-1.5"><User size={12} /> Name</span>
                  <span className="flex items-center gap-1.5">
                    <input value={settings?.name ?? ''} onChange={e => setSettings(s => ({ ...s, name: e.target.value || null }))} placeholder="Add name" className="w-28 h-10 rounded-full bg-zinc-950 border border-zinc-800 px-3 text-base sm:text-xs text-white placeholder:text-zinc-500 text-right" />
                    <button onClick={startOnboarding} aria-label="Edit arc" className="w-10 h-10 grid place-items-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition"><Settings size={12} className="text-zinc-400" /></button>
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-zinc-400">Habits</span><span className="text-white font-mono">{effectiveHabits.length}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Range</span><span className="text-white font-mono text-xs truncate ml-2">{start} to {end}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Best streak</span><span className="text-white font-mono">{stats.bestStreak}</span></div>
                <div className="mt-auto pt-3 flex gap-2"><button onClick={exportJSON} className="flex-1 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">JSON</button><button onClick={exportCSV} className="flex-1 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">CSV</button></div>
                <button onClick={resetAll} className="w-full h-11 rounded-full bg-red-500/10 border border-red-500/15 text-red-300 text-sm hover:bg-red-500/15 transition">Reset</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-semibold text-white">Challenges</div>
              <div className="text-xs font-mono text-zinc-500">{achievements.filter(a => a.unlock).length}/{achievements.length} unlocked</div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map(a => (
                <div key={a.id} className={`rounded-2xl border p-4 flex flex-col ${a.unlock ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800'}`}>
                  <div className="flex items-center gap-3">
                    <Ring pct={a.pct} size={44} stroke={3} light={a.unlock}>
                      <span className={a.unlock ? 'text-zinc-900' : 'text-zinc-300'}><HabitIcon name={a.icon} size={15} /></span>
                    </Ring>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-semibold truncate ${a.unlock ? 'text-zinc-900' : 'text-white'}`}>{a.label}</div>
                      <div className={`text-xs truncate ${a.unlock ? 'text-zinc-600' : 'text-zinc-500'}`}>{a.desc}</div>
                    </div>
                  </div>
                  <div className={`mt-3 text-[11px] font-mono ${a.unlock ? 'text-zinc-700' : 'text-zinc-500'}`}>
                    {a.unlock ? 'Unlocked' : `${a.value}/${a.target} · ${a.pct}%`}
                  </div>
                  <div className="mt-auto pt-3 flex gap-1.5">
                    <button disabled={!a.unlock} onClick={() => shareToX(a)} className={`flex-1 h-10 rounded-full text-xs font-semibold border transition ${a.unlock ? 'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'}`}>X</button>
                    <button disabled={!a.unlock} onClick={() => shareToWhatsApp(a)} className={`flex-1 h-10 rounded-full text-xs border transition ${a.unlock ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600' : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'}`}>WhatsApp</button>
                    <button disabled={!a.unlock} onClick={() => downloadImage(a)} className={`px-3 h-10 rounded-full text-xs border transition ${a.unlock ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'}`}>PNG</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      <AnimatePresence>
      {showOnboarding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOnboarding(false)} className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ type: 'spring', damping: 24, stiffness: 260 }} onClick={e => e.stopPropagation()} className="w-full max-w-[760px] max-h-[90dvh] overflow-y-auto overscroll-contain rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Logo size={26} /><span className="font-semibold tracking-[0.16em] text-[13px] text-white">Set up your arc</span> <span className="text-xs font-mono text-zinc-500">Step {onboardStep}/2</span></div><button onClick={() => setShowOnboarding(false)} aria-label="Close" className="w-11 h-11 shrink-0 grid place-items-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition"><X size={14} /></button></div>
            {onboardStep === 1 && (
              <div className="mt-6">
                <h2 className="text-[22px] font-bold tracking-tight text-white">Name and dates</h2>
                <p className="mt-1 text-sm text-zinc-500">Saved in this browser. No account.</p>
                <div className="mt-5 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="arc-name" className="text-zinc-500">Your name</Label>
                    <Input id="arc-name" value={tmpName} onChange={e => setTmpName(e.target.value)} placeholder="Your name" className="h-11" />
                    <div className="text-xs text-zinc-500">Optional. Example: Ashutosh</div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-500">How long</Label>
                    <div className="flex flex-wrap gap-2">
                      {ARC_PRESETS.map(preset => {
                        const range = preset.range()
                        const active = tmpStart === range.start && tmpEnd === range.end
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => { setTmpStart(range.start); setTmpEnd(range.end) }}
                            className={`h-9 px-4 rounded-full text-[13px] font-medium border transition ${active ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'}`}
                          >
                            {preset.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label htmlFor="arc-start" className="text-zinc-500">Start</Label><Input id="arc-start" type="date" value={tmpStart} onChange={e => setTmpStart(e.target.value)} className="h-11 appearance-none" /></div>
                    <div className="space-y-1.5"><Label htmlFor="arc-end" className="text-zinc-500">End</Label><Input id="arc-end" type="date" value={tmpEnd} onChange={e => setTmpEnd(e.target.value)} className="h-11 appearance-none" /></div>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-300">Duration</span>
                    <span className={`text-sm font-mono ${arcLength > 0 ? 'text-white' : 'text-red-300'}`}>
                      {arcLength > 0 ? `${arcLength} days` : 'End date is before the start'}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end"><Button disabled={arcLength < 1} onClick={() => setOnboardStep(2)} className="h-11 px-5">Continue <ArrowRight size={14} /></Button></div>
              </div>
            )}
            {onboardStep === 2 && (
              <div className="mt-6">
                <h2 className="text-[22px] font-bold tracking-tight text-white">Pick your habits</h2>
                <p className="mt-1 text-sm text-zinc-500">Three to five is enough. Ten is the cap.</p>
                <div className="mt-2 text-[11px] font-mono tracking-widest text-zinc-500">Selected {tmpSelected.size} {tmpSelected.size > 10 && '· over 10'}</div>
                {['non-neg', 'extra', 'aesthetic'].map(tier => (<div key={tier} className="mt-5"><div className="text-[11px] font-mono tracking-widest text-zinc-500">{TIER_LABELS[tier]}</div><div className="mt-2 grid sm:grid-cols-2 gap-2">{PRESETS.filter(p => p.tier === tier).map(p => { const sel = tmpSelected.has(p.id); return (<button key={p.id} onClick={() => setTmpSelected(s => { const n = new Set(s); sel ? n.delete(p.id) : n.add(p.id); return n })} className={`text-left rounded-xl border p-3 flex gap-3 items-start transition ${sel ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}><span className={`w-8 h-8 rounded-full grid place-items-center border shrink-0 ${sel ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}><HabitIcon name={p.icon} size={14} /></span><span className="flex-1 min-w-0"><span className={`text-sm font-medium block ${sel ? 'text-zinc-900' : 'text-zinc-200'}`}>{p.name}</span><span className="text-xs text-zinc-500">{p.desc}</span></span><span className={`mt-1 w-5 h-5 rounded-full grid place-items-center border text-xs shrink-0 ${sel ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-700 text-transparent'}`}><Check size={12} /></span></button>) })}</div></div>))}
                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-3"><div className="text-[11px] font-mono tracking-widest text-zinc-500">Custom habit</div><div className="mt-2 flex gap-2"><Input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. No sugar, 3L water" onKeyDown={e => e.key === 'Enter' && addCustom()} /><Button variant="secondary" onClick={addCustom}>Add</Button></div>{customList.length > 0 && (<div className="mt-3 flex flex-wrap gap-2">{customList.map(c => (<Badge key={c.id} variant="secondary" className="gap-1.5">{c.name} <button onClick={() => { setCustomList(prev => prev.filter(x => x.id !== c.id)); setTmpSelected(s => { const n = new Set(s); n.delete(c.id); return n }) }} className="ml-1 hover:text-destructive"><X size={12} /></button></Badge>))}</div>)}</div>
                <div className="mt-6 flex items-center justify-between"><Button variant="outline" onClick={() => setOnboardStep(1)}>Back</Button><Button onClick={completeOnboarding}>Save arc · {tmpSelected.size} habits <ArrowRight size={14} /></Button></div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed right-5 z-40 w-11 h-11 rounded-full border border-zinc-800 bg-zinc-900/90 backdrop-blur text-zinc-300 grid place-items-center shadow-lg hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition" style={{ bottom: showInstallHint ? 'calc(9.5rem + env(safe-area-inset-bottom))' : 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallHint && view === 'landing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px] z-40 rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur p-4 shadow-xl"
            style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300"><Smartphone size={15} /></span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-white">Keep it on your home screen</div>
                <div className="mt-0.5 text-[12px] leading-5 text-zinc-500">Installs like an app, opens offline, still no account.</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={runInstall} className="h-11 px-5 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">
                    {installEvent ? 'Install' : 'How'}
                  </button>
                  <button onClick={dismissInstallHint} className="h-11 px-5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-[13px] hover:text-white transition">Not now</button>
                </div>
              </div>
              <button onClick={dismissInstallHint} aria-label="Dismiss" className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" aria-hidden />

      <footer className="border-t border-zinc-800 mt-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <button onClick={() => goTo('landing')} className="flex items-center gap-2.5">
                <Logo size={22} />
                <span className="font-semibold tracking-[0.16em] text-[12px] text-white">WINTERARC</span>
              </button>
              <p className="mt-3 text-[13px] leading-6 text-zinc-500 max-w-[280px]">
                Set your dates, pick your habits, keep the grid honest.
              </p>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Product</div>
              <div className="mt-3 flex flex-col items-start gap-1">
                <button onClick={() => goTo('about')} className="py-1 text-[13px] text-zinc-400 hover:text-white transition">What is a winter arc</button>
                <button onClick={() => goTo('templates')} className="py-1 text-[13px] text-zinc-400 hover:text-white transition">Templates</button>
                <button onClick={() => goTo('resources')} className="py-1 text-[13px] text-zinc-400 hover:text-white transition">Resources</button>
                <button onClick={() => goTo('install')} className="py-1 text-[13px] text-zinc-400 hover:text-white transition">Install as app</button>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Project</div>
              <div className="mt-3 flex flex-col items-start gap-1">
                <a href={site.support.github} target="_blank" rel="noreferrer" className="py-1 text-[13px] text-zinc-400 hover:text-white transition">GitHub</a>
                <a href={site.support.github + '/blob/main/CONTRIBUTING.md'} target="_blank" rel="noreferrer" className="py-1 text-[13px] text-zinc-400 hover:text-white transition">Contribute</a>
                <button onClick={() => goTo('feedback')} className="py-1 text-[13px] text-zinc-400 hover:text-white transition">Feedback</button>
                <a href="https://x.com/ashutosh887_" target="_blank" rel="noreferrer" className="py-1 text-[13px] text-zinc-400 hover:text-white transition">X</a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] font-mono text-zinc-500">
            <span>&copy; {new Date().getFullYear()} {site.author.name}. MIT licensed.</span>
            <span>Local-first. No account, no trackers.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
