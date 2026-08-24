import Icon from './Icon';

const STEPS = [
  {
    number: '1',
    title: 'Paste or type your draft',
    body: 'Drop your raw job post, proposal, or message text into the editor on the left — or just start typing straight into it.',
  },
  {
    number: '2',
    title: 'Highlight & format',
    body: "Select any text and use the toolbar for bold, italic, underline, bullets, numbered lists, or a link. Prefer typing? Markdown shortcuts like **bold** work too.",
  },
  {
    number: '3',
    title: 'Copy & paste into Upwork',
    body: 'Click "Copy Formatted Text" and paste directly into any Upwork job post, proposal, or message field — the formatting survives.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-surface-container-low py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-on-surface">How it works</h2>
          <p className="mt-4 text-lg text-on-surface-variant">
            No accounts, no uploads, no Upwork integration — everything happens locally in your
            browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-upwork-green text-lg font-bold text-on-primary">
                {step.number}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-on-surface">{step.title}</h3>
              <p className="text-sm text-on-surface-variant">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <Icon name="info" className="mt-0.5 shrink-0 text-[20px] text-upwork-green" />
          <p className="text-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">The trick: </span>
            Upwork strips HTML and Markdown formatting on paste, but it can&apos;t strip Unicode.
            So instead of applying real bold/italic/underline styling, this tool swaps each
            letter for a Unicode character that already <em>looks</em> bold or italic, and draws
            underlines with a Unicode combining character. What you copy is plain text — Upwork
            just renders it as if it were formatted.
          </p>
        </div>
      </div>
    </section>
  );
}
