'use client';

import type { MouseEvent } from 'react';

type ToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onBullet: () => void;
  onNumbered: () => void;
  onLink: () => void;
  onClear: () => void;
};

const buttonClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-300 bg-white px-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200';

// Prevents the toolbar button from stealing focus (and clearing the editor's
// text selection) before its onClick handler runs.
const preserveSelection = (e: MouseEvent) => e.preventDefault();

export default function Toolbar({ onBold, onItalic, onUnderline, onBullet, onNumbered, onLink, onClear }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2" role="toolbar" aria-label="Text formatting">
      <button type="button" onMouseDown={preserveSelection} onClick={onBold} className={`${buttonClass} font-bold`} title="Bold" aria-label="Bold">
        B
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onItalic} className={`${buttonClass} italic`} title="Italic" aria-label="Italic">
        I
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onUnderline} className={`${buttonClass} underline`} title="Underline" aria-label="Underline">
        U
      </button>

      <span className="mx-1 h-5 w-px bg-slate-300" aria-hidden="true" />

      <button type="button" onMouseDown={preserveSelection} onClick={onBullet} className={buttonClass} title="Bullet list" aria-label="Bullet list">
        • List
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onNumbered} className={buttonClass} title="Numbered list" aria-label="Numbered list">
        1. List
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onLink} className={buttonClass} title="Insert link" aria-label="Insert link">
        Link
      </button>

      <span className="mx-1 h-5 w-px bg-slate-300" aria-hidden="true" />

      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onClear}
        className={`${buttonClass} text-red-600 hover:bg-red-50`}
        title="Clear editor"
        aria-label="Clear editor"
      >
        Clear
      </button>
    </div>
  );
}
