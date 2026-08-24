'use client';

import type { MouseEvent } from 'react';
import Icon from './Icon';
import type { ActiveFormats } from './Editor';

type ToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onBullet: () => void;
  onNumbered: () => void;
  onLink: () => void;
  /** Which buttons should render as "on" for the current caret/selection. */
  active: ActiveFormats;
};

const baseButtonClass = 'flex h-9 w-9 items-center justify-center rounded transition-colors';
const inactiveButtonClass = 'text-on-surface hover:bg-surface-container-high';
const activeButtonClass = 'bg-brand text-on-brand hover:bg-brand-dark';

function buttonClass(isActive: boolean) {
  return `${baseButtonClass} ${isActive ? activeButtonClass : inactiveButtonClass}`;
}

// Prevents the toolbar button from stealing focus (and clearing the editor's
// text selection) before its onClick handler runs.
const preserveSelection = (e: MouseEvent) => e.preventDefault();

export default function Toolbar({ onBold, onItalic, onUnderline, onBullet, onNumbered, onLink, active }: ToolbarProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-surface-container p-1"
      role="toolbar"
      aria-label="Text formatting"
    >
      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onBold}
        className={buttonClass(active.bold)}
        title="Bold"
        aria-label="Bold"
        aria-pressed={active.bold}
      >
        <Icon name="format_bold" />
      </button>
      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onItalic}
        className={buttonClass(active.italic)}
        title="Italic"
        aria-label="Italic"
        aria-pressed={active.italic}
      >
        <Icon name="format_italic" />
      </button>
      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onUnderline}
        className={buttonClass(active.underline)}
        title="Underline"
        aria-label="Underline"
        aria-pressed={active.underline}
      >
        <Icon name="format_underlined" />
      </button>

      <div className="mx-1 h-6 w-px bg-surface-variant" aria-hidden="true" />

      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onBullet}
        className={buttonClass(active.bullet)}
        title="Bullet list"
        aria-label="Bullet list"
        aria-pressed={active.bullet}
      >
        <Icon name="format_list_bulleted" />
      </button>
      <button
        type="button"
        onMouseDown={preserveSelection}
        onClick={onNumbered}
        className={buttonClass(active.numbered)}
        title="Numbered list"
        aria-label="Numbered list"
        aria-pressed={active.numbered}
      >
        <Icon name="format_list_numbered" />
      </button>
      <button type="button" onMouseDown={preserveSelection} onClick={onLink} className={buttonClass(false)} title="Insert link" aria-label="Insert link">
        <Icon name="link" />
      </button>
    </div>
  );
}
