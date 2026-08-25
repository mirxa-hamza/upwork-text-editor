import Link from 'next/link';
import Footer from '@/components/Footer';
import { GUIDES } from '@/lib/guides';

const guide = GUIDES.find((g) => g.slug === 'bold-text-in-upwork-proposals')!;
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
    name: 'Open the formatter and select your text',
    text: 'Type your proposal directly into the editor at upworkformatter.com, or paste in a draft you already wrote. Highlight the word or phrase you want to bold.',
  },
  {
    name: 'Bold it',
    text: 'Click the Bold button in the toolbar, or press Ctrl+B (Cmd+B on Mac). You can also just type it as **bold** — wrapping any text in double asterisks bolds it automatically as you type.',
  },
  {
    name: 'Copy the converted text',
    text: 'The preview pane shows exactly what will paste into Upwork. Click Copy — this copies plain Unicode text, not HTML, which is what makes it survive the paste.',
  },
  {
    name: 'Paste into Upwork',
    text: 'Paste into any Upwork proposal, job post, or message field. The bold characters paste as-is, because they were never real formatting for Upwork to strip in the first place.',
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

export default function BoldTextGuide() {
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
              Upwork&apos;s proposal, job post, and message fields are plain text — if you type or
              paste real bold formatting into one, Upwork strips it on the way in. That&apos;s why
              copying bold text from Google Docs or Word into a proposal always comes out flat.
              Here&apos;s how to actually get bold text that survives.
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
              The tool doesn&apos;t send Upwork any HTML or Markdown — both of those get stripped.
              Instead, it swaps each bold letter for a different Unicode character that already{' '}
              <em>looks</em> bold. What lands in your clipboard, and what pastes into Upwork, is
              plain text from start to finish. Upwork has nothing to strip, because there was
              never any real formatting to begin with — just characters that happen to render
              bold.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Where to use it</h2>
            <p className="mb-4">
              This works anywhere Upwork accepts plain text: proposal cover letters, job post
              descriptions, and direct messages to clients. Bold your core skills, a rate, or a
              deadline so a client skimming a dozen proposals actually catches it.
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
