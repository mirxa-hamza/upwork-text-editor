import Icon from './Icon';

const FAQS = [
  {
    question: 'Does Upwork support rich text formatting?',
    answer:
      "No — Upwork's job post, proposal, and message fields are plain text and strip out bold, italic, underline, bullet, numbered-list, and hyperlink formatting on paste. This tool works around that by converting your formatting into Unicode characters that already look styled, so there's no HTML for Upwork to strip.",
  },
  {
    question: 'Will the formatting break when I paste it into Upwork?',
    answer:
      'Bold, italic, bullets, and numbered lists use well-established Unicode substitution and have been verified by pasting directly into Upwork. Underline uses a Unicode combining character, which can render slightly differently across fonts — always glance at the preview after pasting to confirm it looks right in the specific field you used.',
  },
  {
    question: 'Do links become clickable in Upwork?',
    answer:
      "That depends on the field — Upwork's own text renderer decides whether a bare URL gets auto-linked once pasted, not this tool. The Link button inserts the URL as plain, readable text (e.g. \"my portfolio (https://example.com)\") so it's always at least visible and copy-pasteable even where auto-linking doesn't kick in.",
  },
  {
    question: 'Why doesn\'t Ctrl+Z undo cleanly after I paste?',
    answer:
      "That's a browser limitation, not something this tool can fix. Once formatted text lands in a plain-text field like Upwork's, the browser's native undo stack often treats the whole paste as one big jump instead of tracking it character by character the way normal typing works.",
  },
  {
    question: 'Does this tool store or upload my text?',
    answer:
      'No. Everything — typing, formatting, and conversion — happens locally in your browser. There\'s no backend, no account, and no Upwork API integration; your text never leaves your machine.',
  },
  {
    question: 'Is this tool free to use?',
    answer: 'Yes, completely free, with no sign-up required.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-on-surface">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-on-surface-variant">Everything you need to know about formatting text for Upwork.</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-surface-variant bg-surface-container-lowest shadow-sm transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-base font-semibold text-on-surface select-none">
                {faq.question}
                <Icon name="expand_more" className="shrink-0 text-on-surface-variant transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-sm leading-relaxed text-on-surface-variant">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
