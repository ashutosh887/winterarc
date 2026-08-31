import { useEffect, useMemo, useState, useRef } from 'react'

const DEFAULT_START = '2026-10-01'
const DEFAULT_END = '2026-12-31'

const TIER_LABELS = { 'non-neg': 'NON-NEGOTIABLES', extra: 'GOOD EXTRAS', aesthetic: 'WINTER ARC AESTHETIC', custom: 'CUSTOM' }

const PRESETS = [
  { id: 'gym', name: 'Gym / Train 45m', icon: '💪', tier: 'non-neg', desc: 'Minimum 30 min. Walk counts.' },
  { id: 'steps', name: '10k Steps', icon: '🚶', tier: 'non-neg', desc: 'Half before lunch.' },
  { id: 'sleep', name: 'Sleep 7.5h / In bed 22:30', icon: '😴', tier: 'non-neg', desc: 'No snoozing — up when alarm rings.' },
  { id: 'nutrition', name: 'No sugar & junk', icon: '🥗', tier: 'non-neg', desc: 'No / low sugar, no junk food.' },
  { id: 'protein', name: 'Protein target', icon: '🍳', tier: 'non-neg', desc: 'Track grams per day.' },
  { id: 'water', name: 'Water 2–3L', icon: '💧', tier: 'non-neg', desc: 'Spread through day.' },
  { id: 'work', name: 'Deep work 90m', icon: '🎯', tier: 'non-neg', desc: 'Before email, phone away.' },
  { id: 'no-alcohol', name: 'No alcohol', icon: '🚫', tier: 'non-neg', desc: 'Binary until Jan 1.' },
  { id: 'reading', name: 'Reading 10 pages', icon: '📚', tier: 'extra', desc: 'Non-fiction preferred.' },
  { id: 'meditation', name: 'Meditation 10m', icon: '🧘', tier: 'extra', desc: '5–15 min.' },
  { id: 'journaling', name: 'Journaling', icon: '📓', tier: 'extra', desc: 'Thoughts / gratitude.' },
  { id: 'sunlight', name: 'Morning sunlight', icon: '☀️', tier: 'extra', desc: 'Outside shortly after waking.' },
  { id: 'phone-am', name: 'No phone 60m AM', icon: '📵', tier: 'extra', desc: 'First 30–60 min.' },
  { id: 'phone-pm', name: 'No phone before bed', icon: '🌙', tier: 'extra', desc: 'Phone down by 21:00.' },
  { id: 'outside', name: 'Outside 20m', icon: '🌲', tier: 'extra', desc: 'Survives cold — indoor alt ok.' },
  { id: 'money', name: 'No unnecessary spend', icon: '💰', tier: 'extra', desc: 'Track spend / no-buy.' },
  { id: 'clean', name: 'Clean room/desk', icon: '🧹', tier: 'extra', desc: '2-min reset before bed.' },
  { id: 'cold', name: 'Cold shower', icon: '🚿', tier: 'aesthetic', desc: 'Discipline rep.' },
  { id: 'wake5', name: '5 AM wake', icon: '⏰', tier: 'aesthetic', desc: 'Fixed wake time daily.' },
  { id: 'pushups', name: '100 pushups', icon: '🔥', tier: 'aesthetic', desc: 'Challenge style.' },
]

const QUOTES = [
  { q: 'Discipline is choosing between what you want now and what you want most.', a: 'Abraham Lincoln' },
  { q: 'You do not rise to the level of your goals. You fall to the level of your systems.', a: 'James Clear' },
  { q: 'The winter will ask what you did all summer.', a: '—' },
  { q: 'Lock in while they coast. Unleash while they scramble.', a: 'Winter Arc' },
  { q: 'Small hinges swing big doors.', a: '—' },
  { q: 'Consistency is harder than intensity. Harder. And more powerful.', a: '—' },
  { q: 'No zero days. A little is still a lot.', a: '—' },
  { q: 'You are what you do when no one is clapping.', a: '—' },
  { q: '90 days of boring effort beats 3 days of heroic effort.', a: '—' },
  { q: 'The work you do in the dark puts you in the light.', a: '—' },
  { q: 'Motivation gets you going, but discipline keeps you growing.', a: 'John C. Maxwell' },
  { q: 'In the middle of difficulty lies opportunity.', a: 'Albert Einstein' },
  { q: 'First it hurts, then it becomes habit.', a: '—' },
  { q: 'Stay the course. January you will thank October you.', a: '—' },
  { q: 'Build body. Build career. Fix sleep. Kill bad habits.', a: 'Winter Arc' },
]

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }, [key, val])
  return [val, setVal]
}
function ymd(d) { return d.toISOString().slice(0, 10) }
function parseYMD(s) { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd) }
function daysBetween(a, b) { return Math.round((parseYMD(b) - parseYMD(a)) / 86400000) + 1 }
function addDays(s, n) { const d = parseYMD(s); d.setDate(d.getDate() + n); return ymd(d) }
function todayYMD() { return ymd(new Date()) }

