/*
 * Imported into the generated service worker (see workbox.importScripts in
 * vite.config.ts). It exists only so that tapping a reminder opens the tracker
 * instead of doing nothing, which is what a service worker notification does
 * with no handler registered.
 *
 * This file is same-origin and loaded by URL, so it satisfies script-src 'self'.
 * Do not add anything here that needs the app bundle; this runs in the worker.
 */
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil((async () => {
    const open = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const onTracker = open.find(c => new URL(c.url).pathname === '/tracker')
    if (onTracker) return onTracker.focus()
    if (open.length) {
      const first = open[0]
      await first.focus()
      // already running, so route it rather than opening a second window
      return first.navigate ? first.navigate('/tracker').catch(() => {}) : undefined
    }
    return self.clients.openWindow('/tracker')
  })())
})
