import Link from 'next/link';
import Footer from '@/components/Footer';
import { GUIDES } from '@/lib/guides';

const guide = GUIDES.find((g) => g.slug === 'bullet-points-in-upwork-messages')!;
const related = GUIDES.filter((g) => g.slug !== guide.slug);

export const metadata = {
  title: guide.title,
  description: guide.description,
  alternates: {
    canonical: `/guides/${guide.slug}`,
  },
};

const STEPS = [
  {
    name: 'Start a new line',
    text: 'In the editor, start typing on a fresh line where you want the list to begin — deliverables, your tech stack, or portfolio links all work well as bullets.',
  },
  {
    name: 'Turn it into a list',
    text: 'Click the Bullet List button in the toolbar, or type "- " (a dash and a space) at the start of the line and it converts automatically as you type. Use the Numbered List button, or "1. ", for an ordered sequence instead.',
  },
  {
    name: 'Copy and paste as usual',
    text: 'The preview shows exactly what will paste. Copy it and paste into your Upwork proposal, message, or job post — the bullets (•) or numbers come through as plain characters, not HTML list markup.',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: guide.title,
  description: guide.description,
  step: STEPS.map((step) => ({
    '@type': 'HowToStep',
    name: step.name,
    text: step.text,
  })),
};

export default function BulletPointsGuide() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <main className="flex-1 pt-20 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
            &larr; Back to Guides
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">{guide.title}</h1>

          <div className="prose prose-slate max-w-none text-slate-700">
            <p className="mb-4">
              A long paragraph listing your deliverables or tools is easy for a client to skim
              past. A bulleted list of the same information is easy to actually read. Upwork
              strips real HTML list markup on paste, the same way it strips bold and italic — so
              typing a dash and hoping it renders as a bullet won&apos;t work on its own. Here&apos;s
              what actually does.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">The short version</h2>
            <ol className="mb-4 list-decimal pl-6 space-y-2">
              {STEPS.map((step) => (
                <li key={step.name}>
                  <span className="font-semibold text-slate-900">{step.name}.</span> {step.text}
                </li>
              ))}
            </ol>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Why this actually works</h2>
            <p className="mb-4">
              Instead of sending Upwork an actual <code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code>{' '}
              list — which gets stripped on paste — the tool writes a real bullet character (•) or
              number directly at the start of each line as plain text. There&apos;s no markup for
              Upwork to remove, so the visual structure survives even though, technically, it&apos;s
              never been anything but plain text.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Where to use it</h2>
            <p className="mb-4">
              Lists work especially well for the parts of a proposal a client scans first:
              deliverables, your relevant tools or tech stack, past results, or a short list of
              questions before you can start. A numbered list is better for anything sequential —
              your process, a project timeline, or onboarding steps.
            </p>

            <Link
              href="/#editor"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-dark"
            >
              Try it in the editor &rarr;
            </Link>
          </div>

          <div className="mt-12 border-t border-slate-100 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">More guides</h2>
            <ul className="space-y-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
