import { ArrowRight, Snowflake } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Card, CardText, CardTitle, Page, PageHeading, Section, buttonClass } from '@/components/app/Surface'
import { site } from '@/config'

export function About({ arc }: { arc: Arc }) {
  const { goTo, longDate, setupWarmUp, startOnboarding, today, winterArc } = arc
  const midArc = today > winterArc.start && today <= winterArc.end

  const warmUpLine = setupWarmUp
    ? `The arc is close, so setup offers a run from today to ${longDate(setupWarmUp.end)}, the day before it begins.`
    : midArc
      ? 'The arc is already running, so setup starts you today rather than on weeks of red days you never had a chance to log.'
      : 'The arc is too far off for a warm-up to bridge, so setup starts you today for 90 days. The winter arc is one tap away as a preset.'

  const sections = [
    {
      id: 'october',
      title: 'Why the end of the year',
      body: 'Nobody is watching in October. There is no new year energy to borrow and nobody to perform for, so the only thing keeping you going is the habit itself. That is the whole test. If you can hold it through the worst stretch, January is a formality.',
    },
    {
      id: 'window',
      title: 'Why a fixed window',
      body: 'An open ended habit has no finish line, so there is never a day you can point at. A fixed window gives you a start, an end, and a grid that fills in between. You either did it or you did not, and the grid remembers either way.',
    },
    {
      id: 'dates',
      title: 'Why the dates are yours',
      body: 'October 1 to December 31 is what people mean by a winter arc, so that is the shape of it. It is a default, not a rule. Set any start and end date in setup and the grid, the streaks and the badges all follow your dates.',
    },
    {
      id: 'insurance',
      title: 'Why no streak insurance',
      body: 'Most trackers let you freeze a streak or repair a day. That turns the number into a score you protect rather than a record of what happened. Here a missed day stays red. You can backfill a day you forgot to log, because that is a record-keeping gap rather than a missed habit, and future days stay locked so nobody can pre-tick their way to a streak.',
    },
    {
      id: 'wait',
      title: 'You do not have to wait for the season',
      body: `Deciding to start is the easy part. It wears off. Setup never hands you a date you have to sit and wait for. ${warmUpLine} You use that run to find out which habits you actually hold and which ones you picked because they sounded good.`,
      extra: 'When a warm-up ends, the tracker offers to roll you into the arc with the same habits and an empty grid. Set your own dates before warming up and those are the dates it hands back. Warm-up days are not deleted and not merged in. They stay in this browser and in both exports. They just stop counting toward the arc, so a rough first week of learning the tool does not sit in your record as a failed arc.',
    },
  ]

  const rules = [
    'Pick fewer habits than you think you can hold. Three you never miss beats eight you miss half of.',
    'Make every habit answerable with yes or no. "Eat better" is not a habit, "no sugar" is.',
    'Commit to the floor. The gym habit is showing up, and the good session is a bonus.',
    'Missing one day is noise. Missing two in a row is the thing that ends arcs.',
  ]

  return (
    <Page>
      <PageHeading
        icon={Snowflake}
        eyebrow="The idea"
        title="What a winter arc actually is"
        subtitle="The stretch of the year most people write off. School is grinding, work is grinding, the weather is bad, and the plan quietly becomes January. The idea is to use that window instead of waiting it out."
      />

      <Section>
        <Card className="grid sm:grid-cols-2 gap-x-8 gap-y-3 items-start">
          <div>
            <CardTitle className="text-[11px] font-mono tracking-widest text-zinc-500 font-normal">The tagline</CardTitle>
            <p className="mt-2 text-[20px] sm:text-[24px] leading-tight font-semibold text-white">"{site.tagline}"</p>
          </div>
          <p className="text-[14px] leading-6 text-zinc-400">
            Work at your hardest and stay focused during the stretch when the people around you have eased off. To lock in is to commit completely and shut out distractions. To coast is to keep moving on leftover momentum. The end of the year is when most people coast, and that is what makes it the cheapest time to get ahead.
          </p>
        </Card>
      </Section>

      <Section>
        <h2 className="text-[11px] font-mono tracking-widest text-zinc-500">The reasoning</h2>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          {sections.map(s => (
            <Card key={s.id} className={s.extra ? 'sm:col-span-2' : undefined}>
              <CardTitle>{s.title}</CardTitle>
              {s.extra
                ? (
                  <div className="mt-2 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    <p className="text-[14px] leading-6 text-zinc-400">{s.body}</p>
                    <p className="text-[14px] leading-6 text-zinc-400">{s.extra}</p>
                  </div>
                )
                : <CardText>{s.body}</CardText>}
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card>
          <CardTitle>How to not waste it</CardTitle>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {rules.map((r, i) => (
              <li key={r} className="flex gap-3 text-[14px] leading-6 text-zinc-400">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-[11px] font-mono text-zinc-400 tabular-nums">{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:max-w-[420px]">
        <button onClick={startOnboarding} className={buttonClass('primary', 'lg')}>
          Start your arc <ArrowRight size={14} />
        </button>
        <button onClick={() => goTo('templates')} className={buttonClass('ghost', 'lg')}>
          See templates
        </button>
      </Section>
    </Page>
  )
}
