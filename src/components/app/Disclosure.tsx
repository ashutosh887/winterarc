import { useId, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Disclosure({ open, onToggle, title, lead, className, children }: {
  open: boolean
  onToggle: () => void
  title?: ReactNode
  lead?: ReactNode
  className?: string
  children?: ReactNode
}) {
  const panelId = useId()
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full min-h-11 flex items-center gap-2 text-left"
      >
        {lead}
        <span className="text-[15px] font-semibold text-white">{title}</span>
        <ChevronDown
          size={16}
          className={cn('ml-auto shrink-0 text-zinc-500 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div id={panelId} className="mt-3">
          {children}
        </div>
      ) : null}
    </div>
  )
}
