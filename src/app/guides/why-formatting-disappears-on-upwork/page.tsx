import Link from 'next/link';
import Footer from '@/components/Footer';
import { GUIDES } from '@/lib/guides';
import { pageMetadata } from '@/lib/pageMetadata';
import { breadcrumbJsonLd } from '@/lib/jsonLd';

const guide = GUIDES.find((g) => g.slug === 'why-formatting-disappears-on-upwork')!;
const related = GUIDES.filter((g) => g.slug !== guide.slug);

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guides/${guide.slug}`,
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Guides', path: '/guides' },
  { name: guide.title, path: `/guides/${guide.slug}` },
]);

export default function WhyFormattingDisappearsGuide() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <main className="flex-1 pt-20 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
            &larr; Back to Guides
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">{guide.title}</h1>

          <div className="prose prose-slate max-w-none text-slate-700">
            <p className="mb-4">
              You bold a word in Google Docs, copy it, paste it into an Upwork proposal — and it
              comes out completely flat. Same thing with bullet points, italics, underlines,
              links. It&apos;s not a bug on your end, and it&apos;s not Upwork being broken. It&apos;s
              deliberate, and understanding why explains exactly what does and doesn&apos;t survive
              the paste.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Upwork&apos;s text fields are plain text on purpose</h2>
            <p className="mb-4">
              Job posts, proposal cover letters, and message threads all accept plain text only.
              When you paste in something formatted — copied from Word, Google Docs, or an email —
              the underlying HTML or rich-text markup describing &quot;this word is bold&quot; gets
              stripped out during the paste. What&apos;s left is just the plain characters, with no
              styling information attached to them at all. This is a standard, sensible security
              and consistency measure most plain-text fields use across the web, not something
              specific to Upwork treating freelancers unfairly.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Markdown doesn&apos;t survive either</h2>
            <p className="mb-4">
              Typing <code>**bold**</code> or <code>- a bullet</code> directly won&apos;t help — Upwork
              doesn&apos;t render Markdown syntax in these fields, so it just shows up as literal
              asterisks and dashes sitting in your text. Markdown formatting has to be interpreted
              by something that understands Markdown, and Upwork&apos;s plain-text fields don&apos;t.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">The one thing that does survive: Unicode</h2>
            <p className="mb-4">
              Unicode text characters — plain characters, the same category as a letter or a
              number — can&apos;t be &quot;stripped&quot; the way formatting markup can, because there&apos;s
              no markup attached to strip. There happen to be Unicode characters that render as
              bold, italic, or underlined letterforms, and a bullet (•) is just as much a plain
              character as a period is. A tool can substitute your regular letters for these
              Unicode look-alikes, and what pastes into Upwork is still 100% plain text — it just
              happens to look styled once it&apos;s there.
            </p>
            <p className="mb-4">
              That&apos;s the entire mechanism behind this formatter: it never sends Upwork anything
              to strip in the first place. Underline is the one exception worth knowing about — it
              uses a Unicode <em>combining</em> character rather than a substituted letterform,
              which occasionally renders slightly differently across fonts. Always glance at the
              preview after pasting to confirm it looks right in the specific field you used.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">What this means for you</h2>
            <p className="mb-4">
              You can&apos;t fix this by copying from Word or Google Docs more carefully, and you
              can&apos;t fix it with Markdown syntax. You need something to actually do the Unicode
              substitution for you — which is exactly what this tool automates, so you can select
              text and hit Ctrl+B instead of hunting for bold Unicode characters by hand.
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
