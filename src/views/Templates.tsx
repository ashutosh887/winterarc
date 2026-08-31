import { ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Arc } from '@/hooks/useArc'
import { HabitIcon } from '@/components/app/HabitIcon'
import { PRESETS } from '@/lib/presets'
import { PageHeading } from '@/components/app/Surface'
import { fadeUp, stagger } from '@/lib/motion'
import { templates } from '@/config'

export function Templates({ arc }: { arc: Arc }) {
  const { applyTemplate } = arc
  return (
          <main id="main">
            <section className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
              <PageHeading icon={BookOpen} eyebrow="Templates" title="Start from a template" subtitle="Pick one, then edit it in setup." />
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(t => (
                  <motion.div variants={fadeUp} key={t.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col hover:border-zinc-700 transition">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 grid place-items-center text-zinc-300"><HabitIcon name={t.icon} size={16} /></span>
                      <span className="text-[15px] font-semibold text-white">{t.name}</span>
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-zinc-500">{t.desc}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5 flex-1 content-start">
                      {t.habitIds.map(hid => {
                        const h = PRESETS.find(p => p.id === hid)
                        return <span key={hid} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{h ? <><HabitIcon name={h.icon} size={11} /> {h.name}</> : hid}</span>
                      })}
                    </div>
                    <button onClick={() => applyTemplate(t.id)} className="mt-4 inline-flex items-center gap-1.5 px-5 h-11 shrink-0 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition self-start">Use template <ArrowRight size={14} /></button>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </main>
  )
}
