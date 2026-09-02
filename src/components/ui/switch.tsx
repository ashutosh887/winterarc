import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  ariaLabel?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const SIZES = {
  sm: { track: 'w-9 h-5', thumb: 'size-4', on: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'size-5', on: 'translate-x-5' },
}

export function Switch({ checked, onCheckedChange, ariaLabel, disabled, size = 'md', className }: SwitchProps) {
  const s = SIZES[size]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center justify-start rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50',
        s.track,
        checked ? 'bg-white' : 'bg-zinc-700',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none block rounded-full shadow-lg transition duration-200 ease-in-out',
          s.thumb,
          checked ? `${s.on} bg-zinc-900` : 'translate-x-0 bg-white',
        )}
      />
    </button>
  )
}
