'use client';

import type { MouseEvent } from 'react';
import Icon from './Icon';

type ToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onBullet: () => void;
  onNumbered: () => void;
  onLink: () => void;
};

const buttonClass =
  'flex h-9 w-9 items-center justify-center rounded text-on-surface transition-colors hover:bg-surface-container-high';

// Prevents the toolbar button from stealing focus (and clearing the editor's
// text selection) before its onClick handler runs.
const preserveSelection = (e: MouseEvent) => e.preventDefault();

export default function Toolbar({ onBold, onItalic, onUnderline, onBullet, onNumbered, onLink }: ToolbarProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-surface-container p-1"
      role="toolbar"
      aria-label="Text formatting"
    >
      <button type="button" onMouseDown={preserveSelection} onClick={onBold} className={buttonClass} title="Bold" aria-label="Bold">
        <Icon name="format_bold" />
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onItalic} className={buttonClass} title="Italic" aria-label="Italic">
        <Icon name="format_italic" />
      </button>
      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onUnderline}
        className={buttonClass}
        title="Underline"
        aria-label="Underline"
      >
        <Icon name="format_underlined" />
      </button>

      <div className="mx-1 h-6 w-px bg-surface-variant" aria-hidden="true" />

      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onBullet}
        className={buttonClass}
        title="Bullet list"
        aria-label="Bullet list"
      >
        <Icon name="format_list_bulleted" />
      </button>
      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onNumbered}
        className={buttonClass}
        title="Numbered list"
        aria-label="Numbered list"
      >
        <Icon name="format_list_numbered" />
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onLink} className={buttonClass} title="Insert link" aria-label="Insert link">
        <Icon name="link" />
      </button>
    </div>
  );
}
