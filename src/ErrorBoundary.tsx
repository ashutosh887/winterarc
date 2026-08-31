import { Component, type ReactNode } from 'react'

import { STORAGE_KEYS } from '@/lib/storage'

const RECOVERY_FLAG = 'wa_recovered_once'

interface Props { children?: ReactNode }
interface State { error: Error | null; recovering: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, recovering: false }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch() {
    // A crash is far more often a stale cached bundle than bad data, so drop the
    // service worker and its caches and retry once before blaming the user's arc.
    let alreadyTried = true
    try {
      alreadyTried = sessionStorage.getItem(RECOVERY_FLAG) === '1'
      if (!alreadyTried) sessionStorage.setItem(RECOVERY_FLAG, '1')
    } catch {}
    if (alreadyTried) return

    this.setState({ recovering: true })
    const done = () => window.location.reload()
    Promise.allSettled([
      navigator.serviceWorker?.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))) ?? Promise.resolve(),
      window.caches?.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))) ?? Promise.resolve(),
    ]).then(done, done)
  }

  clearAndReload = () => {
    for (const k of STORAGE_KEYS) {
      try { localStorage.removeItem(k) } catch {}
    }
    try { sessionStorage.removeItem(RECOVERY_FLAG) } catch {}
    window.location.replace('/')
  }

  render() {
    if (!this.state.error) return this.props.children

    if (this.state.recovering) {
      return (
        <div className="min-h-[100dvh] bg-zinc-950 grid place-items-center px-5">
          <p className="text-sm text-zinc-400">Updating to the latest version...</p>
        </div>
      )
    }

    return (
      <div className="min-h-[100dvh] bg-zinc-950 grid place-items-center px-5">
        <div className="w-full max-w-[460px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-[22px] font-bold tracking-tight text-white">That did not load</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Your arc is still saved. Reloading fixes this almost every time. Only clear if reloading keeps failing.
          </p>
          <pre className="mt-4 max-h-28 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-[11px] font-mono text-zinc-500 whitespace-pre-wrap break-words">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => window.location.reload()} className="h-11 px-4 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition">
              Reload
            </button>
            <button onClick={this.clearAndReload} className="h-11 px-4 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-sm hover:text-white hover:border-zinc-700 transition">
              Clear and restart
            </button>
          </div>
        </div>
      </div>
    )
  }
}
