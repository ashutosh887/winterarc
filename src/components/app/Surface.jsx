import { cn } from '@/lib/utils'

export function Eyebrow({ icon: Icon, className, children }) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500', className)}>
      {Icon ? <Icon size={12} /> : null}
      {children}
    </div>
  )
}

export function PageHeading({ icon, eyebrow, title, subtitle }) {
  return (
    <header>
      {eyebrow ? <Eyebrow icon={icon}>{eyebrow}</Eyebrow> : null}
      <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">{title}</h1>
      {subtitle ? <p className="mt-1.5 text-sm text-zinc-500">{subtitle}</p> : null}
    </header>
  )
}

export function IconChip({ icon: Icon, size = 36, active = false, className, children }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        'shrink-0 rounded-full grid place-items-center border',
        active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300',
        className,
      )}
    >
      {Icon ? <Icon size={Math.round(size * 0.42)} /> : children}
    </span>
  )
}
