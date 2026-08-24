import Link from 'next/link';
import Icon from './Icon';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-variant/30 to-surface" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 pt-28 pb-20 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2">
          <Icon name="bolt" filled className="text-[16px] text-brand" />
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            No install · No account · 100% client-side
          </span>
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-on-surface sm:text-5xl">
          Make your Upwork text <span className="text-brand">actually look formatted</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-on-surface">
          Format text that actually works in Upwork proposals and messages.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-base text-on-surface-variant">
          Upwork&apos;s job posts, proposals, and messages are plain text — bold, italics,
          underline, lists, and links all get silently stripped the moment you paste. This tool
          rewrites your formatting as Unicode characters instead, so it survives the trip.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/editor"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-7 text-base font-semibold text-on-brand shadow-sm transition-colors hover:bg-brand-dark"
          >
            <Icon name="edit_square" className="text-[20px]" />
            Open Editor
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-outline-variant px-7 text-base font-semibold text-on-surface transition-colors hover:border-brand hover:text-brand"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
