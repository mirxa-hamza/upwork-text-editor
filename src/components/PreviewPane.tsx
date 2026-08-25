import Icon from './Icon';

type PreviewPaneProps = {
  text: string;
};

/**
 * Shows the converted Unicode plain text exactly as it will look once pasted
 * into Upwork — no extra rendering/interpretation happens here, this string
 * *is* the output.
 */
export default function PreviewPane({ text }: PreviewPaneProps) {
  return (
    // min-h-0 (not a fixed min-h-[220px]), matching Editor.tsx — a fixed
    // minimum fights the flex-shrink chain on short viewports and gets
    // clipped by the card's overflow-hidden, cutting off this element's
    // own rounded bottom corner. min-h-0 lets it shrink to fit instead.
    <div className="h-full min-h-0 w-full overflow-y-auto whitespace-pre-wrap rounded-lg bg-surface-subtle p-4 leading-relaxed text-on-surface">
      {text ? (
        text
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-on-surface-variant/40">
          <Icon name="preview" className="text-[36px]" />
          <p className="text-sm font-medium">Your formatted output will appear here.</p>
        </div>
      )}
    </div>
  );
}
