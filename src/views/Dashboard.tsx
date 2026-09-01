import { ImageDown, Pencil, Share2, Trophy } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Eyebrow } from '@/components/app/Surface'
import { HabitIcon } from '@/components/app/HabitIcon'
import { Ring } from '@/components/app/Ring'

export function Dashboard({ arc }: { arc: Arc }) {
  const { achievements, activeDays, allDates, downloadImage, effectiveHabits, end, entries, exportCSV, exportJSON, goTo, isActiveDay, isPerfectDay, isWarmUp, longDate, nativeShare, quote, quoteCredit, setSettings, setWeeksOpen, settings, start, startOnboarding, stats, weeksOpen } = arc
  return (
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Eyebrow icon={Trophy}>Dashboard</Eyebrow>
                <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">
                  {settings?.name ? `${settings.name}'s ${isWarmUp ? 'warm-up' : 'arc'}` : isWarmUp ? 'Your warm-up' : 'Your arc'}
                </h1>
                <p className="mt-1.5 text-sm text-zinc-500">{longDate(start)} to {longDate(end)} · {effectiveHabits.length} {effectiveHabits.length === 1 ? 'habit' : 'habits'} · {activeDays.length === 7 ? 'every day' : `${activeDays.length} days a week`}</p>
              </div>
              <button onClick={() => goTo('tracker')} className="h-11 px-5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-sm hover:text-white hover:border-zinc-700 transition">Open tracker</button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 [&>*]:min-w-0">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Overall</div>
                <div className="mt-4">
                  <Ring pct={stats.pct} size={160} stroke={10}>
                    <div className="text-center"><div className="text-[34px] font-bold text-white tabular-nums leading-none">{stats.pct}%</div><div className="mt-1 text-xs font-mono text-zinc-500 tabular-nums">{stats.totalChecked} of {stats.totalPossible}</div></div>
                  </Ring>
                </div>
                <div className="mt-5 w-full grid grid-cols-3 gap-2 text-center">
                  {[
                    ['Perfect', stats.perfect],
                    ['Streak', stats.streak],
                    ['Best', stats.bestStreak],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-zinc-800 bg-zinc-950 py-2.5">
                      <div className="text-[17px] font-bold text-white tabular-nums leading-tight">{v}</div>
                      <div className="text-[10px] font-mono tracking-widest text-zinc-500">{k}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 w-full grid grid-cols-2 gap-2">
                  <button onClick={() => nativeShare()} className="h-11 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition inline-flex items-center justify-center gap-1.5"><Share2 size={14} /> Share</button>
                  <button onClick={() => downloadImage()} className="h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition inline-flex items-center justify-center gap-1.5"><ImageDown size={14} /> PNG</button>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500">Weekly</div>
                  <button onClick={() => setWeeksOpen(v => !v)} aria-expanded={weeksOpen} className="inline-flex items-center min-h-11 px-3 -mr-3 text-[11px] font-mono text-zinc-400 hover:text-white transition">
                    {weeksOpen ? 'Chart' : 'List'}
                  </button>
                </div>
                {(() => {
                  const weeks = []
                  for (let i = 0; i < allDates.length; i += 7) weeks.push(allDates.slice(i, i + 7))
                  const rows = weeks.map((week, wi) => {
                    const sched = week.filter(isActiveDay)
                    const checks = sched.reduce((acc, d) => acc + effectiveHabits.filter(h => (entries[d] || {})[h.id]).length, 0)
                    const perfect = sched.filter(isPerfectDay).length
                    const pct = sched.length * effectiveHabits.length ? Math.round((checks / (sched.length * effectiveHabits.length)) * 100) : 0
                    return { wi, week, sched, perfect, pct }
                  })
                  if (!weeksOpen) {
                    return (
                      <div className="mt-4 flex-1 flex items-end gap-[3px] min-h-[120px]">
                        {rows.map(r => (
                          <div key={r.wi} title={`W${r.wi + 1}: ${r.perfect}/${r.sched.length} perfect, ${r.pct}%`} className="flex-1 flex flex-col justify-end h-full">
                            <div className="w-full rounded-sm bg-white transition-all" style={{ height: `${Math.max(2, r.pct)}%` }} />
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return (
                    <div className="mt-4 flex-1 space-y-1.5 max-h-[240px] overflow-y-auto overscroll-contain">
                      {rows.map(r => (
                        <div key={r.wi} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 flex items-center gap-3">
                          <span className="text-xs font-mono text-zinc-500 w-9 shrink-0">W{r.wi + 1}</span>
                          <span className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"><span className="block h-full bg-white" style={{ width: `${r.pct}%` }} /></span>
                          <span className="text-xs font-mono text-white tabular-nums shrink-0">{r.perfect}/{r.sched.length}</span>
                          <span className="text-xs font-mono text-zinc-500 w-10 text-right tabular-nums shrink-0">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )
                })()}
                <div className="mt-3 text-[10px] font-mono text-zinc-500">{Math.ceil(allDates.length / 7)} weeks</div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col">
                <div className="text-[11px] font-mono tracking-widest text-zinc-500">Today</div>
                <blockquote className="mt-3 text-[15px] leading-6 text-zinc-200">
                  {quote.text}
                  <cite className="mt-2 block not-italic text-[13px] text-zinc-500">&mdash; {quoteCredit}</cite>
                </blockquote>

                <div className="mt-5 space-y-1">
                  <label htmlFor="dash-name" className="text-[11px] font-mono tracking-widest text-zinc-500">Name on your share card</label>
                  <div className="flex gap-2">
                    <input
                      id="dash-name"
                      value={settings?.name ?? ''}
                      onChange={e => setSettings(prev => (prev ? { ...prev, name: e.target.value || null } : prev))}
                      placeholder="Optional"
                      maxLength={40}
                      className="flex-1 min-w-0 h-11 rounded-full bg-zinc-950 border border-zinc-800 px-4 text-base sm:text-sm text-white placeholder:text-zinc-500"
                    />
                    <button onClick={startOnboarding} aria-label="Edit habits and dates" title="Edit habits and dates" className="w-11 h-11 shrink-0 grid place-items-center rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition"><Pencil size={15} className="text-zinc-300" /></button>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500">Take your data</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button onClick={exportJSON} className="h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">JSON</button>
                    <button onClick={exportCSV} className="h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition">CSV</button>
                  </div>
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
                      {a.unlock ? 'Unlocked' : a.progress}
                    </div>
                    {a.unlock && (
                      <button
                        onClick={() => nativeShare(a)}
                        className="mt-auto pt-3 self-start inline-flex items-center min-h-11 gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900"
                      >
                        <Share2 size={12} /> Share
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
  )
}
