import { lazy, Suspense } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowRight, ArrowUp, ImageDown, MessageCircle, MoreHorizontal, Share2, Smartphone, Snowflake, X } from 'lucide-react'
import { addDays } from '@/lib/date'
import { useArc } from '@/hooks/useArc'
import { AppHeader } from '@/components/app/AppHeader'
import { MobileNav } from '@/components/app/MobileNav'
import { AppFooter } from '@/components/app/AppFooter'
import { OnboardingDialog } from '@/components/app/OnboardingDialog'
import { buttonClass } from '@/components/app/Surface'

const About = lazy(() => import('@/views/About').then(m => ({ default: m.About })))
const Dashboard = lazy(() => import('@/views/Dashboard').then(m => ({ default: m.Dashboard })))
const Feedback = lazy(() => import('@/views/Feedback').then(m => ({ default: m.Feedback })))
const Install = lazy(() => import('@/views/Install').then(m => ({ default: m.Install })))
const Landing = lazy(() => import('@/views/Landing').then(m => ({ default: m.Landing })))
const Resources = lazy(() => import('@/views/Resources').then(m => ({ default: m.Resources })))
const Templates = lazy(() => import('@/views/Templates').then(m => ({ default: m.Templates })))
const Tracker = lazy(() => import('@/views/Tracker').then(m => ({ default: m.Tracker })))

