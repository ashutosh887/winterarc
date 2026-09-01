import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type IconComponent = ComponentType<{ size?: number; className?: string }>

export const SHELL = 'max-w-[1040px] mx-auto px-5 sm:px-6'
export const PROSE = 'max-w-[620px]'
export const CARD = 'rounded-2xl border border-zinc-800 bg-zinc-900'
export const INSET = 'rounded-xl border border-zinc-800 bg-zinc-950'

export function Eyebrow({ icon: Icon, className, children }: {
  icon?: IconComponent
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500', className)}>
      {Icon ? <Icon size={12} /> : null}
      {children}
    </div>
  )
}

export function Page({ app = false, className, children }: {
  app?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <main id="main" className={cn(SHELL, app ? 'py-8' : 'py-10 sm:py-14', className)}>
      {children}
    </main>
  )
}

export function PageHeading({ icon, eyebrow, title, subtitle, actions }: {
  icon?: IconComponent
  eyebrow?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        {eyebrow ? <Eyebrow icon={icon}>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-2 text-[24px] sm:text-[30px] font-bold tracking-[-0.02em] text-white text-balance">{title}</h1>
        {subtitle ? <p className={cn('mt-2 text-sm leading-6 text-zinc-400', PROSE)}>{subtitle}</p> : null}
      </div>
      {actions}
    </header>
  )
}

export function Section({ className, children }: { className?: string; children?: ReactNode }) {
  return <section className={cn('mt-8', className)}>{children}</section>
}

export function Card({ inset = false, className, children }: {
  inset?: boolean
  className?: string
  children?: ReactNode
}) {
  return <div className={cn(inset ? INSET : CARD, inset ? 'p-4' : 'p-5 sm:p-6', className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children?: ReactNode }) {
  return <h2 className={cn('text-[15px] font-semibold text-white', className)}>{children}</h2>
}

export function CardText({ className, children }: { className?: string; children?: ReactNode }) {
  return <p className={cn('mt-2 text-[14px] leading-6 text-zinc-400', className)}>{children}</p>
}

export function CardNote({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn('mt-4 text-[11px] font-mono text-zinc-500', className)}>{children}</div>
}

export function IconChip({ icon: Icon, size = 36, active = false, className, children }: {
  icon?: IconComponent
  size?: number
  active?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        'shrink-0 rounded-full grid place-items-center border',
        active ? 'bg-white border-white text-zinc-900' : 'bg-zinc-800 border-zinc-700 text-zinc-300',
        className,
      )}
    >
      {Icon ? <Icon size={Math.round(size * 0.42)} /> : children}
    </span>
  )
}
