import Link from 'next/link';
import Footer from '@/components/Footer';
import { GUIDES } from '@/lib/guides';
import { pageMetadata } from '@/lib/pageMetadata';
import { breadcrumbJsonLd } from '@/lib/jsonLd';

export const metadata = pageMetadata({
  title: 'Guides',
  description: 'Short, practical guides to formatting text for Upwork proposals, messages, and job posts.',
  path: '/guides',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Guides', path: '/guides' },
]);

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <main className="flex-1 pt-20 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Guides</h1>
          <p className="text-slate-600 mb-10 max-w-2xl">
            Short, practical answers to the specific formatting questions freelancers run into on
            Upwork — no fluff, just what to do and why it works.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-slate-900 mb-2">{guide.title}</h2>
                <p className="text-sm text-slate-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
