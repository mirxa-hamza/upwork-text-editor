export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-variant/30 to-surface" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mx-auto text-2xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Upwork Text Formatter
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-on-surface-variant sm:mt-6 sm:text-base">
          Easily format your Upwork text with bold, italic, underline, lists and links — free,
          no sign-up.
        </p>
      </div>
    </section>
  );
}
