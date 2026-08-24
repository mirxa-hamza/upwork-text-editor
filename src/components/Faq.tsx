import Icon from './Icon';
import Reveal from './Reveal';

const FAQS = [
  {
    question: "Can I just format text normally and paste it into Upwork?",
    answer:
      "Not really — Upwork's job post, proposal, and message fields are plain text and strip out bold, italic, underline, bullet, numbered-list, and hyperlink formatting on paste. This tool works around that by converting your formatting into Unicode characters that already look styled, so there's no HTML for Upwork to strip in the first place.",
  },
  {
    question: 'How reliable is the formatting once it lands in Upwork?',
    answer:
      'Bold, italic, bullets, and numbered lists use well-established Unicode substitution and have been verified by pasting directly into Upwork. Underline uses a Unicode combining character, which can render slightly differently across fonts — always glance at the preview after pasting to confirm it looks right in the specific field you used.',
  },
  {
    question: 'If I add a link, will Upwork make it clickable?',
    answer:
      "That's up to Upwork's own text renderer, not this tool — different fields can behave differently. The Link button inserts the URL as plain, readable text (e.g. \"my portfolio (https://example.com)\") so it's always at least visible and copy-pasteable even where auto-linking doesn't kick in.",
  },
  {
    question: "My Ctrl+Z stopped working properly after I pasted — why?",
    answer:
      "That's a browser limitation, not something this tool can fix. Once formatted text lands in a plain-text field like Upwork's, the browser's native undo stack often treats the whole paste as one big jump instead of tracking it character by character the way normal typing works.",
  },
  {
    question: 'Does any of my text get sent to a server?',
    answer:
      "No. Typing, formatting, and conversion all happen locally in your browser. There's no backend, no account, and no Upwork API integration — your text never leaves your machine.",
  },
  {
    question: 'What does this cost?',
    answer: "Nothing — it's free, with no sign-up required.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-on-surface">Common questions</h2>
          <p className="mt-4 text-lg text-on-surface-variant">Everything worth knowing before you paste.</p>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.question} delayMs={index * 60}>
              <details className="group rounded-xl border border-surface-variant bg-surface-container-lowest shadow-sm transition-shadow open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-base font-semibold text-on-surface select-none">
                  {faq.question}
                  <Icon name="expand_more" className="shrink-0 text-on-surface-variant transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed text-on-surface-variant">{faq.answer}</div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
