import { ArrowRight, Bell, CalendarClock, Check, Dumbbell, ExternalLink, LayoutGrid, Moon, Target, Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import type { Arc } from '@/hooks/useArc'
import QuietBoundary from '@/components/app/QuietBoundary'

const ThreeHero = lazy(() => import('@/ThreeHero'))

import { Eyebrow, IconChip } from '@/components/app/Surface'
import { HabitIcon } from '@/components/app/HabitIcon'
import { Ring } from '@/components/app/Ring'
import { fadeUp, stagger } from '@/lib/motion'

export function Landing({ arc }: { arc: Arc }) {
  const { goTo, hasData, heroReady, longDate, setupWarmUp, startOnboarding, today, winterArc } = arc
  // What setup will actually do if they tap Start, said before they tap it.
  const seasonNote = setupWarmUp
    ? `Winter arc starts ${longDate(winterArc.start)}. Start today as a warm-up and roll into it.`
    : today >= winterArc.start && today <= winterArc.end
      ? `Winter arc is running. Start from today and track what is left of it.`
      : `Winter arc runs ${longDate(winterArc.start)} to ${longDate(winterArc.end)}. That is a long wait, so setup starts you today instead.`
  return (
          <main id="main">
            <section className="relative overflow-hidden aurora">
              {heroReady && <QuietBoundary><Suspense fallback={null}><ThreeHero /></Suspense></QuietBoundary>}
              <div className="max-w-[1040px] mx-auto px-5 sm:px-6 min-h-[calc(100svh-3.5rem-env(safe-area-inset-top))] flex flex-col justify-center py-16">
              <motion.div variants={stagger} initial="hidden" animate="show" className="text-center">
                <motion.h1 variants={fadeUp} className="font-[800] tracking-[-0.045em] leading-[0.88] text-[48px] min-[380px]:text-[56px] sm:text-[88px] lg:text-[104px] text-white">
                  Lock in while<br />
                  they coast.
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-6 text-[18px] sm:text-[24px] font-medium text-zinc-400 max-w-[620px] mx-auto">
                  Disappear for 90 days. Come back unrecognizable.
                </motion.p>
                <motion.p variants={fadeUp} className="mt-4 max-w-[520px] mx-auto text-[15px] leading-6 text-zinc-500">
                  Pick a few habits. Check them off daily. Your habit data never leaves your browser.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={startOnboarding} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-white text-zinc-900 font-semibold text-[15px] hover:bg-zinc-100 transition">
                    Start your arc <ArrowRight size={16} />
                  </button>
                  <button onClick={() => { hasData ? goTo('tracker') : goTo('templates') }} className="w-full sm:w-auto inline-flex items-center justify-center px-7 h-12 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 font-medium text-[15px] hover:bg-zinc-800 hover:border-zinc-700 transition">
                    {hasData ? 'Open tracker' : 'Browse templates'}
                  </button>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-6 flex justify-center">
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur px-4 py-2 text-[12px] leading-5 text-zinc-400 text-left">
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-white" />
                    {seasonNote}
                  </span>
                </motion.div>
              </motion.div>
              </div>
            </section>

            <section className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }} className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-950">
                  <div className="text-[11px] font-mono tracking-widest text-zinc-500">Preview</div>
                  <div className="text-[11px] font-mono text-zinc-600">Honest grid</div>
                </div>
                <div className="px-4 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { k: 'Day', v: '14', sub: '15% through', pct: 15 },
                    { k: 'Streak', v: '6', sub: 'best 6', pct: 85 },
                    { k: 'Perfect', v: '11', sub: 'of 14 days', pct: 78 },
                    { k: 'Completion', v: '82%', sub: '57 of 70', pct: 82 },
                  ].map(st => (
                    <div key={st.k} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 flex items-center gap-2.5">
                      <Ring pct={st.pct} size={38} stroke={3}><span className="text-[9px] font-mono font-bold text-white">{st.pct}%</span></Ring>
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono tracking-widest text-zinc-500">{st.k}</div>
                        <div className="text-[15px] font-bold text-white leading-tight tabular-nums">{st.v}</div>
                        <div className="text-[11px] font-mono text-zinc-500 truncate">{st.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-[280px_1fr] gap-0 mt-4">
                  <div className="p-4 bg-zinc-950/40">
                    <div className="text-[11px] font-mono tracking-widest text-zinc-500">Today, 3 of 5</div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        { n: 'Gym 45m', icon: 'dumbbell', d: true },
                        { n: 'Sleep 7.5h', icon: 'moon', d: true },
                        { n: 'No sugar', icon: 'salad', d: true },
                        { n: 'Deep work 90m', icon: 'target', d: false },
                        { n: 'Reading 10p', icon: 'bookopen', d: false },
                      ].map(r => (
                        <div key={r.n} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-[13px] ${r.d ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>
                          <span className={`w-4 h-4 rounded-full border grid place-items-center ${r.d ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-700'}`}>{r.d ? <Check size={10} /> : null}</span>
                          <span className={`w-6 h-6 rounded-full grid place-items-center ${r.d ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-zinc-400'}`}><HabitIcon name={r.icon} size={12} /></span>
                          <span className="font-medium truncate">{r.n}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                      <div className="text-[11px] font-mono tracking-widest text-zinc-500">Current streak</div>
                      <div className="mt-1 flex items-end gap-2">
                        <span className="text-[26px] leading-none font-bold tabular-nums text-white">6</span>
                        <span className="pb-0.5 text-[11px] text-zinc-500">days in a row</span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {['full', 'full', 'rest', 'full', 'full', 'full', 'part'].map((v, i) => (
                          <span key={i} className={`flex-1 h-5 rounded-sm ${v === 'full' ? 'bg-white' : v === 'part' ? 'bg-zinc-500' : 'bg-zinc-900 border border-zinc-800'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-widest text-zinc-500">October</span>
                      <span className="text-[11px] font-mono text-zinc-600 tabular-nums">11/22</span>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-1.5">
                      {Array.from({ length: 31 }, (_, i) => {
                        const rest = i % 7 === 5 || i % 7 === 6
                        const v = rest ? 'rest' : i < 11 ? 'perfect' : i < 13 ? 'partial' : i < 15 ? 'miss' : 'future'
                        const cls = v === 'perfect' ? 'bg-white border-white' : v === 'partial' ? 'bg-zinc-300 border-zinc-300' : v === 'miss' ? 'bg-red-500/15 border-red-500/20' : v === 'rest' ? 'bg-zinc-950 border-zinc-800/70' : 'bg-zinc-900 border-zinc-800/60'
                        return <div key={i} className={`aspect-square rounded-md border ${cls}`} />
                      })}
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {['November', 'December'].map((m, i) => (
                        <div key={m} className="rounded-xl border border-zinc-800 bg-zinc-950 min-h-9 px-3 flex items-center gap-3">
                          <span className="text-zinc-600 text-[11px]">&#9656;</span>
                          <span className="text-[12px] text-zinc-400">{m}</span>
                          <span className="ml-auto text-[10px] font-mono text-zinc-600 tabular-nums">{i === 0 ? '0/21' : '0/22'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-600">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white border border-white" /> perfect</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-300 border border-zinc-300" /> partial</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/15 border border-red-500/20" /> missed</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-950 border border-zinc-800" /> rest</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <section id="features" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12 scroll-mt-[calc(3.5rem+env(safe-area-inset-top))]">
              <Eyebrow icon={LayoutGrid}>Features</Eyebrow>
              <h2 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Stay honest.</h2>
              <p className="mt-1.5 text-sm text-zinc-500 max-w-[560px]">The grid is the point. Everything else is optional.</p>

              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2 md:min-h-[280px]">
                  <div className="p-5 sm:p-6 flex flex-col justify-center">
                    <IconChip icon={Check} active />
                    <h3 className="mt-3 text-[15px] font-semibold text-white">The grid does not lie</h3>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-400">One square a day. White is clean, grey is partial, red is a miss. You can fill in a day you forgot to log, but not one that has not happened.</p>
                    <div className="mt-4 text-[11px] font-mono text-zinc-500">Local only · Export JSON/CSV anytime</div>
                  </div>
                  <div className="bg-zinc-950 p-5 grid place-items-center">
                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 w-full max-w-[360px]">
                      {Array.from({ length: 56 }, (_, i) => {
                        const c = i < 18 ? 'bg-white border-white' : i < 22 ? 'bg-zinc-300 border-zinc-300' : i < 24 ? 'bg-red-500/15 border-red-500/20' : 'bg-zinc-800 border-zinc-800'
                        return <div key={i} className={`aspect-square rounded-sm border ${c}`} />
                      })}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2 md:min-h-[280px]">
                  <div className="bg-zinc-950 p-6 grid place-items-center order-2 md:order-1">
                    <div className="flex items-center gap-6">
                      <Ring pct={72} size={72}><span className="text-xs font-bold text-white">72%</span></Ring>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-zinc-200"><span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center"><Dumbbell size={13} /></span> Gym 72%</div>
                        <div className="flex items-center gap-2 text-sm text-zinc-200"><span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center"><Moon size={13} /></span> Sleep 84%</div>
                        <div className="flex items-center gap-2 text-sm text-zinc-200"><span className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center"><Target size={13} /></span> Work 61%</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col justify-center order-1 md:order-2">
                    <IconChip icon={Trophy} />
                    <h3 className="mt-3 text-[15px] font-semibold text-white">Rings for each habit</h3>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-400">See which habit is dragging and which one runs itself.</p>
                    <div className="mt-4 text-[11px] font-mono text-zinc-500">Updates live as you check the day</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden grid md:grid-cols-2 md:min-h-[280px]">
                  <div className="p-5 sm:p-6 flex flex-col justify-center">
                    <IconChip icon={ExternalLink} />
                    <h3 className="mt-3 text-[15px] font-semibold text-white">Share only if you want</h3>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-400">A PNG for X or WhatsApp. Nothing leaves the device until you tap share.</p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white border border-white text-zinc-900 text-xs font-semibold">X Post</span>
                      <span className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold">WhatsApp</span>
                      <span className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs">PNG</span>
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-6 grid place-items-center">
                    <div className="w-full max-w-[320px] rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="text-[11px] font-mono tracking-widest text-zinc-500">WINTERARC · Day 34/92</div>
                      <div className="mt-2 text-sm font-semibold text-white">18 perfect · 64% · streak 5</div>
                      <div className="mt-2 h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full w-[64%] bg-white" /></div>
                      <div className="mt-3 text-xs text-zinc-500">Day 34 of 92. No filter, no caption needed.</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                    <IconChip icon={CalendarClock} />
                    <h3 className="mt-3 text-[15px] font-semibold text-white">Start before the season</h3>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-400">
                      {setupWarmUp
                        ? `The arc starts ${longDate(winterArc.start)}. Rather than hand you a countdown, setup runs a warm-up from today to ${longDate(setupWarmUp.end)}, then rolls you into the arc with the same habits.`
                        : 'When the arc is still weeks away, setup runs a warm-up from today up to the day before it starts, then rolls you into the arc with the same habits.'}
                    </p>
                    <div className="mt-4 text-[11px] font-mono text-zinc-500">Warm-up days are kept, not counted</div>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                    <IconChip icon={Bell} />
                    <h3 className="mt-3 text-[15px] font-semibold text-white">One morning, one evening</h3>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-400">
                      Optional reminders at times you set, using your own system sound. There is no push server, so they fire while WinterArc is open or installed. Rest days and finished days stay quiet.
                    </p>
                    <div className="mt-4 text-[11px] font-mono text-zinc-500">Off until you turn them on</div>
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
                    { n: '01', t: 'Set it up', d: 'Your dates, your habits. Five is plenty. Past ten you are lying to yourself. If the arc is weeks away, setup offers a warm-up so you start today.' },
                    { n: '02', t: 'Tap what you did', d: 'Backfill any past date. Forgetting to log is not the same as missing.' },
                    { n: '03', t: 'Watch the grid fill', d: 'Red stays red, and tomorrow stays locked until it arrives.' },
                  ].map(s => (
                    <motion.div variants={fadeUp} key={s.n} className="flex gap-4">
                      <div className="text-[13px] font-mono tracking-widest text-zinc-500 pt-0.5">{s.n}</div>
                      <div><div className="text-[14px] font-semibold text-white">{s.t}</div><div className="mt-2 text-[14px] leading-6 text-zinc-400">{s.d}</div></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

          </main>
  )
}
