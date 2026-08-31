import type { View } from './types'

export const ROUTES: Record<string, View> = {
  '/': 'landing',
  '/winter-arc': 'about',
  '/templates': 'templates',
  '/resources': 'resources',
  '/install': 'install',
  '/feedback': 'feedback',
  '/tracker': 'tracker',
  '/dashboard': 'dashboard',
}

export const PATHS = Object.fromEntries(
  Object.entries(ROUTES).map(([path, view]) => [view, path]),
) as Record<View, string>

export function viewForPath(path: string): View | null {
  return ROUTES[path.replace(/\/+$/, '') || '/'] ?? null
}
