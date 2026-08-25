export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-4">
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Kept short on purpose (see WhyFormat.tsx for the fuller,
            keyword-complete copy) — Hero + the editor below it have to fit
            one viewport with no scroll, so the H1 leads with the two
            highest-intent phrases (Upwork Text Formatter / bold proposals)
            rather than trying to fit all five primary keywords in, and stays
            short enough to wrap to two lines, not three. */}
        <h1 className="mx-auto text-4xl font-bold tracking-tight text-brand sm:text-5xl">
          Upwork Text Formatter for Bold Proposals
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-slate-600 sm:text-lg">
          Format bold text, italics, and bullet points for Upwork — a free Unicode text
          converter that survives every paste. No sign-up.
        </p>
      </div>
    </section>
  );
}
