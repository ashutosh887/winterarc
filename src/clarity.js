// Microsoft Clarity, loaded only when VITE_CLARITY_ID is set.
// Local dev and forks stay analytics free unless they opt in.
export function initClarity() {
  const id = import.meta.env.VITE_CLARITY_ID
  if (!id || typeof window === 'undefined') return
  if (window.clarity) return

  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${id}`
  script.onerror = () => { delete window.clarity }
  document.head.appendChild(script)
}
