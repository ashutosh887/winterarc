import { ExternalLink, NotebookPen } from 'lucide-react'
import { Eyebrow } from '@/components/app/Surface'
import { site } from '@/config'

export function Feedback() {
  return (
          <main id="main" className="max-w-[1040px] mx-auto px-5 sm:px-6 py-12">
            <Eyebrow icon={NotebookPen}>Feedback</Eyebrow>
            <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">Found a bug, want a feature</h1>
            <p className="mt-1 text-sm text-zinc-500 max-w-[560px]">No form here. Everything goes through GitHub or X, so you can watch what happens to your report.</p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { title: 'Report a bug', body: 'Open an issue with what you did and what happened.', label: 'Open an issue', href: site.support.github + '/issues/new' },
                { title: 'Suggest a feature', body: 'Issues are fine. A pull request is better.', label: 'Read CONTRIBUTING', href: site.support.github + '/blob/main/CONTRIBUTING.md' },
                { title: 'Just say something', body: 'Short thoughts are easier to send on X.', label: '@ashutosh887_', href: 'https://x.com/ashutosh887_' },
              ].map(c => (
                <div key={c.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col">
                  <div className="text-sm font-semibold text-white">{c.title}</div>
                  <p className="mt-1.5 text-[13px] leading-5 text-zinc-500 flex-1">{c.body}</p>
                  <a href={c.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 self-start px-5 h-11 shrink-0 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 text-sm hover:bg-zinc-800 hover:border-zinc-700 transition">
                    {c.label} <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-sm font-semibold text-white">What is measured</div>
              <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">
                The hosted site runs Microsoft Clarity so I can see which screens break. It records pages, clicks and scrolling, with text masked. It cannot read your habits, dates or name, because those live in browser storage it never touches. Run your own copy without <code className="px-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">VITE_CLARITY_ID</code> and nothing is measured at all.
              </p>
              <p className="mt-2 text-[13px] leading-6 text-zinc-500">
                Reminders are not measured and are not sent anywhere. The times you pick are saved next to your arc in this browser, and the notification is raised by the browser on your own device. There is no push server here, so nothing about your schedule reaches me or anybody else.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-sm font-semibold text-white">Before you file</div>
              <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">Your data lives in this browser only. If the grid looks wrong, export JSON from the dashboard and attach it. Nothing in the export leaves your machine until you upload it yourself.</p>
            </div>
          </main>
  )
}
