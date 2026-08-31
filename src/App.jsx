import { useEffect, useMemo, useState, useRef, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Flame, Trophy, ExternalLink, Sparkles, Snowflake, Shield, Zap, BookOpen, Dumbbell, Star, ArrowRight, ArrowUp, Heart, X, User, Settings, Menu,
  Footprints, Moon, Salad, Egg, Droplets, Target, Ban, Wind, NotebookPen, Sun, PhoneOff, TreePine, Coins, BrushCleaning, ShowerHead, AlarmClock,
  MountainSnow, Hourglass, Gem, Crown, Rocket, GraduationCap, Lock
} from 'lucide-react'
import { resources, templates, challenges, quotes as QUOTES_CFG } from './config'
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
  { id: 'water', name: 'Water 2–3L', icon: 'droplets', tier: 'non-neg', desc: 'Spread through day.' },
  { id: 'work', name: 'Deep work 90m', icon: 'target', tier: 'non-neg', desc: 'Before email, phone away.' },
  { id: 'no-alcohol', name: 'No alcohol', icon: 'ban', tier: 'non-neg', desc: 'Binary until Jan 1.' },
  { id: 'reading', name: 'Reading 10 pages', icon: 'bookopen', tier: 'extra', desc: 'Non-fiction preferred.' },
  { id: 'meditation', name: 'Meditation 10m', icon: 'wind', tier: 'extra', desc: '5–15 min.' },
  { id: 'journaling', name: 'Journaling', icon: 'notebookpen', tier: 'extra', desc: 'Thoughts / gratitude.' },
  { id: 'sunlight', name: 'Morning sunlight', icon: 'sun', tier: 'extra', desc: 'Outside shortly after waking.' },
  { id: 'phone-am', name: 'No phone 60m AM', icon: 'phoneoff', tier: 'extra', desc: 'First 30–60 min.' },
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

