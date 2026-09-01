import { Compass, ExternalLink, Star } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { PageHeading } from '@/components/app/Surface'
import { resources } from '@/config'

export function Resources({ arc }: { arc: Arc }) {
  const { hasData, quote, quoteCredit, runLabel, stats } = arc
  return (
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <PageHeading icon={Compass} eyebrow="Resources" title="Tools worth using" subtitle="Everything here is usable without paying. No affiliate links." />
            <div className="mt-8 space-y-6">
              {Object.entries(resources).map(([key, cat]) => (
                <div key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <div className="text-[15px] font-semibold text-white">{cat.title}</div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {cat.items.map(it => (
                      <a key={it.name} href={it.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700 transition block group">
                        <div className="flex items-center gap-2"><span className="text-sm font-medium text-white group-hover:text-zinc-200 transition">{it.name}</span><ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" /></div>
                        <div className="text-xs text-zinc-500 mt-1">{it.desc}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2"><Star size={14} /> Quote of the day</h2>
                <span className="text-xs font-mono text-zinc-500">{hasData ? `${runLabel} ${stats.dayNum}` : 'Today'}</span>
              </div>
              <blockquote className="mt-3 text-[15px] leading-6 text-zinc-200">
                {quote.text}
                <cite className="mt-2 block not-italic text-[13px] text-zinc-500">&mdash; {quoteCredit}</cite>
              </blockquote>
            </div>
          </main>
  )
}
