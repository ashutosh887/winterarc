/**
 * Chrome fires beforeinstallprompt as soon as the page becomes installable,
 * which on a fast repeat visit can land before the app bundle has parsed and
 * React has attached its own listener. The event cannot be replayed, so a miss
 * means no install button for the rest of the visit. This runs first and holds
 * the event for the app to pick up.
 *
 * It is a file rather than an inline script because the CSP is script-src 'self'
 * with no unsafe-inline, and an inline block would be dropped without a word.
 */
(function () {
  window.waInstallPrompt = null
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault()
    window.waInstallPrompt = e
  })
  window.addEventListener('appinstalled', function () {
    window.waInstallPrompt = null
  })
})()
