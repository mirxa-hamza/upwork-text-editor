'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-4 w-full rounded-t-[3rem] bg-white px-6 py-12 sm:mt-6 sm:rounded-t-[4rem] sm:px-10 sm:py-14 lg:px-16">
      <div className="mx-auto flex max-w-4xl flex-col justify-between gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* Left Side */}
        <div className="flex max-w-xs flex-col items-start gap-3">
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            We would love to hear from you.
          </h2>
          <p className="text-sm text-slate-500">
            Feel free to reach out if you want to collaborate with us, or simply have a chat.
          </p>
        </div>

        {/* Right Side Columns */}
        <div className="grid grid-cols-2 gap-6 sm:gap-10">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <a href="https://www.buraq.dev/contact" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 hover:underline">
              Contact us
            </a>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
              <li><Link href="/guides" className="hover:text-slate-900">Guides</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900">Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              {/* Use <Link> to satisfy ESLint's no-html-link-for-pages rule,
                  but override onClick with window.location.href so the browser
                  does a real navigation to /#section from any page — without
                  this, Next.js's client router appends the hash to the
                  current path (e.g. /privacy#editor) instead of going to /. */}
              <li>
                <Link
                  href="/#editor"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/#editor'; }}
                  className="hover:text-slate-900 cursor-pointer"
                >Editor</Link>
              </li>
              <li>
                <Link
                  href="/#why-format"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/#why-format'; }}
                  className="hover:text-slate-900 cursor-pointer"
                >Why Format</Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/#how-it-works'; }}
                  className="hover:text-slate-900 cursor-pointer"
                >How It Works</Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/#faq'; }}
                  className="hover:text-slate-900 cursor-pointer"
                >FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
        <p>&copy; 2026 Upwork Text Formatter. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Powered by{' '}
          <a
            href="https://www.buraq.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            buraq.dev
          </a>{' '}
          <span aria-hidden="true" className="text-red-500">
            &hearts;
          </span>
        </p>
      </div>
    </footer>
  );
}
