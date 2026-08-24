import Icon from './Icon';

const FEATURES = [
  {
    icon: 'format_bold',
    title: 'Bold for skills',
    body: 'Highlight key technologies, metrics, or headings so clients see them instantly.',
  },
  {
    icon: 'format_italic',
    title: 'Italics for emphasis',
    body: 'Use italics to draw attention to important questions, quotes, or clarifications.',
  },
  {
    icon: 'format_underlined',
    title: 'Underline for labels',
    body: 'Create visual separation between different sections of your message or proposal.',
  },
  {
    icon: 'format_list_bulleted',
    title: 'Bullets for scannability',
    body: 'Break down your process, deliverables, or portfolio links into an easy scan.',
  },
  {
    icon: 'format_list_numbered',
    title: 'Numbered steps',
    body: 'Lay out a step-by-step plan or timeline clients can follow without getting lost.',
  },
  {
    icon: 'link',
    title: 'Readable links',
    body: 'Drop in a portfolio or case-study URL as plain, readable text — no broken markup.',
  },
];

export default function WhyFormat() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-on-surface">Why format your text for Upwork?</h2>
        <p className="mt-4 text-lg text-on-surface-variant">
          Clients on Upwork review hundreds of proposals and messages. A wall of plain text gets
          skipped — a well-formatted, scannable message demonstrates professionalism and respect
          for their time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-upwork-green/10 text-upwork-green">
              <Icon name={feature.icon} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-on-surface">{feature.title}</h3>
            <p className="text-sm text-on-surface-variant">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
