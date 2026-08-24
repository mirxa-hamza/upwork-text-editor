import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-lowest py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div className="flex flex-col gap-2">
          <Logo />
          <span className="text-xs text-on-surface-variant">
            Free formatting tool for Upwork job posts, proposals, and messages. Nothing you type
            ever leaves your browser.
          </span>
        </div>
        <div className="flex gap-6">
          <a href="#formatter" className="text-sm font-medium text-on-surface-variant hover:text-upwork-green">
            Formatter
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-on-surface-variant hover:text-upwork-green">
            How It Works
          </a>
          <a href="#faq" className="text-sm font-medium text-on-surface-variant hover:text-upwork-green">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
