import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  ariaLabel?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function Switch({ checked, onCheckedChange, ariaLabel, disabled, size = 'md', className }: SwitchProps) {
  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', offset: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', offset: 'translate-x-5' },
  }[size]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50',
        sizes.track,
        checked ? 'bg-white' : 'bg-zinc-700',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          sizes.thumb,
          checked ? sizes.offset + ' bg-zinc-900' : 'translate-x-0 bg-white',
          // shadow trick: when off thumb is white on dark track; when on thumb is dark on white track
        )}
        style={{
          transform: checked ? `translateX(${size === 'sm' ? '16px' : '20px'})` : 'translateX(1px)',
          backgroundColor: checked ? '#18181b' : '#ffffff',
        }}
      />
    </button>
  )
}

export function Toggle({ checked, onCheckedChange, label, ariaLabel, disabled }: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  ariaLabel?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'inline-flex items-center justify-center h-11 px-4 rounded-full text-[13px] font-medium border transition',
        checked
          ? 'bg-white text-zinc-900 border-white'
          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            'w-8 h-[18px] rounded-full relative transition-colors shrink-0',
            checked ? 'bg-zinc-900' : 'bg-zinc-700',
          )}
        >
          <span
            className={cn(
              'absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all',
              checked ? 'left-[16px]' : 'left-[2px]',
            )}
          />
        </span>
        {label ?? (checked ? 'On' : 'Off')}
      </span>
    </button>
  )
}
