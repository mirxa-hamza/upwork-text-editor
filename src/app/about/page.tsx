import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About',
  description: 'Who built Upwork Text Formatter, and why it exists.',
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 pt-20 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8">About Upwork Text Formatter</h1>

          <div className="prose prose-slate max-w-none text-slate-700">
            <p className="mb-4">
              Upwork Text Formatter is built and maintained by{' '}
              <a href="https://www.buraq.dev" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-800">
                buraq.dev
              </a>
              . We build small, focused web tools that solve one problem well instead of trying
              to be a platform.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Why this exists</h2>
            <p className="mb-4">
              Upwork&apos;s job posts, proposals, and message fields are plain text — they strip
              out bold, italic, underline, bullet, numbered-list, and hyperlink formatting the
              moment you paste it in. That makes it hard to write a proposal that&apos;s actually
              easy for a busy client to skim. We built this tool to work around that limitation
              directly, rather than asking freelancers to just live with unformatted walls of
              text.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">How it actually works</h2>
            <p className="mb-4">
              Instead of sending HTML or Markdown — both of which Upwork strips — the tool
              converts your formatting into Unicode characters that already <em>look</em> bold,
              italic, or underlined. There&apos;s no HTML for Upwork to strip in the first place,
              because none is ever sent. The full breakdown is in the{' '}
              <Link href="/#how-it-works" className="font-semibold text-blue-600 hover:text-blue-800">
                How It Works
              </Link>{' '}
              section on the homepage.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">What we don&apos;t do</h2>
            <p className="mb-4">
              Everything runs locally in your browser. There&apos;s no account, no backend
              processing your text, and no integration with Upwork&apos;s API — the tool has no
              way to see what you&apos;re working on, and nothing you type or paste ever leaves
              your machine. See the{' '}
              <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>{' '}
              for the specifics.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Get in touch</h2>
            <p className="mb-4">
              Questions, feedback, or something not working right? Reach us through{' '}
              <a href="https://www.buraq.dev/contact" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-800">
                buraq.dev/contact
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
