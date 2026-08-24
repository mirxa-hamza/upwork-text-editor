'use client';

import { useState } from 'react';
import Icon from './Icon';

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

  const label = status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed — select manually' : 'Copy Formatted Text';

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-brand px-4 text-xs font-semibold text-on-brand shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-on-surface-variant disabled:shadow-none"
    >
      <Icon name={status === 'copied' ? 'check' : 'content_copy'} filled className="text-[16px]" />
      {label}
    </button>
  );
}
