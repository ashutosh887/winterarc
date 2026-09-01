import { ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Arc } from '@/hooks/useArc'
import { HabitIcon } from '@/components/app/HabitIcon'
import { PRESETS } from '@/lib/presets'
import { CARD, IconChip, Page, PageHeading, Section, buttonClass } from '@/components/app/Surface'
import { fadeUp, stagger } from '@/lib/motion'
import { templates } from '@/config'

export function Templates({ arc }: { arc: Arc }) {
  const { applyTemplate } = arc
  return (
    <Page>
      <PageHeading icon={BookOpen} eyebrow="Templates" title="Start from a template" subtitle="Pick one, then edit it in setup." />
      <Section>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => (
            <motion.div variants={fadeUp} key={t.id} className={`${CARD} p-5 sm:p-6 flex flex-col hover:border-zinc-700 transition`}>
              <div className="flex items-center gap-3">
                <IconChip>
                  <HabitIcon name={t.icon} size={16} />
                </IconChip>
                <h2 className="text-[15px] font-semibold text-white">{t.name}</h2>
              </div>
              <p className="mt-2 text-[14px] leading-6 text-zinc-400">{t.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 flex-1 content-start">
                {t.habitIds.map(hid => {
                  const h = PRESETS.find(p => p.id === hid)
                  return (
                    <span key={hid} className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800">
                      {h ? <><HabitIcon name={h.icon} size={11} /> {h.name}</> : hid}
                    </span>
                  )
                })}
              </div>
              <button onClick={() => applyTemplate(t.id)} className={buttonClass('primary', 'lg', 'mt-5')}>
                Use template <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </Page>
  )
}
