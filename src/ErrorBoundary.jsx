import { Component } from 'react'

const KEYS = ['wa_settings', 'wa_settings_v2', 'wa_habits', 'wa_habits_v2', 'wa_entries', 'wa_stars']

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  clearAndReload = () => {
    for (const k of KEYS) {
      try { localStorage.removeItem(k) } catch {}
    }
    window.location.replace('/')
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="min-h-[100dvh] bg-zinc-950 grid place-items-center px-5">
        <div className="w-full max-w-[480px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-[22px] font-bold tracking-tight text-white">Something broke</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            The app hit an error it could not recover from. This is usually saved data in an unexpected shape. Reloading is safe and keeps your arc. Clearing removes it permanently.
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-[11px] font-mono text-zinc-400 whitespace-pre-wrap break-words">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => window.location.reload()} className="h-11 px-5 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition">
              Reload
            </button>
            <button onClick={this.clearAndReload} className="h-11 px-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm hover:bg-red-500/15 transition">
              Clear my data and start over
            </button>
          </div>
        </div>
      </div>
    )
  }
}
