import Icon from './Icon';
import Reveal from './Reveal';

const STEPS = [
  {
    number: '1',
    title: 'Start typing',
    body: 'Write straight into the editor, or paste in a draft you already have.',
  },
  {
    number: '2',
    title: 'Style what matters',
    body: 'Select any text and hit a toolbar button — or just type **bold**, _italic_, ~underline~, "- " or "1. " and it formats itself.',
  },
  {
    number: '3',
    title: 'Copy into Upwork',
    body: 'One click copies exactly what the preview shows. Paste it into any job post, proposal, or message field.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-surface-container-low py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-on-surface">Three steps, no learning curve</h2>
          <p className="mt-4 text-lg text-on-surface-variant">
            No accounts, no uploads, no Upwork integration — everything happens locally in your
            browser.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delayMs={index * 120}>
              <div className="h-full">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-on-brand">
                  {step.number}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-on-surface">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={360} className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <Icon name="info" className="mt-0.5 shrink-0 text-[20px] text-brand" />
            <p className="text-sm text-on-surface-variant">
              <span className="font-semibold text-on-surface">Under the hood: </span>
              Upwork strips HTML and Markdown on paste, but it can&apos;t touch Unicode. So
              instead of applying real formatting, this tool swaps each letter for a Unicode
              character that already <em>looks</em> bold or italic, and draws underlines with a
              Unicode combining character. What lands in your clipboard is plain text — Upwork
              just happens to render it as if it were styled.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
