import { ArrowRight, Snowflake } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Eyebrow } from '@/components/app/Surface'
import { site } from '@/config'

export function About({ arc }: { arc: Arc }) {
  const { goTo, longDate, setupWarmUp, startOnboarding, today, winterArc } = arc
  const midArc = today > winterArc.start && today <= winterArc.end
  return (
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <Eyebrow icon={Snowflake}>The idea</Eyebrow>
            <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">What a winter arc actually is</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500 max-w-[620px]">
              A winter arc is the stretch of the year most people write off. School is grinding, work is grinding, the weather is bad, and the plan quietly becomes January. The idea is to use that window instead of waiting it out.
            </p>

            <div className="mt-6 max-w-[620px] rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">The tagline</div>
              <p className="mt-2 text-[15px] font-semibold text-white">"{site.tagline}"</p>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                In plain English: work at your hardest and stay focused during the stretch when the people around you have eased off. To lock in is to commit completely and shut out distractions. To coast is to keep moving on leftover momentum without putting in effort. The end of the year is when most people coast, and that is exactly what makes it the cheapest time to get ahead.
              </p>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-[15px] font-semibold text-white">Why the end of the year</div>
                <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                  Nobody is watching in October. There is no new year energy to borrow and nobody to perform for, so the only thing keeping you going is the habit itself. That is the whole test. If you can hold it through the worst stretch, January is a formality.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-[15px] font-semibold text-white">Why a fixed window</div>
                <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                  An open ended habit has no finish line, so there is never a day you can point at. A fixed window gives you a start, an end, and a grid that fills in between. You either did it or you did not, and the grid remembers either way.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-[15px] font-semibold text-white">Why the dates are yours</div>
                <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                  October 1 to December 31 is what people mean by a winter arc, so that is the shape of it. It is a default, not a rule. Set any start and end date in setup and the grid, the streaks and the badges all follow your dates.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-[15px] font-semibold text-white">Why no streak insurance</div>
                <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                  Most trackers let you freeze a streak or repair a day. That turns the number into a score you protect rather than a record of what happened. Here a missed day stays red. You can backfill a day you forgot to log, because that is a record-keeping gap rather than a missed habit, and future days stay locked so nobody can pre-tick their way to a streak.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[15px] font-semibold text-white">You do not have to wait for the season</div>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500 max-w-[720px]">
                Deciding to start is the easy part. It wears off. Setup never hands you a date you have to sit and wait for. {setupWarmUp
                  ? `The arc is close, so setup offers a run from today to ${longDate(setupWarmUp.end)}, the day before it begins.`
                  : midArc
                    ? 'The arc is already running, so setup starts you today rather than on weeks of red days you never had a chance to log.'
                    : `The arc is too far off for a warm-up to bridge, so setup starts you today for 90 days. The winter arc is one tap away as a preset.`} You use that run to find out which habits you actually hold and which ones you picked because they sounded good.
              </p>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500 max-w-[720px]">
                When a warm-up ends, the tracker offers to roll you into the arc with the same habits and an empty grid. Set your own dates before warming up and those are the dates it hands back. Warm-up days are not deleted and not merged in. They stay in this browser and in both exports. They just stop counting toward the arc, so a rough first week of learning the tool does not sit in your record as a failed arc.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[15px] font-semibold text-white">How to not waste it</div>
              <ul className="mt-3 space-y-2 text-[13px] leading-6 text-zinc-500">
                <li>Pick fewer habits than you think you can hold. Three you never miss beats eight you miss half of.</li>
                <li>Make every habit answerable with yes or no. "Eat better" is not a habit, "no sugar" is.</li>
                <li>Commit to the floor. The gym habit is showing up, and the good session is a bonus.</li>
                <li>Missing one day is noise. Missing two in a row is the thing that ends arcs.</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={startOnboarding} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition">Start your arc <ArrowRight size={14} /></button>
              <button onClick={() => goTo('templates')} className="inline-flex items-center h-11 px-5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 text-sm hover:bg-zinc-800 hover:border-zinc-700 transition">See templates</button>
            </div>
          </main>
  )
}
