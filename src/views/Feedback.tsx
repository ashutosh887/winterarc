import { ExternalLink, NotebookPen } from 'lucide-react'
import { Card, CardText, CardTitle, Page, PageHeading, Section, buttonClass } from '@/components/app/Surface'
import { site } from '@/config'

const CHANNELS = [
  { title: 'Report a bug', body: 'Open an issue with what you did and what happened.', label: 'Open an issue', href: site.support.github + '/issues/new' },
  { title: 'Suggest a feature', body: 'Issues are fine. A pull request is better.', label: 'Read CONTRIBUTING', href: site.support.github + '/blob/main/CONTRIBUTING.md' },
  { title: 'Just say something', body: 'Short thoughts are easier to send on X.', label: '@ashutosh887_', href: 'https://x.com/ashutosh887_' },
]

export function Feedback() {
  return (
    <Page>
      <PageHeading
        icon={NotebookPen}
        eyebrow="Feedback"
        title="Found a bug, want a feature"
        subtitle="No form here. Everything goes through GitHub or X, so you can watch what happens to your report."
      />

      <Section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHANNELS.map(c => (
          <Card key={c.title} className="flex flex-col">
            <CardTitle>{c.title}</CardTitle>
            <CardText className="flex-1">{c.body}</CardText>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('ghost', 'lg', 'mt-5')}
            >
              {c.label} <ExternalLink size={12} />
            </a>
          </Card>
        ))}
      </Section>

      <Section className="grid lg:grid-cols-2 gap-4 items-start max-lg:max-w-[620px]">
        <Card>
          <CardTitle>What is measured</CardTitle>
          <CardText>
            The hosted site runs Microsoft Clarity so I can see which screens break. It records pages, clicks and scrolling, with text masked. It cannot read your habits, dates or name, because those live in browser storage it never touches. Run your own copy without <code className="px-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-[13px]">VITE_CLARITY_ID</code> and nothing is measured at all.
          </CardText>
          <CardText>
            Reminders are not measured. Your times save next to your arc in this browser, and your own browser raises the notification. No push server exists here, so your schedule never reaches me.
          </CardText>
        </Card>
        <Card>
          <CardTitle>Before you file</CardTitle>
          <CardText>
            Your data lives in this browser only. If the grid looks wrong, export JSON from the dashboard and attach it. Nothing in the export leaves your machine until you upload it yourself.
          </CardText>
        </Card>
      </Section>
    </Page>
  )
}
