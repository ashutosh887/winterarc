import { ArrowRight, Check, Copy, RotateCw, Smartphone } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Eyebrow } from '@/components/app/Surface'
import { site } from '@/config'

type Platform = 'ios' | 'android' | 'desktop'

/** iPadOS reports itself as a Mac, so touch points are what separate the two. */
function detectPlatform(): Platform {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

const PLATFORMS: { id: Platform; title: string; note: string; steps: string[] }[] = [
  {
    id: 'ios',
    title: 'iPhone and iPad',
    note: 'Safari only. Chrome and in-app browsers cannot install it.',
    steps: ['Open the site in Safari', 'Tap the Share button in the toolbar', 'Scroll down and tap Add to home screen', 'Tap Add'],
  },
  {
    id: 'android',
    title: 'Android',
    note: 'Chrome, Edge, Samsung Internet and Brave all work.',
    steps: ['Open the site in Chrome', 'Tap the three dot menu', 'Tap Install app or Add to home screen', 'Confirm'],
  },
  {
    id: 'desktop',
    title: 'Desktop',
    note: 'Chrome, Edge and Brave. Safari on Mac uses Add to Dock.',
    steps: ['Open the site', 'Click the install icon at the right of the address bar', 'Click Install'],
  },
]

export function Install({ arc }: { arc: Arc }) {
  const { copied, copyLink, goTo, installEvent, installed, installOutcome, runInstall } = arc
  const platform = detectPlatform()
  const declined = installOutcome === 'dismissed' && !installEvent

  const status = installEvent
    ? 'Your browser can add it in one tap. Nothing you have already saved moves or changes.'
    : declined
      ? 'You closed the install prompt. Reload the page to bring it back, or follow the steps for your device.'
      : platform === 'ios'
        ? 'Safari installs from the Share menu, so there is no button for it here. The steps are below.'
        : 'Your browser has not offered an install prompt on this page. The steps below cover every browser that can do it.'

  function showSteps() {
    document.getElementById(`install-${platform}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <Eyebrow icon={Smartphone}>Install</Eyebrow>
            <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Put it on your home screen</h1>
            <p className="mt-1.5 text-sm text-zinc-500 max-w-[560px]">WinterArc installs like a native app. No browser chrome, works offline, and your data stays exactly where it already is.</p>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
              <button onClick={() => goTo('landing')} className="font-mono text-[13px] text-white underline decoration-zinc-700 hover:decoration-zinc-400 px-2 h-11">{site.domain.replace('https://', '')}</button>
              <button onClick={copyLink} className="ml-auto inline-flex items-center gap-1.5 h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy link</>}
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              {installed ? (
                <>
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-white"><Check size={15} /> WinterArc is installed</div>
                  <p className="mt-1 text-[13px] leading-5 text-zinc-500">Open it from your home screen or app list. Your arc is already in there.</p>
                </>
              ) : (
                <>
                  <div className="text-[15px] font-semibold text-white">{installEvent ? 'Install it now' : 'Add it yourself'}</div>
                  <p className="mt-1 text-[13px] leading-5 text-zinc-500 max-w-[560px]">{status}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {installEvent ? (
                      <button onClick={runInstall} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition">
                        Install now <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button onClick={showSteps} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition">
                        Show me the steps <ArrowRight size={14} />
                      </button>
                    )}
                    {declined && (
                      <button onClick={() => window.location.reload()} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-[13px] hover:text-white hover:border-zinc-700 transition">
                        <RotateCw size={13} /> Reload and try again
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {PLATFORMS.map(p => (
                <div key={p.id} id={`install-${p.id}`} className={`rounded-2xl border bg-zinc-900 p-5 flex flex-col scroll-mt-24 ${p.id === platform ? 'border-zinc-700' : 'border-zinc-800'}`}>
                  <div className="flex items-center gap-2">
                    <div className="text-[15px] font-semibold text-white">{p.title}</div>
                    {p.id === platform && <span className="ml-auto shrink-0 rounded-full border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-400">Your device</span>}
                  </div>
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
                <li>Storage is capped lower than a native app. A whole arc is a few kilobytes, so you will not hit it.</li>
                <li>Notifications need iOS 16.4 or later and only work after you add it to the home screen. WinterArc does not send any yet.</li>
              </ul>
            </div>
          </main>
  )
}
