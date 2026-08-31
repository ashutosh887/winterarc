import { ArrowRight, Snowflake } from 'lucide-react'
import type { Arc } from '@/hooks/useArc'
import { Eyebrow } from '@/components/app/Surface'
import { site } from '@/config'

export function About({ arc }: { arc: Arc }) {
  const { goTo, startOnboarding } = arc
  return (
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <Eyebrow icon={Snowflake}>The idea</Eyebrow>
            <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">What a winter arc actually is</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500 max-w-[620px]">
              A winter arc is the stretch of the year most people write off. School is grinding, work is grinding, the weather is bad, and the plan quietly becomes January. The idea is to use that window instead of waiting it out.
            </p>

            <div className="mt-6 max-w-[620px] rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-[11px] font-mono tracking-widest text-zinc-500">The tagline</div>
              <p className="mt-2 text-[15px] font-semibold text-white">&ldquo;{site.tagline}&rdquo;</p>
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
                  The default is October 1 to December 31 because that is what people mean by a winter arc. It is a default, not a rule. Set any start and end date in setup and the grid, the streaks and the badges all follow your dates.
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
