import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HabitTile({ icon, name, desc, selected, onToggle, onRemove }) {
  return (
    <div
      className={cn(
        'relative rounded-xl border transition',
        selected ? 'bg-white border-white' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className="w-full text-left p-3 flex gap-3 items-start"
      >
        <span
          className={cn(
            'w-8 h-8 rounded-full grid place-items-center border shrink-0',
            selected ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300',
          )}
        >
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span title={name} className={cn('text-sm font-medium block truncate', selected ? 'text-zinc-900' : 'text-zinc-200')}>
            {name}
          </span>
          {desc ? (
            <span className={cn('text-xs block truncate', selected ? 'text-zinc-600' : 'text-zinc-500')}>{desc}</span>
          ) : null}
        </span>
        <span
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full grid place-items-center border shrink-0',
            selected ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-700 text-transparent',
            onRemove && 'mr-11',
          )}
        >
          <Check size={12} />
        </span>
      </button>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          title={`Remove ${name}`}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 right-1 w-11 h-11 grid place-items-center rounded-full transition',
            selected ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200' : 'text-zinc-600 hover:text-white hover:bg-zinc-800',
          )}
        >
          <X size={13} />
        </button>
      ) : null}
    </div>
  )
}
