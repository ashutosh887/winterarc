import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import {
  ArrowRight, ArrowUp, ImageDown, Menu, MessageCircle, MoreHorizontal, Pencil, Share2, Smartphone, Snowflake, Star, X,
} from 'lucide-react'
import { site } from '@/config'
import { addDays } from '@/lib/date'
import { Button } from '@/components/ui/button'
import { useArc } from '@/hooks/useArc'
import { Logo } from '@/components/app/Ring'
import { OnboardingDialog } from '@/components/app/OnboardingDialog'
import { About } from '@/views/About'
import { Dashboard } from '@/views/Dashboard'
import { Feedback } from '@/views/Feedback'
import { Install } from '@/views/Install'
import { Landing } from '@/views/Landing'
import { Resources } from '@/views/Resources'
import { Templates } from '@/views/Templates'
import { Tracker } from '@/views/Tracker'


export default function App() {
  const arc = useArc()
  const {
    backupBeforeReset,
    canvasRef,
    confirmReset,
    dayPct,
    dismissInstallHint,
    downloadImage,
    effectiveHabits,
    end,
    entries,
    entriesBroken,
    goTo,
    hasData,
    installEvent,
    loadStars,
    mobileMenuOpen,
    nativeShare,
    navLinks,
    overlayProps,
    quote,
    resetAll,
    resetting,
    runInstall,
    selectedDate,
    setBackupBeforeReset,
    setConfirmReset,
    setMobileMenuOpen,
    setResetting,
    setSelectedDate,
    setShareOpen,
    shareOpen,
    shareToWhatsApp,
    shareToX,
    showInstallHint,
    showOnboarding,
    showScrollTop,
    stars,
    start,
    startOnboarding,
    stats,
    totalDays,
    view,
  } = arc
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-[100dvh] bg-zinc-950">
      {entriesBroken && (
        <div role="alert" className="bg-red-500/10 border-b border-red-500/20 px-5 py-2.5 text-center text-[13px] text-red-200">
          This browser is blocking storage, so nothing you check here will be saved. Private windows and blocked cookies both cause this.
        </div>
      )}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800 pt-[env(safe-area-inset-top)]">
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button onClick={() => goTo('landing')} aria-label="WinterArc home" className="flex self-stretch items-center gap-2.5 shrink-0">
            <Logo size={26} />
            <span className="font-semibold tracking-[0.16em] text-[13px] text-white">WINTERARC</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden lg:flex items-center gap-0.5 lg:mr-2 lg:pr-3 lg:border-r lg:border-zinc-800">
              {navLinks.map(l => (
                <button
                  key={l.label}
                  onClick={l.onClick}
                  className={`h-11 px-3 rounded-full text-[13px] font-medium transition ${l.active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <a href={site.support.github} target="_blank" rel="noopener noreferrer" onPointerEnter={loadStars} onFocus={loadStars} aria-label="Star WinterArc on GitHub" className="hidden sm:inline-flex items-center gap-1.5 h-11 px-3 rounded-full border border-zinc-800 bg-zinc-900 text-[13px] font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition">
              <Star size={13} /> {stars === null ? 'Star' : stars.toLocaleString()}
            </a>

            <button onClick={startOnboarding} className="inline-flex shrink-0 items-center gap-1.5 h-11 px-4 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-[13px] transition whitespace-nowrap">
              <span className="sm:hidden">{hasData ? 'Edit' : 'Set up'}</span>
              <span className="hidden sm:inline">{hasData ? 'Edit arc' : 'Set up your arc'}</span>
              {hasData ? <Pencil size={14} /> : <ArrowRight size={14} />}
            </button>

            <button onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu" aria-expanded={mobileMenuOpen} className="lg:hidden shrink-0 w-11 h-11 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
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
        <div className={`sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 lg:z-20 bg-zinc-950/95 backdrop-blur-xl ${mobileMenuOpen ? 'lg:relative' : ''}`}>
          <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-3">
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 flex items-center gap-3">
            <span className="w-7 h-7 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-400"><Snowflake size={13} /></span>
            <span className="min-w-0 text-sm text-zinc-400 line-clamp-2 sm:truncate">
              {quote.text} <span className="text-zinc-500">&mdash; {quote.author}</span>
            </span>
            <span className="ml-auto hidden sm:inline shrink-0 text-[11px] font-mono text-zinc-500 tabular-nums">Day {stats.dayNum} / {totalDays} · {dayPct}%</span>
          </motion.div>
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

      {view === 'landing' && <Landing arc={arc} />}

      {view === 'templates' && <Templates arc={arc} />}

      {view === 'resources' && <Resources arc={arc} />}

      {view === 'about' && <About arc={arc} />}

      {view === 'install' && <Install arc={arc} />}

      {view === 'feedback' && <Feedback />}

      {(view === 'tracker' || view === 'dashboard') && !hasData && (
        <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-white grid place-items-center mx-auto"><ArrowRight size={18} /></div>
            <h1 className="mt-4 text-[22px] font-bold tracking-tight text-white">No arc yet</h1>
            <p className="mt-2 text-sm text-zinc-500">Start your arc to see the tracker. It takes 30 seconds.</p>
            <Button onClick={startOnboarding} className="mt-6 h-11 px-5">Start your arc <ArrowRight size={14} /></Button>
          </div>
        </main>
      )}

      {view === 'tracker' && hasData && <Tracker arc={arc} />}


      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            {...overlayProps(() => setShareOpen(false))}
            className="fixed inset-0 z-50 grid place-items-center p-4 bg-zinc-950/80 backdrop-blur-xl"
            role="dialog" aria-modal="true" aria-label="Share your grid"
          >
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} onClick={e => e.stopPropagation()} className="w-full max-w-[440px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[22px] font-bold tracking-tight text-white">Post your grid</h2>
                  <p className="mt-1 text-sm text-zinc-400">Day {stats.dayNum} of {totalDays}, {stats.pct}% done, streak {stats.streak}.</p>
                </div>
                <button onClick={() => setShareOpen(false)} aria-label="Close" className="w-11 h-11 -mt-2 -mr-2 shrink-0 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={18} /></button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => shareToX()} className="h-11 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition inline-flex items-center justify-center gap-1.5"><Share2 size={15} /> X</button>
                <button onClick={() => shareToWhatsApp()} className="h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition inline-flex items-center justify-center gap-1.5"><MessageCircle size={15} /> WhatsApp</button>
                <button onClick={() => downloadImage()} className="h-11 rounded-full bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition inline-flex items-center justify-center gap-1.5"><ImageDown size={15} /> PNG</button>
                <button onClick={() => nativeShare()} className="h-11 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm hover:text-white hover:border-zinc-700 transition inline-flex items-center justify-center gap-1.5"><MoreHorizontal size={15} /> More</button>
              </div>
              <p className="mt-4 text-[13px] leading-6 text-zinc-400">X and WhatsApp take text only, so the card downloads for you to attach. More sends the image itself.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            {...overlayProps(() => setConfirmReset(false))}
            className="fixed inset-0 z-50 grid place-items-center p-4 bg-zinc-950/80 backdrop-blur-xl"
            role="dialog" aria-modal="true" aria-label="Reset your arc"
          >
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} onClick={e => e.stopPropagation()} className="w-full max-w-[440px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-[22px] font-bold tracking-tight text-white">Reset your arc</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                This removes {stats.totalChecked} checks across {stats.dayNum} days. It lives only in this browser, so once it is gone there is nothing to restore it from.
              </p>
              <label className="mt-4 flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 cursor-pointer">
                <input type="checkbox" checked={backupBeforeReset} onChange={e => setBackupBeforeReset(e.target.checked)} className="mt-0.5 accent-white w-4 h-4" />
                <span className="text-[13px] leading-5 text-zinc-300">Export a JSON copy first<span className="block text-zinc-500">Saves the file, then clears. There is no import yet, so it will not load back in.</span></span>
              </label>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => setConfirmReset(false)} className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-sm hover:text-white hover:border-zinc-700 transition">Keep my arc</button>
                <button disabled={resetting} onClick={() => { setResetting(true); resetAll() }} className="h-11 px-4 rounded-full bg-red-500/15 border border-red-500/25 text-red-200 text-sm font-semibold hover:bg-red-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed">{resetting ? 'Resetting' : 'Reset everything'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'dashboard' && hasData && <Dashboard arc={arc} />}

      <AnimatePresence>
      {showOnboarding && <OnboardingDialog arc={arc} />}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed right-5 z-40 w-11 h-11 rounded-full border border-zinc-800 bg-zinc-900/90 backdrop-blur text-zinc-300 grid place-items-center shadow-lg hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition" style={{ bottom: showInstallHint && view === 'landing' ? 'calc(12rem + env(safe-area-inset-bottom))' : 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
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
                <div className="mt-0.5 text-[12px] leading-5 text-zinc-500">Works offline, still no account.</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={runInstall} className="h-11 px-4 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">
                    {installEvent ? 'Install' : 'Show me how'}
                  </button>
                  <button onClick={dismissInstallHint} className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-[13px] hover:text-white hover:border-zinc-700 transition">Not now</button>
                </div>
              </div>
              <button onClick={dismissInstallHint} aria-label="Dismiss" className="w-11 h-11 shrink-0 grid place-items-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" aria-hidden />

      <footer className="border-t border-zinc-800 mt-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <button onClick={() => goTo('landing')} className="flex items-center min-h-11 gap-2.5">
                <Logo size={22} />
                <span className="font-semibold tracking-[0.16em] text-[12px] text-white">WINTERARC</span>
              </button>
              <p className="mt-3 text-[13px] leading-6 text-zinc-500 max-w-[280px]">
                Set your dates and keep the grid honest.
              </p>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Product</div>
              <div className="mt-3 flex flex-col items-start gap-1">
                <button onClick={() => goTo('about')} className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">What is a winter arc</button>
                <button onClick={() => goTo('templates')} className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">Templates</button>
                <button onClick={() => goTo('resources')} className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">Resources</button>
                <button onClick={() => goTo('install')} className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">Install as app</button>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">Project</div>
              <div className="mt-3 flex flex-col items-start gap-1">
                <a href={site.support.github} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">GitHub</a>
                <a href={site.support.github + '/blob/main/CONTRIBUTING.md'} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">Contribute</a>
                <button onClick={() => goTo('feedback')} className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">Feedback</button>
                <a href="https://x.com/ashutosh887_" target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 text-[13px] text-zinc-400 hover:text-white transition">X</a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] font-mono text-zinc-500">
            <span>&copy; {new Date().getFullYear()} {site.author.name}. MIT licensed.</span>
            <span>Local-first. No account. Your habits never leave the device.</span>
          </div>
        </div>
      </footer>
    </div>
    </MotionConfig>
  )
}
