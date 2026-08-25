import Icon from './Icon';
import Reveal from './Reveal';

const FEATURES = [
  {
    icon: 'format_bold',
    title: 'Make key terms pop',
    body: 'Bold your core skills, tools, or numbers so a busy client catches them in a two-second skim.',
  },
  {
    icon: 'format_italic',
    title: 'Add a quieter emphasis',
    body: 'Italics are perfect for a quick aside, a clarifying question, or a quoted line from the job post.',
  },
  {
    icon: 'format_underlined',
    title: 'Mark section headers',
    body: 'Underline short labels to break a long message or proposal into clearly separated parts.',
  },
  {
    icon: 'format_list_bulleted',
    title: 'Turn paragraphs into lists',
    body: 'Deliverables, tech stacks, and portfolio links read far better as bullets than buried in a paragraph.',
  },
  {
    icon: 'format_list_numbered',
    title: 'Lay out a sequence',
    body: 'Numbered steps make a process or timeline easy to follow at a glance, in order.',
  },
  {
    icon: 'link',
    title: 'Share links cleanly',
    body: 'Drop in a case study or portfolio URL as plain, readable text instead of raw markup.',
  },
];

export default function WhyFormat() {
  return (
    <section id="why-format" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-brand">Why You Need an Upwork Text Formatter</h2>
        <div className="mt-4 space-y-4 text-left text-base leading-relaxed text-on-surface-variant sm:text-lg">
          <p>
            Upwork&apos;s proposal and message fields don&apos;t give you a rich text editor —
            there&apos;s no button for bold, no italics, no bullet list, just a plain textbox
            that flattens everything you paste into it. If you&apos;ve ever wondered how to bold
            text in Upwork, or tried to italicize text in an Upwork message only to watch the
            formatting vanish on paste, you&apos;ve run into this limitation directly: Upwork
            strips real formatting on purpose, the same way most plain-text fields do.
          </p>
          <p>
            Upwork Text Formatter solves that without needing Upwork to change anything. Select
            your text, add bullet points to your Upwork proposal, bold the skills or numbers a
            client should notice first, and copy the result — what pastes in is the same styled
            text you see in the preview, because it&apos;s built from Unicode characters that
            already look formatted rather than markup Upwork can strip. It&apos;s the closest
            thing to an actual Upwork rich text editor you&apos;ll find, minus the account, the
            plugin, or the browser extension.
          </p>
          <p>
            If you write proposals for a living, this is worth the ten seconds it takes: format
            text for Upwork clients the way you&apos;d format it anywhere else, and let the
            structure do some of the work a wall of plain text can&apos;t.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delayMs={index * 80}>
            <div className="h-full rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon name={feature.icon} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-on-surface">{feature.title}</h3>
              <p className="text-sm text-on-surface-variant">{feature.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
