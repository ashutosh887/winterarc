import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  let reloading = false
  const reloadOnce = () => {
    if (reloading) return
    reloading = true
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
