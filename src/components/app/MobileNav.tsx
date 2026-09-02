import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { buttonClass } from '@/components/app/Surface'
import type { Arc } from '@/hooks/useArc'

export function MobileNav({ arc }: { arc: Arc }) {
  const { mobileMenuOpen, navLinks, setMobileMenuOpen, stars } = arc
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-20 bg-zinc-950/60 backdrop-blur-sm"
            style={{ top: 'calc(3.5rem + env(safe-area-inset-top))' }}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden fixed z-30 bg-zinc-950 border-b border-zinc-800 shadow-2xl left-0 right-0"
            style={{ top: 'calc(3.5rem + env(safe-area-inset-top))' }}
          >
            <div className="max-w-[1040px] mx-auto px-5 sm:px-6 py-3 grid grid-cols-2 gap-2">
              {navLinks.map(l => (
                <button
                  key={l.label}
                  onClick={l.onClick}
                  className={`h-11 px-4 rounded-full text-sm font-medium border transition ${l.active ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-200 border-zinc-800'}`}
                >
                  {l.label}
                </button>
              ))}
              <a href="https://github.com/ashutosh887/winterarc" target="_blank" rel="noreferrer" className={buttonClass('ghost', 'md', 'col-span-2')}>
                <Star size={14} /> Star on GitHub {stars !== null && `(${stars})`}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
