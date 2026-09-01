import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import { initClarity } from './clarity'

if ('serviceWorker' in navigator) {
  // claiming an uncontrolled page fires controllerchange on a first visit; that is not an update
  const hadController = !!navigator.serviceWorker.controller
  let reloading = false
  const reloadOnce = () => {
    if (reloading || !hadController) return
    reloading = true
    // survives the reload so the app can say why the page just jumped
    try { sessionStorage.setItem('wa_updated', '1') } catch { /* private mode */ }
    window.location.reload()
  }

  navigator.serviceWorker.addEventListener('controllerchange', reloadOnce)

  navigator.serviceWorker.ready.then(reg => {
    reg.update()
    reg.addEventListener('updatefound', () => {
      const next = reg.installing
      if (!next) return
      next.addEventListener('statechange', () => {
        if (next.state === 'installed' && navigator.serviceWorker.controller) {
          next.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    })
  }).catch(() => {})

  window.addEventListener('focus', () => {
    navigator.serviceWorker.getRegistration().then(reg => reg && reg.update()).catch(() => {})
  })
}

initClarity()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
