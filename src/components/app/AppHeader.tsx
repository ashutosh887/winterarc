import { ArrowRight, Menu, Pencil, Star, X } from 'lucide-react'
import { site } from '@/config'
import { Logo } from '@/components/app/Ring'
import { buttonClass } from '@/components/app/Surface'
import type { Arc } from '@/hooks/useArc'

export function AppHeader({ arc }: { arc: Arc }) {
  const { goTo, hasData, loadStars, mobileMenuOpen, navLinks, setMobileMenuOpen, stars, startOnboarding } = arc
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 pt-[env(safe-area-inset-top)]">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-3">
        <button onClick={() => goTo('landing')} aria-label="WinterArc home" className="flex self-stretch items-center gap-2.5 shrink-0">
          <Logo size={26} />
          <span className="font-semibold tracking-[0.16em] text-[13px] text-white">WINTERARC</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden lg:flex items-center gap-0.5 lg:mr-2 lg:pr-3 lg:border-r lg:border-zinc-800">
            {navLinks.map(l => (
              <button key={l.label} onClick={l.onClick} className={`h-11 px-3 rounded-full text-[13px] font-medium transition ${l.active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}>
                {l.label}
              </button>
            ))}
          </nav>
          <a href={site.support.github} target="_blank" rel="noopener noreferrer" onPointerEnter={loadStars} onFocus={loadStars} aria-label="Star WinterArc on GitHub" className={buttonClass('ghost', 'sm', 'hidden sm:inline-flex')}>
            <Star size={13} /> {stars === null ? 'Star' : stars.toLocaleString()}
          </a>
          <button onClick={startOnboarding} className={buttonClass('primary', 'sm')}>
            <span className="sm:hidden">{hasData ? 'Edit' : 'Set up'}</span>
            <span className="hidden sm:inline">{hasData ? 'Edit arc' : 'Set up your arc'}</span>
            {hasData ? <Pencil size={14} /> : <ArrowRight size={14} />}
          </button>
          <button onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu" aria-expanded={mobileMenuOpen} className="lg:hidden shrink-0 w-11 h-11 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition">
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
