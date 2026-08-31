// Microsoft Clarity, loaded only when VITE_CLARITY_ID is set.
// Local dev and forks stay analytics free unless they opt in.
type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] }

declare global {
  interface Window { clarity?: ClarityFn }
}

export function initClarity(): void {
  const id = import.meta.env.VITE_CLARITY_ID
  if (!id || typeof window === 'undefined') return
  if (window.clarity) return

  const clarity: ClarityFn = function (...args: unknown[]) {
    (clarity.q = clarity.q || []).push(args)
  }
  window.clarity = clarity

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${id}`
  script.onerror = () => { delete window.clarity }
  document.head.appendChild(script)
}
