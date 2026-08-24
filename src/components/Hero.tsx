import Icon from './Icon';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-variant/30 to-surface" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 pt-28 pb-16 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2">
          <Icon name="check_circle" filled className="text-[16px] text-upwork-green" />
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Free · No Sign-up · Runs Entirely in Your Browser
          </span>
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-on-surface sm:text-5xl">
          Format Text for Upwork in <span className="text-upwork-green">Seconds</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-on-surface-variant">
          Upwork strips bold, italic, underline, bullets, numbering, and clickable links from
          anything you paste into a job post, proposal, or message. Format your text below and
          copy the result — it&apos;s plain text under the hood, built from Unicode characters
          that already look formatted, so Upwork can&apos;t strip it.
        </p>
      </div>
    </section>
  );
}
