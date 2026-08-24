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
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-on-surface">Small formatting choices, bigger response rate</h2>
        <p className="mt-4 text-lg text-on-surface-variant">
          Clients skim dozens of proposals and messages a day. A wall of plain text is easy to
          scroll past — a message with a little structure is easy to read and easy to trust.
        </p>
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