function Ring({ pct, size = 44, stroke = 4, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#38bdf8" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${c}`} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#e0f2fe" /></linearGradient></defs>
      <circle cx="32" cy="32" r="30" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.3" />
      <path d="M12 44 L26 18 L32 30 L38 22 L52 44 Z" fill="none" stroke="url(#g)" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="32" cy="26" r="3.2" fill="#e0f2fe" />
      <path d="M28 34 C28 31 30 29 32 29 C34 29 36 31 36 34 L33.5 38 L30.5 38 Z" fill="#e0f2fe" opacity="0.95" />
      <path d="M26 38 Q32 42 38 38" stroke="#38bdf8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function App() {
  const [settings, setSettings] = useLocalStorage('wa_settings_v2', null)
  // migrate old keys if present
  const [habits, setHabits] = useLocalStorage('wa_habits', [])
  const [habitsV2, setHabitsV2] = useLocalStorage('wa_habits_v2', null)
  const [entries, setEntries] = useLocalStorage('wa_entries', {})
  const [view, setView] = useState('tracker')
  const [selectedDate, setSelectedDate] = useState(todayYMD())
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardStep, setOnboardStep] = useState(1)
  const [tmpStart, setTmpStart] = useState(DEFAULT_START)
  const [tmpEnd, setTmpEnd] = useState(DEFAULT_END)
  const [tmpSelected, setTmpSelected] = useState(new Set())
  const [customName, setCustomName] = useState('')
  const [customList, setCustomList] = useState([])
  const canvasRef = useRef(null)

  // handle migration: if old settings exists
  useEffect(() => {
    const old = localStorage.getItem('wa_settings')
    if (old && !settings) {
      try { setSettings(JSON.parse(old)); localStorage.removeItem('wa_settings') } catch {}
    }
    const oldH = localStorage.getItem('wa_habits')
    if (oldH && habitsV2 === null) {
      try { const h = JSON.parse(oldH); if (h.length) setHabitsV2(h) } catch {}
    }
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
      { id: 'first', label: 'First Check', icon: '✅', desc: 'Log your first habit', unlock: stats.totalChecked >= 1 },
      { id: 'perfect1', label: 'Perfect Day', icon: '⭐', desc: '1 perfect day', unlock: stats.perfect >= 1 },
      { id: 'streak3', label: '3-Day Streak', icon: '🔥', desc: '3 perfect days in a row', unlock: stats.bestStreak >= 3 },
      { id: 'streak7', label: 'Week Warrior', icon: '🏔️', desc: '7-day streak', unlock: stats.bestStreak >= 7 },
      { id: 'streak14', label: 'Fortnight', icon: '❄️', desc: '14-day streak', unlock: stats.bestStreak >= 14 },
      { id: 'streak30', label: '30 Days Locked', icon: '🧊', desc: '30-day streak', unlock: stats.bestStreak >= 30 },
      { id: 'half', label: 'Halfway', icon: '⏳', desc: 'Reach 50% completion', unlock: stats.pct >= 50 },
      { id: 'perfect10', label: '10 Perfect', icon: '💎', desc: '10 perfect days', unlock: stats.perfect >= 10 },
      { id: 'perfect30', label: '30 Perfect', icon: '👑', desc: '30 perfect days', unlock: stats.perfect >= 30 },
      { id: 'complete75', label: '75% Done', icon: '🚀', desc: '75% habits checked', unlock: stats.pct >= 75 },
      { id: 'finish', label: 'Graduation', icon: '🎓', desc: '92/92 perfect — Jan 1', unlock: stats.perfect >= totalDays },
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
    setTmpStart(settings?.start ?? DEFAULT_START)
    setTmpEnd(settings?.end ?? DEFAULT_END)
    setTmpSelected(new Set(effectiveHabits.map(h => h.id)))
    setCustomList(effectiveHabits.filter(h => h.tier === 'custom'))
    setOnboardStep(1); setShowOnboarding(true)
  }
  function completeOnboarding() {
    const chosen = [...PRESETS.filter(p => tmpSelected.has(p.id)), ...customList]
    if (!chosen.length) { alert('Pick at least 1 habit (recommended 3–5)'); return }
    if (chosen.length > 10 && !confirm(`You picked ${chosen.length} habits. Recommended max is 10 — continue?`)) return
    setSettings({ start: tmpStart, end: tmpEnd })
    setHabitsV2(chosen); setHabits(chosen)
    setShowOnboarding(false); setView('tracker'); setSelectedDate(tmpStart)
  }
  function addCustom() {
    if (!customName.trim()) return
    const id = 'custom_' + Date.now()
    setCustomList(prev => [...prev, { id, name: customName.trim(), icon: '✦', tier: 'custom', desc: 'Custom' }])
    setTmpSelected(s => new Set([...s, id])); setCustomName('')
  }
  function exportJSON() {
    const data = { settings: { start, end }, habits: effectiveHabits, entries, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `winter-arc-${start}_${end}.json`; a.click(); URL.revokeObjectURL(url)
  }
  function exportCSV() {
    const header = ['date', ...effectiveHabits.map(h => `"${h.name}"`), 'perfect']
    const rows = allDates.map(d => {
      const e = entries[d] || {}
      const vals = effectiveHabits.map(h => e[h.id] ? '1' : '0')
      const perfect = effectiveHabits.length && effectiveHabits.every(h => e[h.id]) ? '1' : '0'
      return [d, ...vals, perfect].join(',')
    })
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `winter-arc-${start}_${end}.csv`; a.click(); URL.revokeObjectURL(url)
  }
  const llmPrompt = `Analyze my Winter Arc data (Oct 1 → Dec 31). Habits: ${effectiveHabits.map(h => h.name).join(', ')}. Total days: ${totalDays}. Perfect days: ${stats.perfect}/${totalDays} (${stats.perfectPct}%). Completion: ${stats.pct}%. Streak: ${stats.streak}, best: ${stats.bestStreak}. Entries: ${JSON.stringify(entries).slice(0, 4000)} ... Give: 1) patterns, 2) weekly trend, 3) 3 fixes for next 7 days, 4) motivational summary. Concise.`

  function drawShareCard({ achievement } = {}) {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 1200; canvas.height = 675
    const g = ctx.createLinearGradient(0, 0, 1200, 675); g.addColorStop(0, '#020617'); g.addColorStop(1, '#0f172a')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1200, 675)
    ctx.fillStyle = 'rgba(56,189,248,0.08)'; for (let i = 0; i < 80; i++) { ctx.beginPath(); ctx.arc(Math.random() * 1200, Math.random() * 675, Math.random() * 1.8, 0, Math.PI * 2); ctx.fill() }
    ctx.fillStyle = '#e0f2fe'; ctx.font = '700 36px ui-sans-serif,system-ui'
    ctx.fillText('TRYWINTERARC ❄️  —  Lock in while they coast.', 60, 80)
    if (achievement) {
      ctx.font = '700 68px ui-sans-serif,system-ui'; ctx.fillStyle = '#38bdf8'; ctx.fillText(`${achievement.icon}  ${achievement.label}`, 60, 190)
      ctx.font = '400 24px ui-sans-serif,system-ui'; ctx.fillStyle = '#cbd5e1'; ctx.fillText(achievement.desc, 60, 230)
      ctx.font = '400 22px ui-sans-serif,system-ui'; ctx.fillStyle = '#94a3b8'; ctx.fillText(`Day ${stats.dayNum}/${totalDays} • ${stats.perfect} perfect • ${stats.pct}% • streak ${stats.streak}🔥`, 60, 280)
    } else {
      ctx.font = '700 64px ui-sans-serif,system-ui'; ctx.fillStyle = '#38bdf8'; ctx.fillText(`Day ${stats.dayNum} / ${totalDays}`, 60, 180)
      ctx.font = '400 26px ui-sans-serif,system-ui'; ctx.fillStyle = '#cbd5e1'; ctx.fillText(`${stats.perfect} perfect days • ${stats.pct}% completion • streak ${stats.streak}🔥`, 60, 225)
      ctx.font = '500 18px ui-monospace,monospace'; ctx.fillStyle = '#94a3b8'; ctx.fillText(effectiveHabits.map(h => `${h.icon} ${h.name}`).join('  •  ').slice(0, 100), 60, 270)
    }
    ctx.fillStyle = '#1e293b'; ctx.fillRect(60, 330, 1080, 18); ctx.fillStyle = '#38bdf8'; ctx.fillRect(60, 330, 1080 * (stats.pct / 100), 18)
    ctx.fillStyle = '#e2e8f0'; ctx.font = '600 16px ui-monospace,monospace'; ctx.fillText(`${stats.pct}%`, 60 + 1080 * (stats.pct / 100) - 36, 322)
    // quote
    ctx.fillStyle = '#cbd5e1'; ctx.font = 'italic 20px ui-sans-serif,system-ui'; const q = achievement ? `"${quote.q}" — ${quote.a}` : `"${quote.q}"`; ctx.fillText(q.slice(0, 82), 60, 400)
    ctx.fillStyle = '#64748b'; ctx.font = '500 18px ui-sans-serif,system-ui'; ctx.fillText('Disappear for 90 days. Come back unrecognizable.', 60, 500)
    ctx.fillStyle = '#475569'; ctx.font = '500 14px ui-sans-serif,system-ui'; ctx.fillText('trywinterarc.app • 100% local • no login • open source', 60, 625)
    return canvas.toDataURL('image/png')
  }
  function downloadImage(achievement) {
    const url = drawShareCard({ achievement }); const a = document.createElement('a'); a.href = url; a.download = achievement ? `winter-arc-${achievement.id}.png` : `winter-arc-day${stats.dayNum}.png`; a.click()
  }
  function shareToX(achievement) {
    const text = achievement
      ? `${achievement.icon} ${achievement.label} — Day ${stats.dayNum}/${totalDays} • ${stats.pct}% • streak ${stats.streak}🔥\nLock in while they coast. ❄️\n`
      : `Day ${stats.dayNum}/${totalDays} • ${stats.perfect} perfect • ${stats.pct}% • streak ${stats.streak}🔥\nDisappear for 90 days. Come back unrecognizable. ❄️\n`
    const url = 'https://trywinterarc.app'
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
  }
  function shareToWhatsApp(achievement) {
    const text = achievement
      ? `${achievement.icon} ${achievement.label} unlocked! Day ${stats.dayNum}/${totalDays} • ${stats.pct}% • streak ${stats.streak} — trywinterarc.app`
      : `Winter Arc Day ${stats.dayNum}/${totalDays}: ${stats.pct}% • streak ${stats.streak}🔥 — trywinterarc.app — Lock in while they coast.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
  async function nativeShare(achievement) {
    const text = achievement ? `${achievement.label}: ${achievement.desc}` : `Day ${stats.dayNum}/${totalDays} • ${stats.pct}%`
    if (navigator.share) {
      try { await navigator.share({ title: 'TryWinterArc', text, url: location.href }) } catch {}
    } else {
      shareToX(achievement)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 backdrop-blur bg-[#020617]/80 border-b border-slate-800">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(hasData ? 'tracker' : 'landing')}>
            <Logo size={34} />
            <div className="leading-none">
              <div className="font-black tracking-[0.18em] text-[13px] text-white">TRYWINTERARC</div>
              <div className="text-[11px] tracking-wide text-slate-400 font-mono">{hasData ? `${start} → ${end} • ${totalDays}d` : 'Oct 1 → Dec 31 • 92 days'}</div>
            </div>
            <span className="hidden md:inline ml-2 text-[10px] px-2 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">PWA • LOCAL ONLY • OSS</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2">
            {hasData && (<>
              <button onClick={() => setView('tracker')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${view === 'tracker' ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}>Tracker</button>
              <button onClick={() => setView('dashboard')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${view === 'dashboard' ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}>Dashboard</button>
            </>)}
            <button onClick={startOnboarding} className="ml-1 px-3.5 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm">{hasData ? 'Edit Arc' : 'Start your arc'}</button>
          </nav>
        </div>
      </header>

      {/* quote bar */}
      {hasData && (
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-3">
          <div className="rounded-full bg-slate-900 border border-slate-800 px-4 py-2 flex items-center gap-3 overflow-hidden">
            <span className="text-sky-400">❝</span>
            <span className="text-sm text-slate-300 truncate">“{quote.q}”</span>
            <span className="hidden sm:inline text-xs font-mono text-slate-500 whitespace-nowrap">— {quote.a}</span>
            <span className="ml-auto hidden sm:inline text-[11px] font-mono text-slate-500">Day {stats.dayNum}</span>
          </div>
        </div>
      )}

      {view === 'landing' && (
        <main>
          <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">❄️ WINTER ARC 2026 • 92 DAYS • NO EXCUSES</div>
            <h1 className="mt-6 font-black tracking-tight leading-[0.9] text-[42px] sm:text-[64px] lg:text-[78px]">
              <span className="block text-white">Disappear for</span>
              <span className="block text-sky-400">90 days.</span>
              <span className="block text-white">Come back</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-200">unrecognizable.</span>
            </h1>
            <p className="mt-3 text-lg font-medium text-sky-300">Lock in while they coast.</p>
            <p className="mt-4 max-w-[640px] mx-auto text-slate-400 leading-relaxed">Oct 1 → Dec 31: a 90-day lock-in where you track fitness, nutrition, sleep, work/learning, screen time, bad habits, reading, mindfulness & daily discipline. No login. 100% local. Install as PWA. Export to LLMs.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={startOnboarding} className="px-7 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold">Start your arc →</button>
              <button onClick={() => { if (!hasData) startOnboarding(); else setView('tracker') }} className="px-7 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700">View demo tracker</button>
            </div>
            <div className="mt-4 text-xs font-mono text-slate-500">Free & open source • Offline • trywinterarc.app • Data never leaves your device</div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <div className="text-xs font-mono tracking-widest text-emerald-400">NON-NEGOTIABLES</div>
                <div className="text-sm text-slate-400 mt-1">Things that change your life</div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-200"><li>💪 Gym • 🚶 Steps • 😴 Sleep</li><li>🥗 No sugar/junk • 🍳 Protein</li><li>💧 Water • 🎯 Deep work • 🚫 Bad habits</li></ul>
              </div>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <div className="text-xs font-mono tracking-widest text-sky-400">GOOD EXTRAS</div>
                <div className="text-sm text-slate-400 mt-1">High leverage adds</div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-200"><li>📚 Reading • 🧘 Meditation</li><li>📓 Journaling • ☀️ Morning sunlight</li><li>📵 Phone limits • 🌙 No phone before bed</li></ul>
              </div>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 opacity-80">
                <div className="text-xs font-mono tracking-widest text-slate-400">AESTHETIC STUFF</div>
                <div className="text-sm text-slate-400 mt-1">Optional</div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-200"><li>🚿 Cold showers • ⏰ 5 AM wake</li><li>🔥 100 pushups</li></ul>
                <div className="mt-3 text-xs text-amber-300/80">You don’t need this tier to win.</div>
              </div>
            </div>
            <div className="mt-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 text-left">
              <div className="font-semibold text-white">How it works</div>
              <ol className="mt-3 grid sm:grid-cols-3 gap-4 text-sm text-slate-300 list-decimal list-inside"><li>Pick 3–10 habits (cap 10)</li><li>Check daily — backfill past days</li><li>Share achievements on X / WhatsApp / Image</li></ol>
            </div>
          </section>
          <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pb-16">
            <div className="rounded-[20px] border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
              <div className="flex items-center justify-between"><div className="font-mono text-xs text-slate-400">PREVIEW • Oct 1–7</div><div className="text-xs text-slate-500">Backfill enabled</div></div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => (<div key={i} className={`rounded-xl border p-3 ${i < 4 ? 'bg-emerald-500/10 border-emerald-500/20' : i === 4 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-800 border-slate-700'}`}><div className="text-xs font-mono text-slate-400">Oct {i + 1}</div><div className={`mt-2 h-2 rounded ${i < 4 ? 'bg-emerald-500' : i === 4 ? 'bg-amber-500' : 'bg-slate-600'}`} /><div className="mt-2 text-[11px] font-semibold text-white">{i < 4 ? 'PERFECT' : i === 4 ? '6/8' : '—'}</div></div>))}
              </div>
            </div>
          </section>
        </main>
      )}

      {view === 'tracker' && hasData && (
        <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-3">
              <Ring pct={Math.round((stats.dayNum / totalDays) * 100)} size={54}><span className="text-xs font-mono font-bold text-white">{stats.dayNum}/{totalDays}</span></Ring>
              <div><div className="text-[11px] font-mono tracking-widest text-slate-400">DAY</div><div className="text-sm text-slate-300">{stats.remaining} left • Jan 1 🎓</div></div>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-3">
              <Ring pct={stats.streak ? Math.min(100, (stats.streak / 7) * 100) : 0} size={54}><span className="text-lg">🔥</span></Ring>
              <div><div className="text-[11px] font-mono tracking-widest text-slate-400">STREAK</div><div className="text-lg font-black text-white">{stats.streak} <span className="text-xs font-mono text-slate-500">best {stats.bestStreak}</span></div><div className="text-xs text-slate-500">{stats.perfect} perfect ({stats.perfectPct}%)</div></div>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center gap-3">
              <Ring pct={stats.pct} size={54}><span className="text-xs font-bold text-sky-400">{stats.pct}%</span></Ring>
              <div><div className="text-[11px] font-mono tracking-widest text-slate-400">COMPLETION</div><div className="text-xs text-slate-500">{stats.totalChecked}/{stats.totalPossible} checks</div><div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1"><div className="h-1.5 bg-sky-500 rounded-full" style={{ width: `${stats.pct}%` }} /></div></div>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-center gap-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => shareToX()} className="py-2 rounded-full bg-white text-slate-900 font-semibold text-xs">𝕏 Post</button>
                <button onClick={() => shareToWhatsApp()} className="py-2 rounded-full bg-emerald-500 text-white font-semibold text-xs">WhatsApp</button>
                <button onClick={() => downloadImage()} className="py-2 rounded-full bg-slate-800 border border-slate-700 text-white text-xs">PNG</button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => nativeShare()} className="flex-1 py-1.5 rounded-full bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">Share…</button>
                <button onClick={exportJSON} className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">JSON</button>
                <button onClick={exportCSV} className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">CSV</button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="mt-6 grid lg:grid-cols-[360px_1fr] gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 h-fit">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">Daily check-in</div>
                <Ring pct={dailyPct} size={44} stroke={3}><span className="text-[11px] font-mono font-bold text-sky-300">{dailyPct}%</span></Ring>
              </div>
              <div className="text-xs text-slate-500 -mt-1">Backfill: pick any past date. Rings update live.</div>
              <input type="date" value={selectedDate} min={start} max={end} onChange={e => setSelectedDate(e.target.value)} className="mt-3 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white" />
              <div className="mt-4 space-y-2">
                {effectiveHabits.map(h => {
                  const done = !!(entries[selectedDate] || {})[h.id]
                  return (
                    <label key={h.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition ${done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                      <input type="checkbox" checked={done} onChange={() => toggleHabit(selectedDate, h.id)} className="accent-emerald-500 w-4 h-4" />
                      <span className="text-lg leading-none">{h.icon}</span>
                      <span className={`text-sm flex-1 ${done ? 'text-emerald-200 line-through decoration-emerald-500/30' : 'text-slate-200'}`}>{h.name}</span>
                      {done && <span className="text-xs font-mono text-emerald-400">✓</span>}
                    </label>
                  )
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono"><span className="text-slate-400">{Object.keys(entries[selectedDate] || {}).length}/{effectiveHabits.length} done</span><span className={`${effectiveHabits.length && effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'text-emerald-400' : 'text-slate-500'}`}>{effectiveHabits.length && effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'PERFECT DAY ✓' : 'keep going'}</span></div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { const e = entries[selectedDate] || {}; const allDone = effectiveHabits.every(h => e[h.id]); const next = {}; effectiveHabits.forEach(h => next[h.id] = !allDone ? true : false); setEntries(prev => ({ ...prev, [selectedDate]: !allDone ? next : {} })) }} className="flex-1 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700">{effectiveHabits.every(h => (entries[selectedDate] || {})[h.id]) ? 'Clear day' : 'Mark all done'}</button>
                <button onClick={() => setSelectedDate(todayYMD())} className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold">Today</button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center justify-between"><div className="font-semibold text-white">92-day grid</div><div className="text-xs font-mono text-slate-400">Missed stays red — no restart</div></div>
              <div className="mt-4 grid grid-cols-7 sm:grid-cols-14 lg:grid-cols-14 gap-1.5">
                {allDates.map(d => {
                  const e = entries[d] || {}; const done = effectiveHabits.filter(h => e[h.id]).length; const perfect = effectiveHabits.length > 0 && done === effectiveHabits.length; const isToday = d === todayYMD(); const isSelected = d === selectedDate; const isFuture = d > todayYMD()
                  let bg = 'bg-slate-800 border-slate-700'
                  if (isFuture) bg = 'bg-slate-900 border-slate-800 opacity-50'
                  else if (perfect) bg = 'bg-emerald-500 border-emerald-400'
                  else if (done > 0) bg = 'bg-amber-500/80 border-amber-400/50'
                  else if (d < todayYMD()) bg = 'bg-red-500/20 border-red-500/30'
                  return (<button key={d} onClick={() => setSelectedDate(d)} className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center transition hover:scale-[1.03] ${bg} ${isSelected ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''}`} title={`${d} — ${done}/${effectiveHabits.length}`}><span className={`text-[10px] font-mono ${perfect ? 'text-white' : done > 0 ? 'text-slate-950' : d < todayYMD() ? 'text-red-300' : 'text-slate-400'}`}>{d.slice(8, 10)}</span><span className={`text-[9px] font-mono ${perfect ? 'text-white/90' : 'text-slate-500'}`}>{done}/{effectiveHabits.length}</span>{isToday && <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full" />}</button>)
                })}
              </div>
              <div className="mt-6">
                <div className="text-xs font-mono tracking-widest text-slate-400">HABIT RINGS</div>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {effectiveHabits.map(h => {
                    const hits = allDates.filter(d => (entries[d] || {})[h.id]).length
                    const pct = Math.round((hits / totalDays) * 100)
                    return (
                      <div key={h.id} className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 flex flex-col items-center gap-1.5">
                        <Ring pct={pct} size={56} stroke={4}><span className="text-sm">{h.icon}</span></Ring>
                        <div className="text-[11px] text-center leading-tight text-slate-200 line-clamp-2">{h.name}</div>
                        <div className="text-[11px] font-mono text-sky-400">{pct}% • {hits}/{totalDays}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* achievements preview in tracker */}
          <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between"><div className="font-semibold text-white">Achievements</div><div className="text-xs font-mono text-slate-400">{achievements.filter(a => a.unlock).length}/{achievements.length} unlocked</div></div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {achievements.map(a => (
                <div key={a.id} className={`rounded-xl border p-3 flex flex-col gap-2 ${a.unlock ? 'bg-sky-500/10 border-sky-500/30' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <div className="text-lg">{a.icon} <span className={`text-xs font-semibold ${a.unlock ? 'text-white' : 'text-slate-400'}`}>{a.label}</span></div>
                  <div className="text-[11px] text-slate-400 leading-tight">{a.desc}</div>
                  {a.unlock && <div className="flex gap-1"><button onClick={() => shareToX(a)} className="flex-1 py-1 rounded-full bg-white text-slate-900 text-[11px] font-semibold">𝕏</button><button onClick={() => shareToWhatsApp(a)} className="flex-1 py-1 rounded-full bg-emerald-500 text-white text-[11px]">WA</button><button onClick={() => downloadImage(a)} className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-white text-[11px]">PNG</button></div>}
                  {!a.unlock && <span className="text-[11px] font-mono text-slate-500">locked</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between gap-2"><div className="font-semibold text-white">Export & LLM prompt</div><button onClick={() => navigator.clipboard.writeText(llmPrompt)} className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold">Copy prompt</button></div>
            <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-auto"><pre className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap break-words font-mono">{llmPrompt}</pre></div>
            <div className="mt-2 text-xs text-slate-500">Paste with exported JSON into ChatGPT/Claude. Data never leaves device until you paste.</div>
          </div>
        </main>
      )}

      {view === 'dashboard' && hasData && (
        <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center">
              <div className="text-xs font-mono tracking-widest text-slate-400">OVERALL</div>
              <div className="mt-4 relative w-40 h-40">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="10" /><circle cx="50" cy="50" r="44" fill="none" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${stats.pct * 2.76} 276`} /></svg>
                <div className="absolute inset-0 grid place-items-center"><div className="text-center"><div className="text-3xl font-black text-white">{stats.pct}%</div><div className="text-xs font-mono text-slate-400">{stats.totalChecked}/{stats.totalPossible}</div></div></div>
              </div>
              <div className="mt-4 text-sm text-slate-300">{stats.perfect} perfect of {totalDays} • {stats.perfectPct}%</div>
              <div className="mt-3 w-full grid grid-cols-2 gap-2">
                <button onClick={() => shareToX()} className="py-2 rounded-full bg-white text-slate-900 text-sm font-semibold">Share 𝕏</button>
                <button onClick={() => downloadImage()} className="py-2 rounded-full bg-slate-800 border border-slate-700 text-white text-sm">Download PNG</button>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="text-xs font-mono tracking-widest text-slate-400">WEEKLY</div>
              <div className="mt-4 space-y-2">
                {(() => { const weeks = []; for (let i = 0; i < allDates.length; i += 7)weeks.push(allDates.slice(i, i + 7)); return weeks.map((week, wi) => {
                  const perfectInWeek = week.filter(d => effectiveHabits.length && effectiveHabits.every(h => (entries[d] || {})[h.id])).length
                  const checks = week.reduce((acc, d) => acc + effectiveHabits.filter(h => (entries[d] || {})[h.id]).length, 0)
                  const pct = week.length * effectiveHabits.length ? Math.round((checks / (week.length * effectiveHabits.length)) * 100) : 0
                  return (<div key={wi} className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 flex items-center gap-3"><span className="text-xs font-mono text-slate-500 w-14">W{wi + 1}</span><span className="text-xs text-slate-400 flex-1">{week[0]?.slice(5)} → {week[week.length - 1]?.slice(5)}</span><span className="text-xs font-mono text-emerald-400">{perfectInWeek}/7</span><span className="text-xs font-mono text-sky-400 w-10 text-right">{pct}%</span></div>)
                }) })()}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="text-xs font-mono tracking-widest text-slate-400">QUOTE OF THE DAY</div>
              <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-4">
                <div className="text-sky-400 text-lg">❝</div>
                <div className="text-sm text-slate-200 italic">“{quote.q}”</div>
                <div className="text-xs font-mono text-slate-500 mt-1">— {quote.a}</div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Habits</span><span className="text-white font-mono">{effectiveHabits.length}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Range</span><span className="text-white font-mono text-xs">{start} → {end}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Best streak</span><span className="text-amber-400 font-mono">{stats.bestStreak} 🔥</span></div>
                <div className="pt-3 flex gap-2"><button onClick={exportJSON} className="flex-1 py-2 rounded-full bg-slate-800 border border-slate-700 text-white text-sm">JSON</button><button onClick={exportCSV} className="flex-1 py-2 rounded-full bg-slate-800 border border-slate-700 text-white text-sm">CSV</button></div>
                <button onClick={() => { if (confirm('Reset all data?')) { localStorage.clear(); location.reload() } }} className="w-full py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm">Reset</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="font-semibold text-white">All achievements — shareable</div>
            <div className="text-xs text-slate-500 mt-1">Static for everyone — same streak milestones. Post any unlocked badge to X / WhatsApp / PNG.</div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {achievements.map(a => (
                <div key={a.id} className={`rounded-xl border p-3 ${a.unlock ? 'bg-sky-500/10 border-sky-500/30' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                  <div className="flex items-center gap-2"><span className="text-xl">{a.icon}</span><span className={`text-sm font-semibold ${a.unlock ? 'text-white' : 'text-slate-400'}`}>{a.label}</span>{a.unlock && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono">UNLOCKED</span>}</div>
                  <div className="text-xs text-slate-400 mt-1">{a.desc}</div>
                  <div className="mt-2 flex gap-1.5">
                    <button disabled={!a.unlock} onClick={() => shareToX(a)} className={`flex-1 py-1.5 rounded-full text-xs font-semibold ${a.unlock ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500'}`}>𝕏</button>
                    <button disabled={!a.unlock} onClick={() => shareToWhatsApp(a)} className={`flex-1 py-1.5 rounded-full text-xs ${a.unlock ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>WhatsApp</button>
                    <button disabled={!a.unlock} onClick={() => downloadImage(a)} className={`px-2 py-1.5 rounded-full border text-xs ${a.unlock ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>PNG</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-sky-500/10 border border-sky-500/20 p-4">
            <div className="font-semibold text-sky-200">Tip</div>
            <p className="text-sm text-sky-200/80 mt-1">Data is local only. Install as PWA. Export weekly. Backfill honestly. Open source — star on GitHub.</p>
          </div>
        </main>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-slate-950/70 backdrop-blur">
          <div className="w-full max-w-[760px] max-h-[90vh] overflow-auto rounded-[20px] bg-slate-900 border border-slate-800 p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Logo size={28} /><span className="font-black tracking-widest text-sm text-white">SET UP YOUR ARC</span> <span className="text-xs font-mono text-slate-500">Step {onboardStep}/2</span></div><button onClick={() => setShowOnboarding(false)} className="w-8 h-8 grid place-items-center rounded-full bg-slate-800 text-slate-400">✕</button></div>
            {onboardStep === 1 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-white">When is your Winter Arc?</h2>
                <p className="text-sm text-slate-400 mt-1">Defaults Oct 1 → Dec 31 (92 days). Adjust if late — finish stays Dec 31. Jan 1 graduation.</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4"><label className="space-y-1"><span className="text-xs font-mono text-slate-400">START</span><input type="date" value={tmpStart} onChange={e => setTmpStart(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white" /></label><label className="space-y-1"><span className="text-xs font-mono text-slate-400">END</span><input type="date" value={tmpEnd} onChange={e => setTmpEnd(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-white" /></label></div>
                <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 flex items-center justify-between"><span className="text-sm text-slate-300">Duration</span><span className="font-mono text-sky-400">{daysBetween(tmpStart, tmpEnd)} days</span></div>
                <div className="mt-6 flex justify-end"><button onClick={() => setOnboardStep(2)} className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold">Next — pick habits →</button></div>
              </div>
            )}
            {onboardStep === 2 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-white">Pick your habits</h2>
                <p className="text-sm text-slate-400 mt-1">Choose 3–10 max. Shown in 3 tiers.</p>
                <div className="mt-2 text-xs font-mono text-amber-300">Selected: {tmpSelected.size} {tmpSelected.size > 10 && '⚠ over 10'}</div>
                {['non-neg', 'extra', 'aesthetic'].map(tier => (<div key={tier} className="mt-5"><div className="text-[11px] font-mono tracking-widest text-slate-400">{TIER_LABELS[tier]}</div><div className="mt-2 grid sm:grid-cols-2 gap-2">{PRESETS.filter(p => p.tier === tier).map(p => { const sel = tmpSelected.has(p.id); return (<button key={p.id} onClick={() => setTmpSelected(s => { const n = new Set(s); sel ? n.delete(p.id) : n.add(p.id); return n })} className={`text-left rounded-xl border p-3 flex gap-3 items-start transition ${sel ? 'bg-sky-500/15 border-sky-500/40' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}><span className="text-lg">{p.icon}</span><span className="flex-1"><span className={`text-sm font-medium block ${sel ? 'text-white' : 'text-slate-200'}`}>{p.name}</span><span className="text-xs text-slate-500">{p.desc}</span></span><span className={`mt-1 w-5 h-5 rounded-full grid place-items-center border text-xs ${sel ? 'bg-sky-500 border-sky-500 text-slate-950' : 'border-slate-600 text-transparent'}`}>✓</span></button>) })}</div></div>))}
                <div className="mt-6 rounded-xl bg-slate-950 border border-slate-800 p-3"><div className="text-xs font-mono tracking-widest text-slate-400">CUSTOM HABIT</div><div className="mt-2 flex gap-2"><input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g., No sugar, 3L water" className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500" onKeyDown={e => e.key === 'Enter' && addCustom()} /><button onClick={addCustom} className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700">Add</button></div>{customList.length > 0 && (<div className="mt-3 flex flex-wrap gap-2">{customList.map(c => (<span key={c.id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sm text-sky-200">{c.name} <button onClick={() => { setCustomList(prev => prev.filter(x => x.id !== c.id)); setTmpSelected(s => { const n = new Set(s); n.delete(c.id); return n }) }} className="text-sky-300">✕</button></span>))}</div>)}</div>
                <div className="mt-6 flex items-center justify-between"><button onClick={() => setOnboardStep(1)} className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">← Back</button><button onClick={completeOnboarding} className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold">Save Arc • {tmpSelected.size} habits</button></div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 text-center text-xs font-mono text-slate-500 border-t border-slate-800/60 mt-8">
        <div>TryWinterArc — Lock in while they coast. ❄️ — Disappear for 90 days. Come back unrecognizable.</div>
        <div className="mt-1">Oct 1 → Dec 31 (92 days) • Jan 1 graduation • No restart • 100% local • <a href="https://github.com" className="underline decoration-slate-600 hover:text-slate-300">Open source</a> • PWA</div>
      </footer>
    </div>
  )
}
