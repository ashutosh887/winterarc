import { Bell, BellOff, Check, ChevronDown, ChevronLeft, ChevronRight, Info, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Arc } from '@/hooks/useArc'
import { Disclosure } from '@/components/app/Disclosure'
import { HabitIcon } from '@/components/app/HabitIcon'
import { IconChip } from '@/components/app/Surface'
import { Ring } from '@/components/app/Ring'
import { DEFAULT_REMINDERS, REMINDER_SLOTS, SLOT_LABELS, clockLabel } from '@/lib/reminders'
import { addDays } from '@/lib/date'
import { fadeUp, stagger } from '@/lib/motion'

export function Tracker({ arc }: { arc: Arc }) {
  const { activeDays, allDates, arcEnded, arcStarted, canRollOver, copyPrompt, dailyPct, dayComplete, dayDoneCount, dayLabel, dayPct, daysToStart, effectiveHabits, end, entries, exportCSV, exportJSON, focusMonth, habitStreak, isActiveDay, isPerfectDay, isWarmUp, llmPrompt, longDate, months, nextArcCta, nextArcLabel, openMonths, promptCopied, promptOpen, selectedDate, selectedIsFuture, setConfirmReset, setEntries, setOpenMonths, setPromptOpen, setSelectedDate, setShareOpen, setReminderTime, setStreakInfo, setUndo, askForReminders, notifPermission, reminderTest, reminders, remindersOn, remindersSet, remindersSupported, runLabel, start, startOnboarding, startToday, startWarmUp, startWinterArc, stats, stepDay, streakInfo, today, toggleHabit, totalDays, testReminder, turnOffReminders, undo, warmUp } = arc
  return (
    <>
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-8">
            <h1 className="sr-only">Tracker</h1>
            {arcEnded && (
              <div className="mb-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-[17px] font-bold tracking-tight text-white">{isWarmUp ? 'Warm-up done.' : 'Arc complete.'}</h2>
                  <span className="text-[13px] text-zinc-400 tabular-nums">{stats.perfect} of {stats.scheduled} days perfect, {stats.pct}% of checks.</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-6 text-zinc-500 max-w-[560px]">
                  {canRollOver
                    ? `${nextArcLabel} Same habits, empty grid. What you logged stays in this browser and in both exports. It just stops counting toward the new run.`
                    : 'That window is closed. Set the next one whenever you are ready.'}
                </p>
                <div className={`mt-4 gap-2 ${canRollOver ? 'grid grid-cols-2 sm:max-w-[420px]' : 'flex'}`}>
                  {canRollOver ? (
                    <>
                      <button onClick={startWinterArc} className="h-11 px-4 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">{nextArcCta}</button>
                      <button onClick={startOnboarding} className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">Edit dates</button>
                    </>
                  ) : (
                    <button onClick={startOnboarding} className="h-11 px-5 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">Set up your next arc</button>
                  )}
                </div>
              </div>
            )}
            <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 flex items-center gap-2.5">
                <Ring pct={dayPct} size={44} stroke={3}><span className="text-[11px] font-mono font-bold tabular-nums text-white">{dayPct}%</span></Ring>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-mono tracking-normal sm:tracking-widest text-zinc-400 truncate">{runLabel}</div>
                  <div className="text-[17px] font-bold text-white leading-tight tabular-nums">{stats.dayNum}</div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate">{stats.remaining} left</div>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 flex items-center gap-2.5">
                <Ring pct={stats.perfectPct} size={44} stroke={3}><span className="text-[11px] font-mono font-bold tabular-nums text-white">{stats.perfectPct}%</span></Ring>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-mono tracking-normal sm:tracking-widest text-zinc-400 truncate">Perfect days</div>
                  <div className="text-[17px] font-bold text-white leading-tight">{stats.perfect}<span className="text-xs font-mono text-zinc-500">/{stats.scheduled}</span></div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate">of {stats.scheduled} days</div>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 flex items-center gap-2.5">
                <Ring pct={stats.pct} size={44} stroke={3}><span className="text-xs font-bold tabular-nums text-white">{stats.pct}%</span></Ring>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-mono tracking-normal sm:tracking-widest text-zinc-400 truncate">Completion</div>
                  <div className="text-[17px] font-bold text-white leading-tight">{stats.totalChecked}<span className="text-xs font-mono text-zinc-500">/{stats.totalPossible}</span></div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate">checks</div>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 col-span-2 lg:col-span-1 flex flex-col justify-center">
                <button onClick={() => setShareOpen(true)} aria-haspopup="dialog" className="w-full flex items-center gap-2.5 text-left rounded-xl">
                  <IconChip icon={Share2} size={44} />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-mono tracking-widest text-zinc-500">Share</span>
                    <span className="block text-[13px] font-semibold text-white">Post your grid</span>
                  </span>
                  <ChevronRight size={15} className="ml-auto shrink-0 text-zinc-500" />
                </button>
              </motion.div>
            </motion.div>

            <div className="mt-3 grid lg:grid-cols-[360px_1fr] gap-4 items-start">
              <div className="lg:sticky lg:top-[calc(8.5rem+env(safe-area-inset-top))] z-10">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-white">Daily check-in</h2>
                    {!arcStarted
                      ? <div className="text-[11px] font-mono text-zinc-500">Starts {longDate(start)}</div>
                      : selectedIsFuture
                        ? <div className="text-[11px] font-mono text-zinc-500">Not here yet. Come back on the day.</div>
                        : !isActiveDay(selectedDate) && <div className="text-[11px] font-mono text-zinc-500">Rest day, nothing owed</div>}
                  </div>
                  <Ring pct={dailyPct} size={44} stroke={3}><span className="text-[11px] font-mono font-bold text-zinc-300">{dailyPct}%</span></Ring>
                </div>
                {!arcStarted && (
                  <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
                    <div className="text-[34px] leading-none font-bold tabular-nums text-white">{daysToStart}</div>
                    <div className="mt-1 text-[13px] text-zinc-400">{daysToStart === 1 ? 'day until you start' : 'days until you start'}</div>
                    <p className="mt-3 text-xs leading-5 text-zinc-500">
                      {warmUp
                        ? 'Nothing to check yet. Warm up until it starts, so checking in is already a habit on day one.'
                        : 'Nothing to check yet. Start today and keep the same length, or edit the dates.'}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {warmUp
                        ? <button onClick={startWarmUp} className="h-11 px-4 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">Start a warm-up</button>
                        : <button onClick={startToday} className="h-11 px-4 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">Start today</button>}
                      <button onClick={startOnboarding} className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">Edit dates</button>
                    </div>
                    {warmUp && (
                      <p className="mt-3 text-[11px] font-mono text-zinc-500 tabular-nums">
                        {longDate(warmUp.start)} to {longDate(warmUp.end)}, then your arc
                      </p>
                    )}
                  </div>
                )}
                <div className={`mt-3 flex items-center gap-2 ${arcStarted ? '' : 'hidden'}`}>
                  <button
                    onClick={() => stepDay(-1)}
                    disabled={selectedDate <= start}
                    aria-label="Previous day"
                    className="w-11 h-11 shrink-0 grid place-items-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  ><ChevronLeft size={16} /></button>
                  <div className="flex-1 min-w-0 text-center">
                    <div className="text-sm font-medium text-white truncate">{dayLabel(selectedDate)}</div>
                  </div>
                  <button
                    onClick={() => stepDay(1)}
                    disabled={selectedDate >= (today < end ? today : end)}
                    aria-label="Next day"
                    className="w-11 h-11 shrink-0 grid place-items-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  ><ChevronRight size={16} /></button>
                </div>
                <input type="date" aria-label="Day to check in" value={selectedDate} min={start} max={today < end ? today : end} disabled={!arcStarted} onChange={e => { const v = e.target.value; if (!v) return; const cap = today < end ? today : end; setSelectedDate(v < start ? start : v > cap ? cap : v) }} className="mt-2 w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 min-h-11 text-base sm:text-sm text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed" />
                <div className={`mt-4 space-y-2 ${arcStarted ? '' : 'hidden'}`}>
                  {effectiveHabits.map((h, hi) => {
                    const done = !!(entries[selectedDate] || {})[h.id]
                    return (
                      <label key={h.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${selectedIsFuture ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${done ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                        <input type="checkbox" checked={done} disabled={selectedIsFuture} onChange={() => toggleHabit(selectedDate, h.id)} className="accent-zinc-900 w-4 h-4 disabled:cursor-not-allowed" />
                        <span className={`w-7 h-7 rounded-full grid place-items-center border ${done ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}><HabitIcon name={h.icon} size={14} /></span>
                        <span className={`text-sm flex-1 ${done ? 'text-zinc-900 font-medium' : 'text-zinc-200'}`}>{h.name}</span>
                        {hi < 9 && <span className={`hidden lg:grid w-5 h-5 shrink-0 place-items-center rounded border text-[10px] font-mono ${done ? 'border-zinc-300 text-zinc-500' : 'border-zinc-800 text-zinc-600'}`}>{hi + 1}</span>}
                        {done && <span className="text-zinc-900"><Check size={14} /></span>}
                      </label>
                    )
                  })}
                </div>
                <div className="hidden lg:flex mt-2 items-center gap-2 text-[10px] font-mono text-zinc-600">
                  <kbd className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950">&larr;</kbd>
                  <kbd className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950">&rarr;</kbd>
                  <span>day</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950">T</kbd>
                  <span>today</span>
                  {effectiveHabits.length > 0 && (
                    <>
                      <kbd className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950">1</kbd>
                      <span>toggle</span>
                    </>
                  )}
                </div>
                {undo && undo.date === selectedDate && (
                  <div role="status" aria-live="polite" className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Day cleared.</span>
                    <button
                      onClick={() => { setEntries(prev => ({ ...prev, [undo.date]: { ...undo.entry } })); setUndo(null) }}
                      className="ml-auto min-h-11 px-4 rounded-full border border-zinc-700 bg-zinc-800 text-xs text-white hover:bg-zinc-700 transition"
                    >Undo</button>
                  </div>
                )}
                <div className={`mt-3 text-xs font-mono ${arcStarted ? '' : 'hidden'}`}>
                  {dayComplete
                    ? <span className="text-white inline-flex items-center gap-1"><Check size={12} /> Perfect day</span>
                    : <span className="text-zinc-400">{dayDoneCount} of {effectiveHabits.length} done</span>}
                </div>
                <div className={`mt-3 grid grid-cols-2 gap-2 ${arcStarted ? '' : 'hidden'}`}>
                  <button
                    disabled={selectedIsFuture || effectiveHabits.length === 0}
                    onClick={() => {
                      if (selectedIsFuture) return
                      const e = entries[selectedDate] || {}
                      const allDone = effectiveHabits.length > 0 && effectiveHabits.every(h => e[h.id])
                      if (allDone) setUndo({ date: selectedDate, entry: { ...(entries[selectedDate] || {}) } })
                      setEntries(prev => {
                        const kept = { ...(prev[selectedDate] || {}) }
                        effectiveHabits.forEach(h => { if (allDone) delete kept[h.id]; else kept[h.id] = true })
                        return { ...prev, [selectedDate]: kept }
                      })
                    }}
                    className={`h-11 rounded-full text-sm font-semibold border transition disabled:opacity-40 disabled:cursor-not-allowed ${dayComplete ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700' : 'bg-white border-white text-zinc-900 hover:bg-zinc-100'}`}
                  >{dayComplete ? 'Uncheck all' : 'Mark all done'}</button>
                  <button disabled={selectedDate === (today < end ? today : end)} onClick={() => setSelectedDate(today < end ? today : end)} className="h-11 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm hover:text-white hover:border-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed">Go to today</button>
                </div>
              </div>
                <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-widest text-zinc-500">Current streak</span>
                  <button
                    type="button"
                    onClick={() => setStreakInfo(v => !v)}
                    aria-label="How streaks are counted"
                    aria-expanded={streakInfo}
                    className="w-11 h-11 -m-2.5 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <Info size={13} />
                  </button>
                </div>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-[40px] leading-none font-bold tabular-nums text-white">{stats.streak}</span>
                  <span className="pb-1 text-sm text-zinc-500">{stats.streak === 1 ? 'day' : 'days'} in a row</span>
                  <span className="ml-auto pb-1 text-xs font-mono text-zinc-500">best {stats.bestStreak}</span>
                </div>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = addDays(today, i - 6)
                    const e = entries[d] || {}
                    const full = effectiveHabits.length > 0 && effectiveHabits.every(h => e[h.id])
                    const some = Object.values(e).some(Boolean)
                    const inArc = d >= start && d <= end
                    return (
                      <div
                        key={d}
                        title={d}
                        className={`flex-1 h-8 rounded-md border ${!inArc || !isActiveDay(d) ? 'bg-zinc-950 border-zinc-800' : full ? 'bg-white border-white' : some ? 'bg-zinc-500 border-zinc-500' : 'bg-zinc-800 border-zinc-700'}`}
                      />
                    )
                  })}
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500">last 7 days</div>
                {streakInfo && (
                  <p className="mt-3 rounded-xl bg-zinc-950 p-3 text-[13px] leading-6 text-zinc-400">
                    A day counts when every habit is checked. Rest days are skipped, so they never break it. One partial scheduled day ends it. Backfilling repairs it, because the streak reads the grid.
                  </p>
                )}
              </div>

              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2.5 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[15px] font-semibold text-white">Your grid</h2>
                  <button
                    onClick={() => setOpenMonths(openMonths.length === months.length ? [focusMonth] : months.map(m => m.key))}
                    className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-xs hover:text-white hover:border-zinc-700 transition"
                  >
                    {openMonths.length === months.length ? 'Collapse' : `Show all ${totalDays} days`}
                  </button>
                </div>

                <div className="mt-3 sm:hidden flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white" /> all</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-300" /> some</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/15 border border-red-500/20" /> missed</span>
                  {activeDays.length < 7 && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-950 border border-zinc-800" /> rest</span>}
                </div>
                <div className="mt-4 space-y-2">
                  {months.map(m => {
                    const open = openMonths.includes(m.key)
                    return (
                      <div key={m.key} className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                        <button
                          onClick={() => setOpenMonths(prev => prev.includes(m.key) ? prev.filter(k => k !== m.key) : [...prev, m.key])}
                          aria-expanded={open}
                          className="w-full min-h-11 px-3 flex items-center gap-3 text-left hover:bg-zinc-900/60 transition"
                        >
                          <ChevronDown size={14} className={`shrink-0 text-zinc-500 transition-transform ${open ? '' : '-rotate-90'}`} />
                          <span className="text-[13px] font-medium text-white">{m.label}</span>
                          <span className="ml-auto flex items-center gap-2 shrink-0">
                            <span className="hidden sm:flex gap-0.5" aria-hidden>
                              {m.dates.map(d => (
                                <span key={d} className={`w-1 h-4 rounded-full ${!isActiveDay(d) ? 'bg-zinc-800' : d > today ? 'bg-zinc-800/60' : isPerfectDay(d) ? 'bg-white' : Object.values(entries[d] || {}).some(Boolean) ? 'bg-zinc-500' : 'bg-red-500/40'}`} />
                              ))}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">{m.perfect}/{m.scheduled}</span>
                          </span>
                        </button>
                        {open && (
                          <div className="px-1.5 sm:px-3 pb-3 grid grid-cols-7 gap-1 sm:gap-1.5">
                            {m.dates.map(d => {
                              const e = entries[d] || {}
                              const done = effectiveHabits.filter(h => e[h.id]).length
                              const perfect = isPerfectDay(d)
                              const isToday = d === today
                              const isSelected = d === selectedDate
                              const isFuture = d > today
                              const rest = !isActiveDay(d)
                              let bg = 'bg-zinc-800 border-zinc-700'
                              if (rest) bg = 'bg-zinc-950 border-zinc-800/70'
                              else if (isFuture) bg = 'bg-zinc-900 border-zinc-800/60'
                              else if (perfect) bg = 'bg-white border-white'
                              else if (done > 0) bg = 'bg-zinc-300 border-zinc-300'
                              else if (d < today) bg = 'bg-red-500/15 border-red-500/20'
                              return (
                                <button
                                  key={d}
                                  onClick={() => setSelectedDate(d)}
                                  disabled={isFuture}
                                  aria-label={isFuture ? `${d}, not yet` : rest ? `${d}, rest day` : `${d}, ${done} of ${effectiveHabits.length} done`}
                                  title={isFuture ? `${d} - not yet` : rest ? `${d} - rest day` : `${d} - ${done}/${effectiveHabits.length}`}
                                  className={`relative min-h-11 sm:min-h-0 sm:aspect-square rounded-md border flex flex-col items-center justify-center transition ${isFuture ? 'cursor-not-allowed opacity-60' : 'active:scale-95 hover:scale-[1.04]'} ${bg} ${isSelected ? 'ring-2 ring-inset ring-white' : ''}`}
                                >
                                  <span className={`text-[11px] font-mono tabular-nums ${rest ? 'text-zinc-500' : perfect ? 'text-zinc-900' : done > 0 ? 'text-zinc-900' : isFuture ? 'text-zinc-400' : 'text-red-300'}`}>{d.slice(8, 10)}</span>
                                  <span className={`hidden sm:block text-[9px] font-mono ${perfect ? 'text-zinc-700' : rest ? 'text-zinc-500' : 'text-zinc-400'}`}>{rest ? 'rest' : isFuture ? '' : `${done}/${effectiveHabits.length}`}</span>
                                  {isToday && <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-zinc-900" />}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6">
                  <h2 className="text-[11px] font-mono tracking-widest text-zinc-500">Habit rings</h2>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {effectiveHabits.map(h => {
                      const hits = allDates.filter(d => (entries[d] || {})[h.id]).length
                      const pct = Math.round((hits / totalDays) * 100)
                      const streak = habitStreak(h.id)
                      return (
                        <div key={h.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 flex flex-col items-center gap-1.5">
                          <Ring pct={pct} size={56} stroke={4}><span className="text-zinc-200"><HabitIcon name={h.icon} size={16} /></span></Ring>
                          <div className="text-[11px] text-center leading-tight text-zinc-200 line-clamp-2 min-h-[26px] flex items-center" title={h.name}>{h.name}</div>
                          <div className="text-[10px] font-mono text-zinc-300 tabular-nums">{streak}d streak</div>
                          <div className="text-[11px] font-mono text-zinc-400">{pct}% · {hits}/{totalDays}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300">
                    {remindersOn ? <Bell size={15} /> : <BellOff size={15} />}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-white">Reminders</h2>
                    <p className="text-[11px] font-mono text-zinc-500">
                      {!remindersSupported
                        ? 'Not available in this browser'
                        : notifPermission === 'denied'
                          ? 'Blocked for this site'
                          : remindersSet
                            ? REMINDER_SLOTS.filter(sl => reminders[sl]).map(sl => `${SLOT_LABELS[sl]} ${clockLabel(reminders[sl])}`).join(' · ')
                            : 'Off'}
                    </p>
                  </div>
                </div>
                {remindersSupported && (
                  remindersSet
                    ? <button onClick={turnOffReminders} className="h-11 px-4 shrink-0 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">Delete both</button>
                    : <button onClick={askForReminders} className="h-11 px-4 shrink-0 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">Turn on reminders</button>
                )}
              </div>

              {remindersSupported && (
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {REMINDER_SLOTS.map(slot => {
                    const on = reminders[slot] !== null
                    return (
                      <div key={slot} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] text-zinc-300">{SLOT_LABELS[slot]}</span>
                          <button
                            aria-pressed={on}
                            aria-label={on ? `Delete the ${SLOT_LABELS[slot].toLowerCase()} reminder` : `Add a ${SLOT_LABELS[slot].toLowerCase()} reminder`}
                            onClick={() => setReminderTime(slot, on ? null : DEFAULT_REMINDERS[slot])}
                            className={`h-8 px-3 rounded-full text-[11px] font-mono border transition ${on ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'}`}
                          >
                            {on ? 'Delete' : 'Add'}
                          </button>
                        </div>
                        <input
                          type="time"
                          aria-label={`${SLOT_LABELS[slot]} reminder time`}
                          value={reminders[slot] ?? DEFAULT_REMINDERS[slot] ?? ''}
                          disabled={!on}
                          onChange={e => setReminderTime(slot, e.target.value || null)}
                          className="mt-2 w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900 px-3 min-h-11 text-base sm:text-sm text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    )
                  })}
                </div>
              )}

              {remindersSupported && remindersSet && notifPermission !== 'granted' && (
                <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 flex flex-wrap items-center gap-3">
                  <span className="text-[13px] text-zinc-300 min-w-0 flex-1">
                    {notifPermission === 'denied'
                      ? 'These times are saved, but notifications are blocked for this site.'
                      : 'These times are saved. Your browser has not been asked for permission yet.'}
                  </span>
                  {notifPermission !== 'denied' && (
                    <button onClick={askForReminders} className="h-11 px-4 shrink-0 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">Allow notifications</button>
                  )}
                </div>
              )}

              <p className="mt-3 text-[13px] leading-6 text-zinc-500">
                {notifPermission === 'denied'
                  ? 'You blocked notifications for this site. Allow them again in your browser settings, then reload.'
                  : !remindersSupported
                    ? 'This browser has no web notifications. On an iPhone they work once WinterArc is on your home screen.'
                    : 'They fire only while WinterArc is open in a tab or installed as an app. No server here, so nothing can wake a closed browser. Rest days and finished days stay quiet, and the sound is your own.'}
              </p>

              {remindersOn && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button onClick={testReminder} className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">Send a test</button>
                  <span role="status" aria-live="polite" className="text-xs font-mono text-zinc-500">
                    {reminderTest === 'sent' ? 'Sent. Check your notifications.' : reminderTest === 'failed' ? 'The browser refused it.' : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <Disclosure open={promptOpen} onToggle={() => setPromptOpen(v => !v)} title="Export and LLM prompt">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={copyPrompt} className="px-4 h-11 rounded-full bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition">{promptCopied ? 'Copied' : 'Copy prompt'}</button>
                    <button onClick={exportJSON} className="px-4 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-xs hover:bg-zinc-700 transition">JSON</button>
                    <button onClick={exportCSV} className="px-4 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-xs hover:bg-zinc-700 transition">CSV</button>
                  </div>
                  <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 overflow-auto max-h-56"><pre className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap break-words font-mono">{llmPrompt}</pre></div>
                  <div className="mt-2 text-xs text-zinc-500">Paste it with your JSON export. Nothing sends itself.</div>
                </div>
              </Disclosure>
            </div>
          </main>

          <div className="max-w-[1040px] mx-auto px-5 sm:px-6 pb-8">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4 flex flex-wrap items-center gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white">Start over</div>
                <p className="mt-1 text-[13px] leading-5 text-zinc-500">Deletes every day you have logged, warm-up included. No undo.</p>
              </div>
              <button onClick={() => setConfirmReset(true)} className="ml-auto shrink-0 h-11 px-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-semibold hover:bg-red-500/15 transition">Reset arc</button>
            </div>
          </div>
    </>
  )
}
