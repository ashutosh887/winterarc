import { ArrowRight, Check, Copy, RotateCw, Smartphone } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Card, CardText, CardTitle, PROSE, Page, PageHeading, Section, buttonClass } from '@/components/app/Surface'
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
          <Page>
            <PageHeading
              icon={Smartphone}
              eyebrow="Install"
              title="Put it on your home screen"
              subtitle="WinterArc installs like a native app. No browser chrome, works offline, and your data stays exactly where it already is."
            />

            <Section className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
              <button onClick={() => goTo('landing')} className="font-mono text-[13px] text-white underline decoration-zinc-700 hover:decoration-zinc-400 px-2 h-11">{site.domain.replace('https://', '')}</button>
              <button onClick={copyLink} className={buttonClass('ghost', 'sm', 'ml-auto')}>
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy link</>}
              </button>
            </Section>

            <Section className="mt-4">
              <Card>
              {installed ? (
                <>
                  <CardTitle className="flex items-center gap-2"><Check size={15} /> WinterArc is installed</CardTitle>
                  <CardText>Open it from your home screen or app list. Your arc is already in there.</CardText>
                </>
              ) : (
                <>
                  <CardTitle>{installEvent ? 'Install it now' : 'Add it yourself'}</CardTitle>
                  <CardText className={PROSE}>{status}</CardText>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {installEvent ? (
                      <button onClick={runInstall} className={buttonClass('primary', 'lg')}>
                        Install now <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button onClick={showSteps} className={buttonClass('primary', 'lg')}>
                        Show me the steps <ArrowRight size={14} />
                      </button>
                    )}
                    {declined && (
                      <button onClick={() => window.location.reload()} className={buttonClass('ghost', 'sm')}>
                        <RotateCw size={13} /> Reload and try again
                      </button>
                    )}
                  </div>
                </>
              )}
              </Card>
            </Section>

            <Section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map(p => (
                <div key={p.id} id={`install-${p.id}`} className={`rounded-2xl border bg-zinc-900 p-5 sm:p-6 flex flex-col scroll-mt-24 ${p.id === platform ? 'border-zinc-700' : 'border-zinc-800'}`}>
                  <div className="flex items-center gap-2">
                    <CardTitle>{p.title}</CardTitle>
                    {p.id === platform && <span className="ml-auto shrink-0 rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300">Your device</span>}
                  </div>
                  <CardText>{p.note}</CardText>
                  <ol className="mt-4 mb-auto space-y-3">
                    {p.steps.map((step, i) => (
                      <li key={step} className="flex gap-3 text-[14px] leading-6 text-zinc-300">
                        <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full border border-zinc-700 bg-zinc-950 grid place-items-center text-[11px] font-mono text-zinc-400 tabular-nums">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </Section>

            <Section>
              <Card>
              <CardTitle>What you should know on iOS</CardTitle>
              <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px] leading-6 text-zinc-400 list-disc pl-5 marker:text-zinc-600">
                <li>Apple only lets Safari add a web app to the home screen, so that step cannot be skipped.</li>
                <li>The installed copy keeps its own storage. If you set up your arc in Safari first, it carries over. If you set it up somewhere else, it does not.</li>
                <li>Storage is capped lower than a native app. A whole arc is a few kilobytes, so you will not hit it.</li>
                <li>Reminders need iOS 16.4 or later, and on an iPhone they only work once WinterArc is on your home screen. Set them on the tracker.</li>
              </ul>
              </Card>
            </Section>
          </Page>
  )
}
