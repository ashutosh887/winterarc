import { ArrowRight, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Arc } from '@/hooks/useArc'
import type { Tier } from '@/lib/types'
import { ALL_WEEKDAYS, ARC_PRESETS, WEEKDAYS, daysBetween } from '@/lib/date'
import { Button } from '@/components/ui/button'
import { HabitIcon } from '@/components/app/HabitIcon'
import { HabitTile } from '@/components/app/HabitTile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/app/Ring'
import { PRESETS, TIER_LABELS } from '@/lib/presets'
import { templates } from '@/config'

export function OnboardingDialog({ arc }: { arc: Arc }) {
  const { addCustom, arcLength, completeOnboarding, customList, customName, onboardStep, overlayProps, setCustomList, setCustomName, setOnboardStep, setShowOnboarding, setTmpDays, setTmpEnd, setTmpName, setTmpSelected, setTmpStart, tmpDays, tmpEnd, tmpName, tmpSelected, tmpStart, today } = arc
  return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} {...overlayProps(() => setShowOnboarding(false))} className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-4 sm:pt-6 bg-zinc-950/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Set up your arc">
            <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ type: 'spring', damping: 24, stiffness: 260 }} onClick={e => e.stopPropagation()} className="w-full max-w-[760px] max-h-[92dvh] flex flex-col overscroll-contain rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
              <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-zinc-800"><div className="flex items-center gap-2 min-w-0"><Logo size={24} /><span className="font-semibold tracking-[0.16em] text-[13px] text-white truncate">Set up your arc</span> <span className="shrink-0 text-xs font-mono text-zinc-500">Step {onboardStep}/2</span></div><button onClick={() => setShowOnboarding(false)} aria-label="Close" className="w-11 h-11 shrink-0 grid place-items-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition"><X size={14} /></button></div>
              {onboardStep === 1 && (
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5">
                  <h2 className="text-[22px] font-bold tracking-tight text-white">Name and dates</h2>
                  <p className="mt-1 text-sm text-zinc-500">Saved in this browser. No account.</p>
                  <div className="mt-5 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="arc-name" className="text-zinc-500">Your name</Label>
                      <Input id="arc-name" value={tmpName} onChange={e => setTmpName(e.target.value)} placeholder="Your name" className="h-11" autoComplete="off" maxLength={40} />
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
                              className={`h-11 px-4 rounded-full text-[13px] font-medium border transition inline-flex items-center gap-1.5 ${active ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'}`}
                            >
                              {active && <Check size={12} />}
                              {preset.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-zinc-500">Which days</Label>
                        <button type="button" onClick={() => setTmpDays(ALL_WEEKDAYS)} className="text-[11px] font-mono text-zinc-500 hover:text-white transition">Every day</button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {WEEKDAYS.map(d => {
                          const on = tmpDays.includes(d.i)
                          return (
                            <button
                              key={d.i}
                              type="button"
                              aria-pressed={on}
                              onClick={() => setTmpDays(prev => on ? prev.filter(x => x !== d.i) : [...prev, d.i])}
                              className={`h-11 min-w-0 px-0 rounded-full text-[12px] font-medium border transition grid place-items-center ${on ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'}`}
                            >
                              {d.short}
                            </button>
                          )
                        })}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {tmpDays.length === 7
                          ? 'Every day counts. Miss one and the streak resets.'
                          : tmpDays.length === 0
                            ? 'Pick at least one day.'
                            : `${tmpDays.length} days a week. The rest are rest days and never count as a miss.`}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label htmlFor="arc-start" className="text-zinc-500">Start</Label><Input id="arc-start" type="date" value={tmpStart} onChange={e => setTmpStart(e.target.value)} className="h-11 appearance-none" /></div>
                      <div className="space-y-1.5"><Label htmlFor="arc-end" className="text-zinc-500">End</Label><Input id="arc-end" type="date" value={tmpEnd} onChange={e => setTmpEnd(e.target.value)} className="h-11 appearance-none" /></div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300">Duration</span>
                        <span className={`text-sm font-mono ${arcLength > 0 ? 'text-white' : 'text-red-300'}`}>
                          {arcLength > 0 ? `${arcLength} days` : 'End date is before the start'}
                        </span>
                      </div>
                      {arcLength > 0 && (
                        <div className="mt-1.5 text-xs text-zinc-500">
                          {tmpStart > today
                            ? `Starts in ${daysBetween(today, tmpStart) - 1} ${daysBetween(today, tmpStart) - 1 === 1 ? 'day' : 'days'}.`
                            : tmpStart === today ? 'Starts today.' : `Already running, day ${daysBetween(tmpStart, today)}.`}
                          {' '}
                          {tmpDays.length < 7 ? `${Math.round(arcLength * tmpDays.length / 7)} of those are scheduled days.` : 'Every day is scheduled.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {onboardStep === 1 && (
                <div className="shrink-0 border-t border-zinc-800 px-4 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex justify-end">
                  <Button disabled={arcLength < 1 || tmpDays.length === 0} onClick={() => setOnboardStep(2)} className="h-11 px-5 w-full sm:w-auto">Continue <ArrowRight size={14} /></Button>
                </div>
              )}
              {onboardStep === 2 && (
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5">
                  <h2 className="text-[22px] font-bold tracking-tight text-white">Pick your habits</h2>
                  <p className="mt-1 text-sm text-zinc-500">Three to five is enough. Ten is the cap.</p>

                  <div className="mt-4">
                    <div className="text-[11px] font-mono tracking-widest text-zinc-500">Start from a template</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {templates.map(t => {
                        const ids = t.habitIds
                        const on = ids.length === tmpSelected.size && ids.every(id => tmpSelected.has(id))
                        return (
                          <button
                            key={t.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setTmpSelected(new Set(ids))}
                            title={t.desc}
                            className={`h-11 px-4 rounded-full text-[13px] font-medium border transition inline-flex items-center gap-1.5 ${on ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'}`}
                          >
                            {on ? <Check size={12} /> : <HabitIcon name={t.icon} size={13} />}
                            {t.name}
                          </button>
                        )
                      })}
                      <button
                        type="button"
                        onClick={() => { setTmpSelected(new Set()); setCustomList([]) }}
                        className="h-11 px-4 rounded-full text-[13px] font-medium border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-700 transition"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">Ticks its habits below. Edit them after.</p>
                  </div>
                  <div className="mt-2 text-[11px] font-mono tracking-widest text-zinc-500">Selected {tmpSelected.size} {tmpSelected.size > 10 && '· over 10'}</div>
                  {(['non-neg', 'extra', 'aesthetic', 'custom'] as Tier[]).map(tier => {
                    const items = tier === 'custom' ? customList : PRESETS.filter(p => p.tier === tier)
                    if (tier === 'custom' && items.length === 0) return null
                    return (
                      <div key={tier} className="mt-5">
                        <div className="text-[11px] font-mono tracking-widest text-zinc-500">{TIER_LABELS[tier]}</div>
                        <div className="mt-2 grid sm:grid-cols-2 gap-2">
                          {items.map(p => (
                            <HabitTile
                              key={p.id}
                              icon={<HabitIcon name={p.icon} size={14} />}
                              name={p.name}
                              desc={p.desc}
                              selected={tmpSelected.has(p.id)}
                              onToggle={() => setTmpSelected(prev => {
                                const next = new Set(prev)
                                if (next.has(p.id)) next.delete(p.id); else next.add(p.id)
                                return next
                              })}
                              onRemove={tier === 'custom' ? () => {
                                setCustomList(prev => prev.filter(x => x.id !== p.id))
                                setTmpSelected(prev => { const next = new Set(prev); next.delete(p.id); return next })
                              } : undefined}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-[11px] font-mono tracking-widest text-zinc-500">Add your own</div>
                    <div className="mt-2 flex gap-2">
                      <Input aria-label="Custom habit name" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. Run 5km" onKeyDown={e => e.key === 'Enter' && addCustom()} className="h-11" maxLength={60} />
                      <Button variant="secondary" className="h-11 px-5 shrink-0" onClick={addCustom}>Add</Button>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">Joins the Custom group above, ticked.</p>
                  </div>
                </div>
              )}
              {onboardStep === 2 && (
                <div className="shrink-0 border-t border-zinc-800 px-4 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-11" onClick={() => setOnboardStep(1)}>Back</Button>
                  <Button className="h-11" onClick={completeOnboarding}>Save arc · {tmpSelected.size} <ArrowRight size={14} /></Button>
                </div>
              )}
            </motion.div>
          </motion.div>
  )
}
