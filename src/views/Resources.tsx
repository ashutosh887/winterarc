import { Compass, ExternalLink, Star } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Card, CardTitle, Page, PageHeading, Section } from '@/components/app/Surface'
import { resources } from '@/config'

export function Resources({ arc }: { arc: Arc }) {
  const { hasData, quote, quoteCredit, runLabel, stats } = arc
  return (
    <Page>
      <PageHeading icon={Compass} eyebrow="Resources" title="Tools worth using" subtitle="Everything here is usable without paying. No affiliate links." />
      <Section className="space-y-4">
        {Object.entries(resources).map(([key, cat]) => (
          <Card key={key}>
            <CardTitle>{cat.title}</CardTitle>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {cat.items.map(it => (
                <a
                  key={it.name}
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 min-h-11 hover:border-zinc-700 transition block group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{it.name}</span>
                    <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400 transition" />
                  </div>
                  <div className="mt-1 text-[13px] leading-5 text-zinc-500">{it.desc}</div>
                </a>
              ))}
            </div>
          </Card>
        ))}
      </Section>
      <Section>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2"><Star size={14} /> Quote of the day</CardTitle>
            <span className="text-[11px] font-mono text-zinc-500 shrink-0">{hasData ? `${runLabel} ${stats.dayNum}` : 'Today'}</span>
          </div>
          <blockquote className="mt-4 text-[17px] leading-7 text-zinc-200">
            {quote.text}
            <cite className="mt-2 block not-italic text-[13px] text-zinc-500">{quoteCredit}</cite>
          </blockquote>
        </Card>
      </Section>
    </Page>
  )
}
