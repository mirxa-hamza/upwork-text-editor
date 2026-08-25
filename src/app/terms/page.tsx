import Link from 'next/link';
import Footer from '@/components/Footer';

// Bumped by hand when this page's content actually changes — not derived
// from `new Date()`. A dynamic date silently claimed the terms were
// "updated" on every single visit, which is both inaccurate and something
// Google explicitly discourages (a last-modified date should reflect a real
// edit, since it can affect how content is trusted/recrawled).
const LAST_UPDATED = 'August 25, 2026';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that apply to using Upwork Text Formatter.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 pt-20 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-slate max-w-none text-slate-700">
            <p className="mb-4">Last updated: {LAST_UPDATED}</p>
            
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Upwork Text Formatter, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Upwork Text Formatter is a free web-based utility designed to help freelancers format text for their Upwork proposals and profiles. 
              The service is provided &quot;as is&quot; and &quot;as available&quot;. We do not guarantee that the formatting will always be perfectly translated by Upwork&apos;s platform.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. User Conduct</h2>
            <p className="mb-4">
              You agree to use the service only for lawful purposes. You are solely responsible for the content you format using our tool. 
              Since our tool processes data locally on your machine, we have no control over or responsibility for the text you input.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              The design, layout, look, appearance, and graphics of this website are owned by us. 
              Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
            </p>
            
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
            <p className="mb-4">
              We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the website. 
              Your use of the service is at your sole risk.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please{' '}
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
