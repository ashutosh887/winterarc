import type { Habit, Tier } from './types'

export const TIER_LABELS: Record<Tier, string> = {
  'non-neg': 'Non negotiables',
  extra: 'Good extras',
  aesthetic: 'Winter arc aesthetic',
  custom: 'Custom',
}

export const PRESETS: Habit[] = [
  { id: 'gym', name: 'Gym / Train 45m', icon: 'dumbbell', tier: 'non-neg', desc: 'Minimum 30 min. Walk counts.' },
  { id: 'steps', name: '10k Steps', icon: 'footprints', tier: 'non-neg', desc: 'Half before lunch.' },
  { id: 'sleep', name: 'Sleep 7.5h / In bed 22:30', icon: 'moon', tier: 'non-neg', desc: 'No snoozing. Up when alarm rings.' },
  { id: 'nutrition', name: 'No sugar & junk', icon: 'salad', tier: 'non-neg', desc: 'No / low sugar, no junk food.' },
  { id: 'protein', name: 'Protein target', icon: 'egg', tier: 'non-neg', desc: 'Track grams per day.' },
  { id: 'water', name: 'Water 2 to 3L', icon: 'droplets', tier: 'non-neg', desc: 'Spread through day.' },
  { id: 'work', name: 'Deep work 90m', icon: 'target', tier: 'non-neg', desc: 'Before email, phone away.' },
  { id: 'no-alcohol', name: 'No alcohol', icon: 'ban', tier: 'non-neg', desc: 'Yes or no, no exceptions.' },
  { id: 'reading', name: 'Reading 10 pages', icon: 'bookopen', tier: 'extra', desc: 'Non-fiction preferred.' },
  { id: 'meditation', name: 'Meditation 10m', icon: 'wind', tier: 'extra', desc: '5 to 15 min.' },
  { id: 'journaling', name: 'Journaling', icon: 'notebookpen', tier: 'extra', desc: 'Thoughts / gratitude.' },
  { id: 'sunlight', name: 'Morning sunlight', icon: 'sun', tier: 'extra', desc: 'Outside shortly after waking.' },
  { id: 'phone-am', name: 'No phone 60m AM', icon: 'phoneoff', tier: 'extra', desc: 'First 30 to 60 min.' },
  { id: 'phone-pm', name: 'No phone before bed', icon: 'moon', tier: 'extra', desc: 'Phone down by 21:00.' },
  { id: 'outside', name: 'Outside 20m', icon: 'treepine', tier: 'extra', desc: 'Survives cold. Indoor alt ok.' },
  { id: 'money', name: 'No unnecessary spend', icon: 'coins', tier: 'extra', desc: 'Track spend / no-buy.' },
  { id: 'clean', name: 'Clean room/desk', icon: 'brushcleaning', tier: 'extra', desc: '2-min reset before bed.' },
  { id: 'cold', name: 'Cold shower', icon: 'showerhead', tier: 'aesthetic', desc: 'Discipline rep.' },
  { id: 'wake5', name: '5 AM wake', icon: 'alarmclock', tier: 'aesthetic', desc: 'Fixed wake time daily.' },
  { id: 'pushups', name: '100 pushups', icon: 'flame', tier: 'aesthetic', desc: 'Challenge style.' },
]
