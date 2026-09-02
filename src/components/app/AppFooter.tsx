import { site } from '@/config'
import { Logo } from '@/components/app/Ring'
import type { Arc } from '@/hooks/useArc'

export function AppFooter({ arc }: { arc: Arc }) {
  const { goTo } = arc
  return (
    <footer className="border-t border-zinc-800 mt-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <button onClick={() => goTo('landing')} className="flex items-center min-h-11 gap-2.5">
              <Logo size={22} />
              <span className="font-semibold tracking-[0.16em] text-[12px] text-white">WINTERARC</span>
            </button>
            <p className="mt-3 text-[13px] leading-6 text-zinc-500 max-w-[280px]">Set your dates and keep the grid honest.</p>
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-zinc-500">Product</div>
            <div className="mt-2 flex flex-col items-stretch">
              <button onClick={() => goTo('about')} className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">What is a winter arc</button>
              <button onClick={() => goTo('templates')} className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">Templates</button>
              <button onClick={() => goTo('resources')} className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">Resources</button>
              <button onClick={() => goTo('install')} className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">Install as app</button>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-zinc-500">Project</div>
            <div className="mt-2 flex flex-col items-stretch">
              <a href={site.support.github} target="_blank" rel="noreferrer" className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">GitHub</a>
              <a href={site.support.github + '/blob/main/CONTRIBUTING.md'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">Contribute</a>
              <button onClick={() => goTo('feedback')} className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">Feedback</button>
              <a href="https://x.com/ashutosh887_" target="_blank" rel="noreferrer" className="inline-flex items-center justify-start w-full min-h-11 px-3 -mx-3 rounded-lg text-[13px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition">X</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] font-mono text-zinc-500">
          <span>&copy; {new Date().getFullYear()} {site.author.name}. MIT licensed.</span>
          <span>v{import.meta.env.VITE_APP_VERSION}</span>
          <span>Local-first. No account.</span>
        </div>
      </div>
    </footer>
  )
}
