import Link from 'next/link';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/pageMetadata';

// Bumped by hand when this page's content actually changes — not derived
// from `new Date()`. A dynamic date silently claimed the policy was
// "updated" on every single visit, which is both inaccurate and something
// Google explicitly discourages (a last-modified date should reflect a real
// edit, since it can affect how content is trusted/recrawled).
const LAST_UPDATED = 'August 25, 2026';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How Upwork Text Formatter handles your data — in short, it stays in your browser.',
  path: '/privacy',
});

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 pt-20 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none text-slate-700">
            <p className="mb-4">Last updated: {LAST_UPDATED}</p>
            
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Do Not Collect</h2>
            <p className="mb-4">
              Upwork Text Formatter is a client-side tool. All text formatting is done locally in your browser. 
              We do not store, save, or transmit any of the text you paste or type into the editor to any servers.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Waitlist Information</h2>
            <p className="mb-4">
              If you choose to join our waitlist, we collect your Name, Company, and Work Email. 
              This information is used strictly to notify you about early access, onboarding, and updates. 
              We do not sell or share this information with third parties.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Cookies and Analytics</h2>
            <p className="mb-4">
              We may use basic analytics to understand website traffic (such as page views). 
              These analytics are anonymized and do not track your personal identity or the content you format.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please{' '}
              <a
                href="https://www.buraq.dev/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                contact us
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