function Ring({ pct, size = 44, stroke = 4, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272a" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fafafa" strokeWidth={stroke} strokeLinecap="round"
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
      <rect width="64" height="64" rx="14" fill="#18181b" stroke="#27272a" strokeWidth="1.2" />
      <path d="M14 44 L24 20 L32 32 L40 20 L50 44" fill="none" stroke="#fafafa" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 44 L32 32 L40 44" fill="none" stroke="#fafafa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
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
  const [view, setView] = useState('landing')
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
  const [showScrollTop, setShowScrollTop] = useState(false)
  const canvasRef = useRef(null)

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

  useEffect(() => { if (!hasData) setView('landing') }, [hasData])
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

  const achievements = useMemo(() => {
    const defs = [
      { id: 'first', label: 'First Check', icon: 'check', desc: 'Log your first habit', unlock: stats.totalChecked >= 1 },
      { id: 'perfect1', label: 'Perfect Day', icon: 'star', desc: '1 perfect day', unlock: stats.perfect >= 1 },
      { id: 'streak3', label: '3-Day Streak', icon: 'flame', desc: '3 perfect days in a row', unlock: stats.bestStreak >= 3 },
      { id: 'streak7', label: 'Week Warrior', icon: 'mountainSnow', desc: '7-day streak', unlock: stats.bestStreak >= 7 },
      { id: 'streak14', label: 'Fortnight', icon: 'snowflake', desc: '14-day streak', unlock: stats.bestStreak >= 14 },
      { id: 'streak30', label: '30 Days Locked', icon: 'gem', desc: '30-day streak', unlock: stats.bestStreak >= 30 },
      { id: 'half', label: 'Halfway', icon: 'hourglass', desc: 'Reach 50% completion', unlock: stats.pct >= 50 },
      { id: 'perfect10', label: '10 Perfect', icon: 'gem', desc: '10 perfect days', unlock: stats.perfect >= 10 },
      { id: 'perfect30', label: '30 Perfect', icon: 'crown', desc: '30 perfect days', unlock: stats.perfect >= 30 },
      { id: 'complete75', label: '75% Done', icon: 'rocket', desc: '75% habits checked', unlock: stats.pct >= 75 },
      { id: 'finish', label: 'Graduation', icon: 'graduationcap', desc: '92/92 perfect. Jan 1', unlock: stats.perfect >= totalDays },
    ]
    return defs
  }, [stats, totalDays])

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
    if (!chosen.length) { alert('Pick at least 1 habit (recommended 3–5)'); return }
    if (!tmpStart || !tmpEnd || isNaN(parseYMD(tmpStart).getTime()) || isNaN(parseYMD(tmpEnd).getTime())) { alert('Pick valid start and end dates'); return }
    if (parseYMD(tmpStart) > parseYMD(tmpEnd)) { alert('Start date must be before end date'); return }
    if (chosen.length > 10 && !confirm(`You picked ${chosen.length} habits. Recommended max is 10. Continue?`)) return
    setSettings({ start: tmpStart, end: tmpEnd, name: tmpName.trim() || null })
    setHabitsV2(chosen); setHabits(chosen)
    setShowOnboarding(false); setView('tracker'); setSelectedDate(tmpStart)
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
  const llmPrompt = `Analyze my Winter Arc data (Oct 1 -> Dec 31). Habits: ${effectiveHabits.map(h => h.name).join(', ')}. Total days: ${totalDays}. Perfect days: ${stats.perfect}/${totalDays} (${stats.perfectPct}%). Completion: ${stats.pct}%. Streak: ${stats.streak}, best: ${stats.bestStreak}. Entries: ${JSON.stringify(entries).slice(0, 4000)} ... Give: 1) patterns, 2) weekly trend, 3) 3 fixes for next 7 days, 4) motivational summary. Concise.`

  function drawShareCard({ achievement } = {}) {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 1200; canvas.height = 675
    const g = ctx.createLinearGradient(0, 0, 1200, 675); g.addColorStop(0, '#020617'); g.addColorStop(1, '#0f172a')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1200, 675)
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(Math.random() * 1200, Math.random() * 675, Math.random() * 1.2, 0, Math.PI * 2); ctx.fill() }
    ctx.fillStyle = '#e0f2fe'; ctx.font = '700 34px ui-sans-serif,system-ui'
    ctx.fillText('WINTERARC · Lock in while they coast.', 60, 80)
    if (achievement) {
      ctx.font = '700 56px ui-sans-serif,system-ui'; ctx.fillStyle = '#38bdf8'; ctx.fillText(achievement.label, 60, 190)
      ctx.font = '400 22px ui-sans-serif,system-ui'; ctx.fillStyle = '#cbd5e1'; ctx.fillText(achievement.desc, 60, 230)
      ctx.font = '400 20px ui-sans-serif,system-ui'; ctx.fillStyle = '#94a3b8'; ctx.fillText(`Day ${stats.dayNum}/${totalDays}  •  ${stats.perfect} perfect  •  ${stats.pct}%  •  streak ${stats.streak}`, 60, 280)
    } else {
      ctx.font = '700 58px ui-sans-serif,system-ui'; ctx.fillStyle = '#38bdf8'; ctx.fillText(`Day ${stats.dayNum} / ${totalDays}`, 60, 180)
      ctx.font = '400 24px ui-sans-serif,system-ui'; ctx.fillStyle = '#cbd5e1'; ctx.fillText(`${stats.perfect} perfect days  •  ${stats.pct}% completion  •  streak ${stats.streak}`, 60, 225)
      ctx.font = '500 15px ui-monospace,monospace'; ctx.fillStyle = '#94a3b8'; ctx.fillText(effectiveHabits.map(h => h.name).join('  •  ').slice(0, 110), 60, 270)
    }
    ctx.fillStyle = '#1e293b'; ctx.fillRect(60, 330, 1080, 16); ctx.fillStyle = '#38bdf8'; ctx.fillRect(60, 330, 1080 * (stats.pct / 100), 16)
    ctx.fillStyle = '#cbd5e1'; ctx.font = 'italic 18px ui-sans-serif,system-ui'; const q = achievement ? `"${quote.q}" - ${quote.a}` : `"${quote.q}"`; ctx.fillText(q.slice(0, 84), 60, 400)
    ctx.fillStyle = '#475569'; ctx.font = '500 13px ui-sans-serif,system-ui'; ctx.fillText('trywinterarc.vercel.app  •  100% local  •  no login  •  open source', 60, 625)
    return canvas.toDataURL('image/png')
  }
  function downloadImage(achievement) {
    const url = drawShareCard({ achievement }); const a = document.createElement('a'); a.href = url; a.download = achievement ? `winter-arc-${achievement.id}.png` : `winter-arc-day${stats.dayNum}.png`; a.click()
  }
  function shareToX(achievement) {
    const text = achievement
      ? `${achievement.label} - Day ${stats.dayNum}/${totalDays} • ${stats.pct}% • streak ${stats.streak}\nLock in while they coast.\n`
      : `Day ${stats.dayNum}/${totalDays} • ${stats.perfect} perfect • ${stats.pct}% • streak ${stats.streak}\nDisappear for 90 days. Come back unrecognizable.\n`
    const url = 'https://trywinterarc.vercel.app'
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
  }
  function shareToWhatsApp(achievement) {
    const text = achievement
      ? `${achievement.label} unlocked! Day ${stats.dayNum}/${totalDays} • ${stats.pct}% • streak ${stats.streak} - trywinterarc.vercel.app`
      : `Winter Arc Day ${stats.dayNum}/${totalDays}: ${stats.pct}% • streak ${stats.streak} - trywinterarc.vercel.app - Lock in while they coast.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
  async function nativeShare(achievement) {
    const text = achievement ? `${achievement.label}: ${achievement.desc}` : `Day ${stats.dayNum}/${totalDays} • ${stats.pct}%`
    if (navigator.share) { try { await navigator.share({ title: 'WinterArc', text, url: location.href }) } catch {} } else { shareToX(achievement) }
  }
  function scrollToId(id) {
    if (view !== 'landing') { setView('landing'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-950/80">
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 h-[56px] flex items-center gap-6">
          <button onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="WinterArc home" className="flex items-center gap-2.5 shrink-0">
            <Logo size={28} />
            <span className="font-semibold tracking-[0.16em] text-[13px] text-white">WINTERARC</span>
          </button>
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {view === 'landing' ? (
              <>
                <button onClick={() => scrollToId('how')} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-zinc-500 hover:text-white transition">How it works</button>
                <button onClick={() => scrollToId('templates')} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-zinc-500 hover:text-white transition">Templates</button>
                <button onClick={() => setView('resources')} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-zinc-500 hover:text-white transition">Resources</button>
              </>
            ) : view === 'resources' ? (
              <button onClick={() => setView('landing')} className="px-3.5 py-1.5 rounded-full text-[13px] text-zinc-400 hover:text-white transition inline-flex items-center gap-1.5"><ArrowRight size={14} className="rotate-180" /> Back</button>
            ) : (
              <button onClick={() => setView('landing')} className="px-3.5 py-1.5 rounded-full text-[13px] text-zinc-400 hover:text-white transition inline-flex items-center gap-1.5"><ArrowRight size={14} className="rotate-180" /> Back</button>
            )}
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            {hasData && (
              <div className="hidden lg:flex items-center gap-1 mr-1">
                <button onClick={() => setView('tracker')} className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition ${view === 'tracker' ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'}`}>Tracker</button>
                <button onClick={() => setView('dashboard')} className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition ${view === 'dashboard' ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'}`}>Dashboard</button>
              </div>
            )}
            <Button onClick={startOnboarding} size="sm" className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100 font-semibold px-4 h-8 text-[13px]">
              <ArrowRight size={14} /> {hasData ? 'Edit arc' : 'Start your arc'}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu" className="lg:hidden rounded-full text-zinc-500 hover:text-white">
              <Menu size={18} />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="lg:hidden sticky top-[56px] z-20 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-[1040px] mx-auto px-5 py-3 grid grid-cols-2 gap-2">
              <button onClick={() => scrollToId('how')} className="px-3 py-2.5 rounded-xl text-sm font-medium text-left border bg-zinc-900 text-zinc-200 border-zinc-800">How it works</button>
              <button onClick={() => scrollToId('templates')} className="px-3 py-2.5 rounded-xl text-sm font-medium text-left border bg-zinc-900 text-zinc-200 border-zinc-800">Templates</button>
              <button onClick={() => { setView('resources'); setMobileMenuOpen(false) }} className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left border ${view === 'resources' ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-200 border-zinc-800'}`}>Resources</button>
              {hasData ? (
                <>
                  <button onClick={() => { setView('tracker'); setMobileMenuOpen(false) }} className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left border ${view === 'tracker' ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>Tracker</button>
                  <button onClick={() => { setView('dashboard'); setMobileMenuOpen(false) }} className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left border ${view === 'dashboard' ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>Dashboard</button>
                </>
              ) : (
                <button onClick={() => { setView('landing'); startOnboarding(); setMobileMenuOpen(false) }} className="col-span-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-center bg-white text-zinc-900">Start your arc</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasData && view === 'tracker' && (
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 pt-4">
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 flex items-center gap-3">
            <span className="text-zinc-600 text-lg leading-none">“</span>
            <span className="text-sm text-zinc-300 truncate">“{quote.q}”</span>
            <span className="hidden sm:inline text-xs font-mono text-zinc-500 whitespace-nowrap">- {quote.a}</span>
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
            <div className={`rounded-full border px-4 py-2 flex items-center gap-2 text-xs font-mono ${perfect ? 'bg-white text-zinc-900 border-white' : done > 0 ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'}`}>
              <span className="font-medium">Yesterday {prev}:</span>
              <span className="font-semibold">{perfect ? 'Perfect. Streak lives' : `${done}/${effectiveHabits.length} done`}</span>
              <button onClick={() => setSelectedDate(prev)} className="ml-auto text-[11px] underline decoration-zinc-600 hover:text-white transition">View</button>
            </div>
          </div>
        )
      })()}

      {view === 'landing' && (
        <main id="main">
          <section className="relative overflow-hidden aurora border-b border-zinc-800">
            <Suspense fallback={null}><ThreeHero /></Suspense>
            <div className="max-w-[1040px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-12">
            <motion.div variants={stagger} initial="hidden" animate="show" className="text-center">
              <motion.h1 variants={fadeUp} className="font-[800] tracking-[-0.04em] leading-[0.92] text-[40px] sm:text-[60px] text-white">
                Lock in while<br />
                they coast.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 text-[16px] sm:text-[18px] font-medium text-zinc-500 max-w-[520px] mx-auto">
                Disappear for 90 days. Come back unrecognizable.
              </motion.p>
              {todayYMD() < DEFAULT_START && (
                <motion.div variants={fadeUp} className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                  September is prep. {daysBetween(todayYMD(), DEFAULT_START)} days to Oct 1
                </motion.div>
              )}
              <motion.p variants={fadeUp} className="mt-5 max-w-[560px] mx-auto text-[14.5px] leading-6 text-zinc-500">
                A private tracker for your 90-day lock-in. Pick 3–5 habits. Check daily. No account, no cloud. Data stays on your device.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={startOnboarding} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 font-semibold text-[14px] hover:bg-zinc-100 transition">
                  Start your arc <ArrowRight size={16} />
                </button>
                <button onClick={() => { if (!hasData) startOnboarding(); else setView('tracker') }} className="w-full sm:w-auto inline-flex justify-center px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 font-medium text-[14px] hover:bg-zinc-800 hover:border-zinc-700 transition">
                  {hasData ? 'Open tracker' : 'See how it works'}
                </button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.22,1,0.36,1] }} className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-zinc-800" /><span className="w-2.5 h-2.5 rounded-full bg-zinc-800" /><span className="w-2.5 h-2.5 rounded-full bg-zinc-800" /></div>
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Preview</div>
                <div className="text-[11px] font-mono text-zinc-600 hidden sm:block">Honest grid</div>
              </div>
              <div className="grid md:grid-cols-[300px_1fr] gap-0">
                <div className="p-5 border-r border-zinc-800 bg-zinc-950/40">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500">Today · Oct 14 · 3/5</div>
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
                  <div className="mt-4 flex items-center justify-between text-[11px] font-mono"><span className="text-zinc-500">3 / 5 done</span><span className="text-zinc-400">60% · Keep going</span></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between"><span className="text-[11px] font-mono tracking-widest text-zinc-500">Oct → Dec grid</span><span className="text-[11px] font-mono text-zinc-600">Missed stays visible</span></div>
                  <div className="mt-4 grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                    {Array.from({ length: 42 }, (_, i) => {
                      const v = i < 11 ? 'perfect' : i < 14 ? 'partial' : i < 16 ? 'miss' : i < 28 ? 'future' : 'empty'
                      const cls = v === 'perfect' ? 'bg-white border-white' : v === 'partial' ? 'bg-zinc-300 border-zinc-300' : v === 'miss' ? 'bg-red-500/15 border-red-500/20' : 'bg-zinc-800 border-zinc-800'
                      return <div key={i} className={`aspect-square rounded-md border ${cls}`} />
                    })}
                  </div>
                  <div className="mt-4 flex gap-4 text-[11px] font-mono text-zinc-600">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-white border border-white" /> perfect</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-zinc-300" /> partial</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/15 border border-red-500/20" /> missed</span>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </section>

          <section id="features" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 scroll-mt-16">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Sparkles size={12} /> Features</div>
            <h2 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Stay honest.</h2>
            <p className="mt-1.5 text-sm text-zinc-500 max-w-[560px]">A grid, a ring, and a share card if you want one.</p>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2">
                <div className="p-6 sm:p-7 flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-xl bg-white text-zinc-900 grid place-items-center"><Check size={16} /></div>
                  <h3 className="mt-3 text-[16px] font-semibold text-white">The grid does not lie</h3>
                  <p className="mt-1.5 text-[13.5px] leading-6 text-zinc-500">92 squares. White is perfect, gray is partial, red is missed. Fill any past date. No reset button. What you see is what you did.</p>
                  <div className="mt-4 text-xs font-mono text-zinc-600">Local only · Export JSON/CSV anytime</div>
                </div>
                <div className="bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 p-5 grid place-items-center">
                  <div className="grid grid-cols-14 gap-1.5 w-full max-w-[360px]">
                    {Array.from({ length: 56 }, (_, i) => {
                      const c = i < 18 ? 'bg-white border-white' : i < 22 ? 'bg-zinc-300 border-zinc-300' : i < 24 ? 'bg-red-500/15 border-red-500/20' : 'bg-zinc-800 border-zinc-800'
                      return <div key={i} className={`aspect-square rounded-[6px] border ${c}`} />
                    })}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2">
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
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 grid place-items-center"><Trophy size={16} /></div>
                  <h3 className="mt-3 text-[16px] font-semibold text-white">Rings for each habit</h3>
                  <p className="mt-1.5 text-[13.5px] leading-6 text-zinc-500">Not just one big percent. See which habit is dragging you down and which one is on autopilot.</p>
                  <div className="mt-4 text-xs font-mono text-zinc-600">Updates live as you check the day</div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2">
                <div className="p-6 sm:p-7 flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 grid place-items-center"><ExternalLink size={16} /></div>
                  <h3 className="mt-3 text-[16px] font-semibold text-white">Share only if you want</h3>
                  <p className="mt-1.5 text-[13.5px] leading-6 text-zinc-500">PNG card for X or WhatsApp, or copy a prompt for your LLM. Nothing leaves your device until you hit share.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-semibold">X Post</span>
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold">WhatsApp</span>
                    <span className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs">PNG</span>
                  </div>
                </div>
                <div className="bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 p-6 grid place-items-center">
                  <div className="w-full max-w-[320px] rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="text-[11px] font-mono tracking-widest text-zinc-500">WINTERARC · Day 34/92</div>
                    <div className="mt-2 text-sm font-semibold text-white">18 perfect · 64% · streak 5</div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full w-[64%] bg-white" /></div>
                    <div className="mt-3 text-xs italic text-zinc-500">"You are what you do when no one is clapping."</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="how" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 sm:py-14 scroll-mt-16">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Zap size={12} /> How it works</motion.div>
              <motion.h2 variants={fadeUp} className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Pick habits. Check daily. Jan 1 you’ll know.</motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-sm text-zinc-500 max-w-[620px]">Three tiers keep you honest. Choose 3 to 5 to start. Every habit is binary. Yes or no each day. No partial credit games.</motion.p>

              <div className="mt-8 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                <motion.div variants={fadeUp} className="p-6">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500 flex items-center gap-1.5"><span className="w-6 h-6 rounded-full bg-white text-zinc-900 grid place-items-center"><Zap size={12} /></span> 01 · Non negotiables</div>
                  <div className="mt-3 text-[14px] font-semibold text-white">What actually changes you</div>
                  <div className="mt-2 text-[13px] leading-5 text-zinc-500">Gym. Steps. Sleep. No sugar. Protein. Water. Deep work. Pick three to five.</div>
                </motion.div>
                <motion.div variants={fadeUp} className="p-6">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500">02 · Good extras</div>
                  <div className="mt-3 text-[14px] font-semibold text-white">Useful extras</div>
                  <div className="mt-2 text-[13px] leading-5 text-zinc-500">Reading. Meditation. Journaling. Sunlight. Phone limits.</div>
                </motion.div>
                <motion.div variants={fadeUp} className="p-6">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500 flex items-center gap-1.5"><Snowflake size={12} /> 03 · Aesthetic · Optional</div>
                  <div className="mt-3 text-[14px] font-semibold text-white">You don’t need this to win</div>
                  <div className="mt-2 text-[13px] leading-5 text-zinc-500">Cold shower. 5am wake. 100 pushups. Just for discipline.</div>
                </motion.div>
              </div>

              <div className="mt-4 rounded-full border border-zinc-800 bg-zinc-900 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white"><span className="w-6 h-6 rounded-full bg-white grid place-items-center"><Check size={14} className="text-zinc-900" /></span> Open source. Local-first.</div>
                <div className="text-xs font-mono text-zinc-500">Data stays on device · Export anytime</div>
              </div>

              <div className="mt-10 grid md:grid-cols-3 gap-8">
                {[
                  { n: '01', t: 'Pick habits', d: 'Choose three to ten. Four or five is enough. Add your own. Keep it yes or no.' },
                  { n: '02', t: 'Check daily', d: 'Fill any past date. Missed days stay red. No restart. The grid tells the truth.' },
                  { n: '03', t: 'Share & export', d: 'Download a PNG for social. Export CSV/JSON. Copy a prompt for your LLM.' },
                ].map(s => (
                  <motion.div variants={fadeUp} key={s.n} className="flex gap-4">
                    <div className="text-[13px] font-mono tracking-widest text-sky-400 pt-0.5">{s.n}</div>
                    <div><div className="text-[14px] font-semibold text-white">{s.t}</div><div className="mt-1 text-[13px] leading-5 text-zinc-500">{s.d}</div></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <section id="templates" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 scroll-mt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><BookOpen size={12} /> Templates</div>
                <h2 className="mt-2 text-[22px] font-bold tracking-tight text-white">Start from a template</h2>
                <p className="mt-1 text-sm text-zinc-500">Pick one and tweak it.</p>
              </div>
              <button onClick={startOnboarding} className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition">Create custom <ArrowRight size={14} /></button>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(t => (
                <motion.div variants={fadeUp} key={t.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col hover:border-zinc-700 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300"><HabitIcon name={t.icon} size={16} /></span>
                    <span className="font-semibold text-sm text-white">{t.name}</span>
                  </div>
                  <div className="mt-2 text-[13px] text-zinc-500 leading-relaxed">{t.desc}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5 flex-1 content-start">
                    {t.habitIds.map(hid => {
                      const h = PRESETS.find(p => p.id === hid)
                      return <span key={hid} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">{h ? <><HabitIcon name={h.icon} size={11} /> {h.name}</> : hid}</span>
                    })}
                  </div>
                  <button onClick={() => applyTemplate(t.id)} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition self-start">Use template <ArrowRight size={14} /></button>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-4 text-center">
              <button onClick={startOnboarding} className="sm:hidden inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm hover:bg-zinc-800 transition">Create custom <ArrowRight size={14} /></button>
            </div>
          </section>

          <section id="challenges" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 scroll-mt-16">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Flame size={12} /> Challenges</div>
            <h2 className="mt-2 text-[22px] font-bold tracking-tight text-white">Stay in the game</h2>
            <p className="mt-1 text-sm text-zinc-500">Progress comes from your arc.</p>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {challenges.map(c => {
                const pct = c.type === 'streak'
                  ? Math.min(100, Math.round((stats.bestStreak / c.days) * 100))
                  : Math.min(100, Math.round(((stats.perfect % 7) / 7) * 100))
                const unlocked = c.type === 'streak' ? stats.bestStreak >= c.days : stats.perfect >= 7
                return (
                  <motion.div variants={fadeUp} key={c.id} className={`rounded-2xl border p-5 flex flex-col ${unlocked ? 'bg-white border-white' : 'bg-zinc-900 border-zinc-800'}`}>
                    <div className="flex items-center gap-3">
                      <Ring pct={hasData ? pct : 0} size={52}><span className={unlocked ? 'text-zinc-900' : 'text-zinc-300'}><HabitIcon name={c.icon} size={18} className={unlocked ? 'text-zinc-900' : 'text-white'} /></span></Ring>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm flex items-center gap-2 ${unlocked ? 'text-zinc-900' : 'text-white'}`}>{c.label}</div>
                        <div className={`text-xs ${unlocked ? 'text-zinc-600' : 'text-zinc-400'}`}>{c.desc}</div>
                        <div className={`text-xs font-mono mt-1 ${unlocked ? 'text-zinc-700' : 'text-zinc-500'}`}>{hasData ? `${pct}% · ${c.type === 'streak' ? `${stats.bestStreak}/${c.days}` : `${stats.perfect % 7}/7`}` : 'Start your arc to track'}</div>
                      </div>
                    </div>
                    <div className={`mt-4 text-xs font-mono px-2.5 py-1 rounded-full self-start border ${unlocked ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                      {unlocked ? 'Unlocked' : hasData ? 'In progress' : 'Not started'}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>

          <section className="max-w-[1040px] mx-auto px-5 sm:px-6 pb-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Ready to lock in?</div>
                <div className="text-sm text-zinc-500">No email. Start in 2 minutes.</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={startOnboarding} className="px-5 py-2.5 rounded-full bg-white text-zinc-900 font-semibold hover:bg-zinc-100 transition text-sm">Start your arc</button>
                <a href="https://github.com/ashutosh887/winterarc/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 transition text-sm inline-flex items-center gap-1.5">Contribute <ExternalLink size={12} /></a>
              </div>
            </div>
            <div className="mt-3 text-center text-xs font-mono text-zinc-600">Feedback or feature idea? Open a PR via <a href="https://github.com/ashutosh887/winterarc/blob/main/CONTRIBUTING.md" className="underline decoration-zinc-700 hover:text-zinc-400">CONTRIBUTING.md</a> or DM <a href="https://x.com/ashutosh887_" target="_blank" rel="noreferrer" className="underline decoration-zinc-700 hover:text-zinc-400">@ashutosh887_</a> on X.</div>
          </section>
        </main>
      )}

      {view === 'resources' && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500"><Dumbbell size={12} /> Resources</div>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-white">Resources that help</h1>
          <p className="mt-1 text-sm text-zinc-500">Curated. No affiliates. Edit <code className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">src/config.ts</code> to add your own.</p>
          <div className="mt-8 grid gap-6">
            {Object.entries(resources).map(([key, cat]) => (
              <div key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-sm font-semibold text-white">{cat.title}</div>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {cat.items.map(it => (
                    <a key={it.name} href={it.url} target="_blank" rel="noreferrer" className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700 transition block group">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium text-white group-hover:text-zinc-200 transition">{it.name}</span><ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" /></div>
                      <div className="text-xs text-zinc-500 mt-1">{it.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-white flex items-center gap-2"><Star size={14} /> Daily quotes</h3><span className="text-xs font-mono text-zinc-500">Day {stats.dayNum || 1}</span></div>
            <p className="text-sm text-zinc-300 mt-2">"{quote.q}" <span className="text-zinc-500">- {quote.a}</span></p>
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {QUOTES.slice(0, 6).map((qq, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <div className="text-[11px] font-mono text-zinc-500">Day {i + 1}</div>
                  <div className="text-sm mt-1 text-zinc-300">"{qq.q}"</div>
                  <div className="text-xs text-zinc-500">- {qq.a}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs font-mono text-zinc-600 text-center">92 quotes. One per day.</div>
          </div>
        </main>
      )}

      {view === 'tracker' && !hasData && (
        <main className="max-w-[640px] mx-auto px-5 sm:px-6 py-16 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white grid place-items-center mx-auto"><ArrowRight size={18} /></div>
            <h2 className="mt-4 text-xl font-bold text-white">No arc yet</h2>
            <p className="mt-2 text-sm text-zinc-500">Start your arc to see the tracker. It takes 30 seconds.</p>
            <Button onClick={startOnboarding} className="mt-6">Start your arc <ArrowRight size={14} /></Button>
          </div>
        </main>
      )}

      {view === 'tracker' && hasData && (
        <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
          <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div variants={fadeUp} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-3">
              <Ring pct={Math.round((stats.dayNum / totalDays) * 100)} size={54}><span className="text-xs font-mono font-bold text-white">{stats.dayNum}/{totalDays}</span></Ring>
              <div><div className="text-[11px] font-mono tracking-widest text-zinc-400">Day</div><div className="text-sm text-zinc-300">{stats.remaining} left</div><div className="text-xs font-mono text-zinc-500">{start} → {end}</div></div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-3">
              <Ring pct={stats.streak ? Math.min(100, (stats.streak / 7) * 100) : 0} size={54}><span className="text-zinc-300"><Flame size={18} /></span></Ring>
              <div><div className="text-[11px] font-mono tracking-widest text-zinc-400">Streak</div><div className="text-lg font-black text-white">{stats.streak} <span className="text-xs font-mono text-zinc-500">best {stats.bestStreak}</span></div><div className="text-xs text-zinc-500">{stats.perfect} perfect ({stats.perfectPct}%)</div></div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-3">
              <Ring pct={stats.pct} size={54}><span className="text-xs font-bold text-sky-400">{stats.pct}%</span></Ring>
              <div><div className="text-[11px] font-mono tracking-widest text-zinc-400">Completion</div><div className="text-xs text-zinc-500">{stats.totalChecked}/{stats.totalPossible} checks</div><div className="w-20 h-1.5 bg-zinc-800 rounded-full mt-1"><div className="h-1.5 bg-sky-500 rounded-full transition-all" style={{ width: `${stats.pct}%` }} /></div></div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-center gap-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => shareToX()} className="py-2 rounded-full bg-white text-zinc-900 font-semibold text-xs hover:bg-zinc-100 transition">X Post</button>
                <button onClick={() => shareToWhatsApp()} className="py-2 rounded-full bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 transition">WhatsApp</button>
                <button onClick={() => downloadImage()} className="py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white text-xs hover:bg-zinc-700 transition">PNG</button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => nativeShare()} className="flex-1 py-1.5 rounded-full bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-700 hover:bg-zinc-700 transition">Share…</button>
                <button onClick={exportJSON} className="px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-700 hover:bg-zinc-700 transition">JSON</button>
                <button onClick={exportCSV} className="px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-700 hover:bg-zinc-700 transition">CSV</button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          </motion.div>

          <div className="mt-6 grid lg:grid-cols-[360px_1fr] gap-6">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 h-fit">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">Daily check-in</div>
                <Ring pct={dailyPct} size={44} stroke={3}><span className="text-[11px] font-mono font-bold text-sky-300">{dailyPct}%</span></Ring>
              </div>
              <div className="text-xs text-zinc-500 -mt-1">Pick any past date. Rings update live.</div>
              <input type="date" value={selectedDate} min={start} max={end} onChange={e => setSelectedDate(e.target.value)} className="mt-3 w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white" />
              <div className="mt-4 space-y-2">
                {effectiveHabits.map(h => {
                  const done = !!(entries[selectedDate] || {})[h.id]
                  return (
                    <label key={h.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition ${done ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                      <input type="checkbox" checked={done} onChange={() => toggleHabit(selectedDate, h.id)} className="accent-emerald-500 w-4 h-4" />
                      <span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300"><HabitIcon name={h.icon} size={14} /></span>
                      <span className={`text-sm flex-1 ${done ? 'text-emerald-200 line-through decoration-emerald-500/20' : 'text-zinc-200'}`}>{h.name}</span>
                      {done && <span className="text-emerald-400"><Check size={14} /></span>}
                    </label>
                  )
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono"><span className="text-zinc-400">{Object.keys(entries[selectedDate] || {}).length}/{effectiveHabits.length} done</span><span className={`${effectiveHabits.length && effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'text-emerald-400 inline-flex items-center gap-1' : 'text-zinc-500'}`}>{effectiveHabits.length && effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? <><Check size={12} /> Perfect day</> : 'keep going'}</span></div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { const e = entries[selectedDate] || {}; const allDone = effectiveHabits.every(h => e[h.id]); const next = {}; effectiveHabits.forEach(h => next[h.id] = !allDone ? true : false); setEntries(prev => ({ ...prev, [selectedDate]: !allDone ? next : {} })) }} className="flex-1 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium border border-zinc-700 transition">{effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'Clear day' : 'Mark all done'}</button>
                <button onClick={() => setSelectedDate(todayYMD())} className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-zinc-950 text-sm font-semibold transition">Today</button>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
              <div className="flex items-center justify-between"><div className="font-semibold text-white">92 day grid</div><div className="text-xs font-mono text-zinc-500">Missed stays visible · No restart</div></div>
              <div className="mt-4 grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                {allDates.map(d => {
                  const e = entries[d] || {}; const done = effectiveHabits.filter(h => e[h.id]).length; const perfect = effectiveHabits.length > 0 && done === effectiveHabits.length; const isToday = d === todayYMD(); const isSelected = d === selectedDate; const isFuture = d > todayYMD()
                  let bg = 'bg-zinc-800 border-zinc-700'
                  if (isFuture) bg = 'bg-zinc-900 border-zinc-800 opacity-40'
                  else if (perfect) bg = 'bg-white border-white'
                  else if (done > 0) bg = 'bg-zinc-300 border-zinc-300'
                  else if (d < todayYMD()) bg = 'bg-red-500/15 border-red-500/20'
                  return (<button key={d} onClick={() => setSelectedDate(d)} className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center transition hover:scale-[1.04] ${bg} ${isSelected ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-zinc-900' : ''}`} title={`${d} - ${done}/${effectiveHabits.length}`}><span className={`text-[10px] font-mono ${perfect ? 'text-zinc-900' : done > 0 ? 'text-zinc-900' : d < todayYMD() ? 'text-red-300' : 'text-zinc-500'}`}>{d.slice(8, 10)}</span><span className={`text-[9px] font-mono ${perfect ? 'text-zinc-700' : 'text-zinc-500'}`}>{done}/{effectiveHabits.length}</span>{isToday && <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-500 rounded-full border border-zinc-900" />}</button>)
                })}
              </div>
              <div className="mt-6">
                <div className="text-xs font-mono tracking-widest text-zinc-400">Habit rings</div>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {effectiveHabits.map(h => {
                    const hits = allDates.filter(d => (entries[d] || {})[h.id]).length
                    const pct = Math.round((hits / totalDays) * 100)
                    return (
                      <div key={h.id} className="rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 flex flex-col items-center gap-1.5 hover:border-zinc-700 transition">
                        <Ring pct={pct} size={56} stroke={4}><span className="text-zinc-200"><HabitIcon name={h.icon} size={16} /></span></Ring>
                        <div className="text-[11px] text-center leading-tight text-zinc-200 line-clamp-2">{h.name}</div>
                        <div className="text-[11px] font-mono text-sky-400">{pct}% · {hits}/{totalDays}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-center justify-between"><div className="font-semibold text-white">Achievements</div><div className="text-xs font-mono text-zinc-500">{achievements.filter(a => a.unlock).length}/{achievements.length} unlocked</div></div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {achievements.map(a => (
                <div key={a.id} className={`rounded-xl border p-3 flex flex-col gap-2 ${a.unlock ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full grid place-items-center border ${a.unlock ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><HabitIcon name={a.icon} size={13} /></span>
                    <span className={`text-xs font-semibold leading-tight ${a.unlock ? 'text-zinc-900' : 'text-zinc-400'}`}>{a.label}</span>
                  </div>
                  <div className={`text-[11px] leading-tight ${a.unlock ? 'text-zinc-600' : 'text-zinc-500'}`}>{a.desc}</div>
                  {a.unlock ? (
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => shareToX(a)} className="flex-1 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-semibold hover:bg-zinc-800 transition">X</button>
                      <button onClick={() => shareToWhatsApp(a)} className="flex-1 py-1 rounded-full bg-emerald-500 text-white text-[11px] hover:bg-emerald-600 transition">WA</button>
                      <button onClick={() => downloadImage(a)} className="px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] hover:bg-white transition">PNG</button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full"><Lock size={10} /> In progress</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-semibold text-white">Export & LLM prompt</div><div className="flex items-center gap-2"><button onClick={() => navigator.clipboard.writeText(llmPrompt)} className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-zinc-950 text-xs font-semibold transition">Copy prompt</button><button onClick={resetAll} className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/15 text-red-300 text-xs font-semibold hover:bg-red-500/15 transition">Reset</button></div></div>
            <div className="mt-3 rounded-xl bg-zinc-950 border border-zinc-800 p-3 overflow-auto"><pre className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap break-words font-mono">{llmPrompt}</pre></div>
            <div className="mt-2 text-xs text-zinc-500">Paste with exported JSON into your LLM. Data stays local until you paste.</div>
          </div>
        </main>
      )}

      {view === 'dashboard' && hasData && (
        <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center">
              <div className="text-xs font-mono tracking-widest text-zinc-400">Overall</div>
              <div className="mt-4 relative w-40 h-40">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#27272a" strokeWidth="10" /><circle cx="50" cy="50" r="44" fill="none" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${stats.pct * 2.76} 276`} /></svg>
                <div className="absolute inset-0 grid place-items-center"><div className="text-center"><div className="text-3xl font-black text-white">{stats.pct}%</div><div className="text-xs font-mono text-zinc-400">{stats.totalChecked}/{stats.totalPossible}</div></div></div>
              </div>
              <div className="mt-4 text-sm text-zinc-300">{stats.perfect} perfect of {totalDays} · {stats.perfectPct}%</div>
              <div className="mt-3 w-full grid grid-cols-2 gap-2">
                <button onClick={() => shareToX()} className="py-2 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition">Share X</button>
                <button onClick={() => downloadImage()} className="py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">Download PNG</button>
              </div>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
              <div className="text-xs font-mono tracking-widest text-zinc-400">Weekly</div>
              <div className="mt-4 space-y-2">
                {(() => { const weeks = []; for (let i = 0; i < allDates.length; i += 7)weeks.push(allDates.slice(i, i + 7)); return weeks.map((week, wi) => {
                  const perfectInWeek = week.filter(d => effectiveHabits.length && effectiveHabits.every(h => (entries[d] || {})[h.id])).length
                  const checks = week.reduce((acc, d) => acc + effectiveHabits.filter(h => (entries[d] || {})[h.id]).length, 0)
                  const pct = week.length * effectiveHabits.length ? Math.round((checks / (week.length * effectiveHabits.length)) * 100) : 0
                  return (<div key={wi} className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 flex items-center gap-3"><span className="text-xs font-mono text-zinc-500 w-14">W{wi + 1}</span><span className="text-xs text-zinc-400 flex-1">{week[0]?.slice(5)} → {week[week.length - 1]?.slice(5)}</span><span className="text-xs font-mono text-emerald-400">{perfectInWeek}/7</span><span className="text-xs font-mono text-sky-400 w-10 text-right">{pct}%</span></div>)
                }) })()}
              </div>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
              <div className="text-xs font-mono tracking-widest text-zinc-400">Today’s quote</div>
              <div className="mt-4 rounded-xl bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-sky-400 text-lg leading-none">“</div>
                <div className="text-sm text-zinc-200 italic">“{quote.q}”</div>
                <div className="text-xs font-mono text-zinc-500 mt-1">- {quote.a}</div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-zinc-400 flex items-center gap-1.5"><User size={12} /> Name</span>
                  <span className="flex items-center gap-1.5">
                    <input value={settings?.name ?? ''} onChange={e => setSettings(s => ({ ...s, name: e.target.value || null }))} placeholder="Add name" className="w-28 rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-1 text-xs text-white placeholder:text-zinc-500 text-right" />
                    <button onClick={() => setShowOnboarding(true)} className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"><Settings size={12} className="text-zinc-400" /></button>
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-zinc-400">Habits</span><span className="text-white font-mono">{effectiveHabits.length}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Range</span><span className="text-white font-mono text-xs">{start} → {end}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Best streak</span><span className="text-amber-400 font-mono">{stats.bestStreak}</span></div>
                <div className="pt-3 flex gap-2"><button onClick={exportJSON} className="flex-1 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">JSON</button><button onClick={exportCSV} className="flex-1 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">CSV</button></div>
                <button onClick={resetAll} className="w-full py-2 rounded-full bg-red-500/10 border border-red-500/15 text-red-300 text-sm hover:bg-red-500/15 transition">Reset</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="font-semibold text-white">All achievements</div>
            <div className="text-xs text-zinc-500 mt-1">Progress is live. Share any unlocked badge.</div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {achievements.map(a => (
                <div key={a.id} className={`rounded-xl border p-3 ${a.unlock ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800'}`}>
                  <div className="flex items-center gap-2"><span className={`w-8 h-8 rounded-full grid place-items-center border ${a.unlock ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><HabitIcon name={a.icon} size={14} /></span><span className={`text-sm font-semibold ${a.unlock ? 'text-zinc-900' : 'text-zinc-400'}`}>{a.label}</span>{a.unlock && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono">UNLOCKED</span>}</div>
                  <div className="text-xs text-zinc-500 mt-1">{a.desc}</div>
                  <div className="mt-2 flex gap-1.5">
                    <button disabled={!a.unlock} onClick={() => shareToX(a)} className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition ${a.unlock ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-800 text-zinc-500'}`}>X</button>
                    <button disabled={!a.unlock} onClick={() => shareToWhatsApp(a)} className={`flex-1 py-1.5 rounded-full text-xs transition ${a.unlock ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-zinc-800 text-zinc-500'}`}>WA</button>
                    <button disabled={!a.unlock} onClick={() => downloadImage(a)} className={`px-2 py-1.5 rounded-full border text-xs transition ${a.unlock ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-white' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>PNG</button>
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
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ type: 'spring', damping: 24, stiffness: 260 }} onClick={e => e.stopPropagation()} className="w-full max-w-[760px] max-h-[90dvh] overflow-y-auto overscroll-contain rounded-[24px] bg-zinc-900 border border-zinc-800 p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Logo size={26} /><span className="font-semibold tracking-[0.13em] text-sm text-white">Set up your arc</span> <span className="text-xs font-mono text-zinc-500">Step {onboardStep}/2</span></div><button onClick={() => setShowOnboarding(false)} aria-label="Close" className="w-8 h-8 grid place-items-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition"><X size={14} /></button></div>
            {onboardStep === 1 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-white">Set up your arc</h2>
                <p className="text-sm text-zinc-400 mt-1">Stored locally. No account.</p>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="arc-name" className="text-zinc-400">Your name</Label>
                    <Input id="arc-name" value={tmpName} onChange={e => setTmpName(e.target.value)} placeholder="Your name" autoFocus />
                    <div className="text-xs text-zinc-500">Leave blank and we'll say your arc. Example: Ashutosh</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label htmlFor="arc-start" className="text-zinc-400">Start</Label><Input id="arc-start" type="date" value={tmpStart} onChange={e => setTmpStart(e.target.value)} /></div>
                    <div className="space-y-1.5"><Label htmlFor="arc-end" className="text-zinc-400">End</Label><Input id="arc-end" type="date" value={tmpEnd} onChange={e => setTmpEnd(e.target.value)} /></div>
                  </div>
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 flex items-center justify-between"><span className="text-sm text-zinc-300">Duration</span><Badge variant="secondary">{daysBetween(tmpStart, tmpEnd)} days</Badge></div>
                </div>
                <div className="mt-6 flex justify-end"><Button onClick={() => setOnboardStep(2)}>Continue <ArrowRight size={14} /></Button></div>
              </div>
            )}
            {onboardStep === 2 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-white">Pick your habits</h2>
                <p className="text-sm text-zinc-400 mt-1">Choose 3–10. Three tiers.</p>
                <div className="mt-2 text-xs font-mono text-zinc-400">Selected {tmpSelected.size} {tmpSelected.size > 10 && '· over 10'}</div>
                {['non-neg', 'extra', 'aesthetic'].map(tier => (<div key={tier} className="mt-5"><div className="text-[11px] font-mono tracking-widest text-zinc-400">{TIER_LABELS[tier]}</div><div className="mt-2 grid sm:grid-cols-2 gap-2">{PRESETS.filter(p => p.tier === tier).map(p => { const sel = tmpSelected.has(p.id); return (<button key={p.id} onClick={() => setTmpSelected(s => { const n = new Set(s); sel ? n.delete(p.id) : n.add(p.id); return n })} className={`text-left rounded-xl border p-3 flex gap-3 items-start transition ${sel ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}><span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300 shrink-0"><HabitIcon name={p.icon} size={14} /></span><span className="flex-1 min-w-0"><span className={`text-sm font-medium block ${sel ? 'text-zinc-900' : 'text-zinc-200'}`}>{p.name}</span><span className="text-xs text-zinc-500">{p.desc}</span></span><span className={`mt-1 w-5 h-5 rounded-full grid place-items-center border text-xs shrink-0 ${sel ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-600 text-transparent'}`}><Check size={12} /></span></button>) })}</div></div>))}
                <div className="mt-6 rounded-xl bg-zinc-950 border border-zinc-800 p-3"><div className="text-xs font-mono tracking-widest text-zinc-400">Custom habit</div><div className="mt-2 flex gap-2"><Input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. No sugar, 3L water" onKeyDown={e => e.key === 'Enter' && addCustom()} /><Button variant="secondary" onClick={addCustom}>Add</Button></div>{customList.length > 0 && (<div className="mt-3 flex flex-wrap gap-2">{customList.map(c => (<Badge key={c.id} variant="secondary" className="gap-1.5">{c.name} <button onClick={() => { setCustomList(prev => prev.filter(x => x.id !== c.id)); setTmpSelected(s => { const n = new Set(s); n.delete(c.id); return n }) }} className="ml-1 hover:text-destructive"><X size={12} /></button></Badge>))}</div>)}</div>
                <div className="mt-6 flex items-center justify-between"><Button variant="outline" onClick={() => setOnboardStep(1)}>Back</Button><Button onClick={completeOnboarding}>Save arc · {tmpSelected.size} habits <ArrowRight size={14} /></Button></div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white text-zinc-900 grid place-items-center shadow-lg hover:bg-zinc-100 transition border border-white">
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="max-w-[1040px] mx-auto px-5 sm:px-6 py-6 border-t border-zinc-800 mt-8">
        <div className="text-center text-[11px] font-mono text-zinc-500">
          Open source WinterArc tracker — Oct 1 → Dec 31 (92 days, Jan 1 graduation). Local-first, PWA, no login.
        </div>
      </footer>
    </div>
  )
}
