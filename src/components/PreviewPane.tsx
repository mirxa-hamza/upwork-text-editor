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
    <div className="min-h-[280px] w-full whitespace-pre-wrap rounded-lg border border-slate-300 bg-white p-4 text-slate-900 leading-relaxed">
      {text ? (
        text
      ) : (
        <span className="text-slate-400">Your formatted text will appear here, ready to paste into Upwork…</span>
      )}
    </div>
  );
}