export default function App() {
  const arc = useArc()
  const {
    backupBeforeReset, canvasRef, confirmReset, dayPct, dismissInstallHint, downloadImage, effectiveHabits, end, entries,
    entriesBroken, hasData, installEvent, justUpdated, nativeShare, overlayProps, longDate, quote,
    recommended, resetAll, runHeadline, runLabel, setupWarmUp, resetting, runInstall, selectedDate, setBackupBeforeReset,
    setConfirmReset, setJustUpdated, setResetting, setSelectedDate, setShareOpen, shareOpen, shareToWhatsApp, shareToX,
    showInstallHint, showOnboarding, showScrollTop, start, startOnboarding, stats, totalDays, view,
  } = arc

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-zinc-950">
        {entriesBroken && (
          <div role="alert" className="bg-red-500/10 border-b border-red-500/20 px-5 py-2.5 text-center text-[13px] text-red-200">
            This browser is blocking storage, so nothing you check here will be saved. Private windows and blocked cookies both cause this.
          </div>
        )}
        {justUpdated && (
          <div role="status" aria-live="polite" className="bg-zinc-900 border-b border-zinc-800 px-5 py-2 flex items-center justify-center gap-3 text-[13px] text-zinc-300">
            <span>Updated. Your arc is untouched.</span>
            <button onClick={() => setJustUpdated(false)} aria-label="Dismiss" className="w-8 h-8 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={14} /></button>
          </div>
        )}

        <AppHeader arc={arc} />
        <MobileNav arc={arc} />

        {hasData && view === 'tracker' && (
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 bg-zinc-950/95 backdrop-blur">
            <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 flex items-center gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-400"><Snowflake size={13} /></span>
                <span className="min-w-0 text-sm text-zinc-400 line-clamp-2 sm:truncate">{quote.text} <span className="text-zinc-500">· {quote.author}</span></span>
                <span className="ml-auto hidden sm:inline shrink-0 text-[11px] font-mono text-zinc-500 tabular-nums">{runLabel} {stats.dayNum} / {totalDays} · {dayPct}%</span>
              </div>
            </div>
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
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full shrink-0 ${perfect ? 'bg-white' : done > 0 ? 'bg-zinc-500' : 'bg-red-500/50'}`} />
                <span className="text-zinc-500">Yesterday</span>
                <span className={perfect ? 'text-white font-semibold' : 'text-zinc-300'}>{perfect ? 'Perfect' : `${done}/${effectiveHabits.length} done`}</span>
                <button onClick={() => setSelectedDate(prev)} className="ml-auto text-xs px-4 h-11 inline-flex items-center rounded-full underline decoration-zinc-600 hover:text-white transition">View</button>
              </div>
            </div>
          )
        })()}

        <Suspense fallback={<div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12"><div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 animate-pulse h-48" /></div>}>
          {view === 'landing' && <Landing arc={arc} />}
          {view === 'templates' && <Templates arc={arc} />}
          {view === 'resources' && <Resources arc={arc} />}
          {view === 'about' && <About arc={arc} />}
          {view === 'install' && <Install arc={arc} />}
          {view === 'feedback' && <Feedback />}
          {(view === 'tracker' || view === 'dashboard') && !hasData && (
            <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-white grid place-items-center mx-auto"><ArrowRight size={18} /></div>
                <h1 className="mt-4 text-[22px] font-bold tracking-tight text-white">No arc yet</h1>
                <p className="mt-2 text-sm text-zinc-500">Start your arc to see the tracker. It takes 30 seconds.</p>
                <p className="mt-1.5 text-[13px] leading-6 text-zinc-500 max-w-[420px] mx-auto">
                  {setupWarmUp ? `Setup starts you today and runs a warm-up to ${longDate(setupWarmUp.end)}, then offers you the winter arc.` : `Setup starts you on ${longDate(recommended.start)}. Any other dates work too.`}
                </p>
                <button onClick={startOnboarding} className={buttonClass('primary', 'lg', 'mt-6')}>Start your arc <ArrowRight size={14} /></button>
              </div>
            </main>
          )}
          {view === 'tracker' && hasData && <Tracker arc={arc} />}
          {view === 'dashboard' && hasData && <Dashboard arc={arc} />}
        </Suspense>

        <AnimatePresence>
          {shareOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} {...overlayProps(() => setShareOpen(false))} className="fixed inset-0 z-50 grid place-items-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-zinc-950/80 backdrop-blur" role="dialog" aria-modal="true" aria-label="Share your grid">
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} onClick={e => e.stopPropagation()} className="w-full max-w-[440px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="text-[22px] font-bold tracking-tight text-white">Post your grid</h2><p className="mt-1 text-sm text-zinc-400">{runHeadline}, {stats.pct}% done, streak {stats.streak}.</p></div>
                  <button onClick={() => setShareOpen(false)} aria-label="Close" className="w-11 h-11 -mt-2 -mr-2 shrink-0 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={18} /></button>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button onClick={() => shareToX()} className={buttonClass('primary', 'md')}><Share2 size={15} /> X</button>
                  <button onClick={() => shareToWhatsApp()} className={buttonClass('secondary', 'md')}><MessageCircle size={15} /> WhatsApp</button>
                  <button onClick={() => downloadImage()} className={buttonClass('secondary', 'md')}><ImageDown size={15} /> PNG</button>
                  <button onClick={() => nativeShare()} className={buttonClass('ghost', 'md')}><MoreHorizontal size={15} /> More</button>
                </div>
                <p className="mt-4 text-[13px] leading-6 text-zinc-400">X and WhatsApp take text only, so the card downloads for you to attach.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirmReset && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} {...overlayProps(() => setConfirmReset(false))} className="fixed inset-0 z-50 grid place-items-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-zinc-950/80 backdrop-blur" role="dialog" aria-modal="true" aria-label="Reset your arc">
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} onClick={e => e.stopPropagation()} className="w-full max-w-[440px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-[22px] font-bold tracking-tight text-white">Reset your arc</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">This removes every check in this browser, not only the {stats.totalChecked} inside these dates. Nothing else holds a copy.</p>
                <label className="mt-4 flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 cursor-pointer">
                  <input type="checkbox" checked={backupBeforeReset} onChange={e => setBackupBeforeReset(e.target.checked)} className="mt-0.5 accent-white w-4 h-4" />
                  <span className="text-[13px] leading-5 text-zinc-300">Export a JSON copy first<span className="block text-zinc-500">Saves the file, then clears.</span></span>
                </label>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button onClick={() => setConfirmReset(false)} className={buttonClass('ghost', 'md')}>Keep my arc</button>
                  <button disabled={resetting} onClick={() => { setResetting(true); resetAll() }} className={buttonClass('danger', 'md')}>{resetting ? 'Resetting' : 'Reset everything'}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={null}>
          <AnimatePresence>{showOnboarding && <OnboardingDialog arc={arc} />}</AnimatePresence>
        </Suspense>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed right-5 z-40 w-11 h-11 rounded-full border border-zinc-800 bg-zinc-900/90 backdrop-blur text-zinc-300 grid place-items-center shadow-lg hover:bg-zinc-800 hover:text-white transition" style={{ bottom: showInstallHint && view === 'landing' ? 'calc(12rem + env(safe-area-inset-bottom))' : 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showInstallHint && view === 'landing' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px] z-40 rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur p-4 shadow-xl" style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300"><Smartphone size={15} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-white">Keep it on your home screen</div>
                  <div className="mt-0.5 text-[12px] leading-5 text-zinc-500">Works offline, still no account.</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={runInstall} className={buttonClass('primary', 'sm')}>{installEvent ? 'Install' : 'Show me how'}</button>
                    <button onClick={dismissInstallHint} className={buttonClass('ghost', 'sm')}>Not now</button>
                  </div>
                </div>
                <button onClick={dismissInstallHint} aria-label="Dismiss" className="w-11 h-11 shrink-0 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <canvas ref={canvasRef} className="hidden" aria-hidden />
        <AppFooter arc={arc} />
      </div>
    </MotionConfig>
  )
}
