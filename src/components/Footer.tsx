import Link from 'next/link';
import Logo from './Logo';

const FOOTER_LINKS = [
  { href: '/editor', label: 'Editor' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <Logo light />
            <span className="max-w-sm text-xs text-slate-400">
              A free formatting tool for Upwork job posts, proposals, and messages. Nothing you
              type is ever stored or sent anywhere.
            </span>
          </div>
          <div className="flex gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {year} Upwork Text Formatter. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
