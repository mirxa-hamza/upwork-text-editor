'use client';

import { useState } from 'react';

type CopyButtonProps = {
  text: string;
};

type Status = 'idle' | 'copied' | 'error';

export default function CopyButton({ text }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 1800);
    }
  };

  const label = status === 'copied' ? 'Copied ✓' : status === 'error' ? 'Copy failed — select text manually' : 'Copy to Clipboard';

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {label}
    </button>
  );
}
