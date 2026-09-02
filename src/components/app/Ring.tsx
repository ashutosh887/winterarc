import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Ring({ pct, size = 44, stroke = 4, light = false, children }: {
  pct: number
  size?: number
  stroke?: number
  light?: boolean
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? '#d4d4d8' : '#27272a'} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? '#18181b' : '#fafafa'} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (pct / 100) * c }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
      <path d="M11 45 L26 19 L34 33 L39 25 L53 45 Z" fill="#fafafa" />
      <path d="M22.2 27.5 L29.8 27.5 L26 21 Z" fill="#18181b" />
    </svg>
  )
}