import type { ComponentType } from 'react'
import {
  Check, Flame, Trophy, Flag, Snowflake, Zap, BookOpen, Dumbbell, Star,
  Footprints, Moon, Salad, Egg, Droplets, Target, Ban, Wind, NotebookPen, Sun, PhoneOff, TreePine, Coins,
  BrushCleaning, ShowerHead, AlarmClock, MountainSnow, Hourglass, Gem, Crown, Rocket, GraduationCap,
} from 'lucide-react'

type IconComponent = ComponentType<{ size?: number; className?: string }>

export const ICON_MAP: Record<string, IconComponent> = {
  dumbbell: Dumbbell, footprints: Footprints, moon: Moon, salad: Salad, egg: Egg, droplets: Droplets, target: Target, ban: Ban,
  bookopen: BookOpen, wind: Wind, notebookpen: NotebookPen, sun: Sun, phoneoff: PhoneOff, treepine: TreePine, coins: Coins,
  brushcleaning: BrushCleaning, showerhead: ShowerHead, alarmclock: AlarmClock, flame: Flame, snowflake: Snowflake, star: Star,
  zap: Zap, mountainSnow: MountainSnow, hourglass: Hourglass, gem: Gem, crown: Crown, rocket: Rocket, graduationcap: GraduationCap,
  check: Check, trophy: Trophy, flag: Flag,
}

export function HabitIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const C = ICON_MAP[name]
  if (!C) return null
  return <C size={size} className={className} />
}
