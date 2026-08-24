import Icon from './Icon';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '#formatter', label: 'Formatter' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
];

export default function NavBar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant transition-colors hover:text-upwork-green"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* No login/accounts in this tool (by design) — a quick reassurance
            takes the place of a Sign In button. */}
        <div className="hidden items-center gap-2 rounded-full border border-outline-variant px-3 py-1.5 text-xs font-medium text-on-surface-variant sm:flex">
          <Icon name="lock" className="text-[16px] text-upwork-green" />
          Nothing leaves your browser
        </div>
      </div>
    </header>
  );
}
