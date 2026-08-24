'use client';

import { useRef, useState } from 'react';
import Editor, { type ActiveFormats, type EditorHandle } from './Editor';
import Toolbar from './Toolbar';
import PreviewPane from './PreviewPane';
import CopyButton from './CopyButton';
import Icon from './Icon';
import { convertEditorHtmlToUpworkText } from '@/lib/formatConverter';

/**
 * The full /editor workspace. Deliberately locked to exactly 100vh with no
 * page-level scrolling. The nav bar itself is NOT rendered here — it's
 * rendered once in the root layout (see SiteNavBar.tsx) so it stays mounted
 * across navigation instead of unmounting/remounting per page. This
 * component only reserves a spacer the same height as that fixed bar, then
 * the instruction bar and toolbar row take only the height their content
 * needs (shrink-0), and the editor/preview panels below them absorb all
 * remaining space (flex-1 min-h-0) and scroll internally instead of pushing
 * the page taller.
 */
export default function FormatterApp() {
  const editorRef = useRef<EditorHandle>(null);
  const [convertedText, setConvertedText] = useState('');
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    bullet: false,
    numbered: false,
  });

  const handleEditorChange = (html: string) => {
    setConvertedText(convertEditorHtmlToUpworkText(html));
  };

  const handleLink = () => {
    const url = window.prompt('Enter the URL to link:', 'https://');
    if (!url || !url.trim()) return;
    editorRef.current?.insertLink(url.trim());
  };

  const handleClear = () => {
    editorRef.current?.clear();
    setConvertedText('');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface">
      {/* Spacer for the fixed NavBar rendered in the root layout (same h-16
          it renders at) — keeps the rest of this flex column starting right
          below it instead of being covered by it. */}
      <div className="h-16 shrink-0" aria-hidden="true" />

      {/* Instruction bar — natural height only */}
      <div className="shrink-0 border-b border-outline-variant bg-surface-container-low px-4 py-2 sm:px-6">
        <p className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 text-xs text-on-surface-variant">
          <span className="font-semibold text-on-surface">Shortcuts:</span>
          <span>
            <kbd className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[11px] shadow-sm">Ctrl/⌘+B</kbd> bold
          </span>
          <span>
            <kbd className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[11px] shadow-sm">Ctrl/⌘+I</kbd> italic
          </span>
          <span>
            <kbd className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[11px] shadow-sm">Ctrl/⌘+U</kbd> underline
          </span>
          <span className="text-on-surface-variant/60">·</span>
          <span>
            Or type <code className="rounded bg-surface-container-lowest px-1 py-0.5">**bold**</code>,{' '}
            <code className="rounded bg-surface-container-lowest px-1 py-0.5">_italic_</code>,{' '}
            <code className="rounded bg-surface-container-lowest px-1 py-0.5">~underline~</code>,{' '}
            <code className="rounded bg-surface-container-lowest px-1 py-0.5">- </code> or{' '}
            <code className="rounded bg-surface-container-lowest px-1 py-0.5">1. </code> as you go.
          </span>
        </p>
      </div>

      {/* Toolbar row — natural height only */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest px-4 py-3 sm:px-6">
        <Toolbar
          onBold={() => editorRef.current?.exec('bold')}
          onItalic={() => editorRef.current?.exec('italic')}
          onUnderline={() => editorRef.current?.exec('underline')}
          onBullet={() => editorRef.current?.exec('insertUnorderedList')}
          onNumbered={() => editorRef.current?.exec('insertOrderedList')}
          onLink={handleLink}
          active={activeFormats}
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-error"
          >
            <Icon name="delete" className="text-[18px]" />
            Clear
          </button>
          <CopyButton text={convertedText} />
        </div>
      </div>

      {/* Dual-panel workspace — absorbs all remaining height, scrolls internally */}
      <div className="flex flex-1 min-h-0 flex-col divide-y divide-outline-variant md:flex-row md:divide-x md:divide-y-0">
        <div className="flex flex-1 min-h-0 flex-col p-4 sm:p-6">
          <span className="mb-2 block shrink-0 text-sm font-semibold text-on-surface-variant">Editor</span>
          <div className="flex-1 min-h-0">
            <Editor
              ref={editorRef}
              onChange={handleEditorChange}
              onSelectionChange={setActiveFormats}
              placeholder="Type or paste your text — select it and use the toolbar, or type **bold**, _italic_, ~underline~, '- ' or '1. '…"
            />
          </div>
        </div>

        <div className="flex flex-1 min-h-0 flex-col bg-surface-container-lowest p-4 sm:p-6">
          <span className="mb-2 block shrink-0 text-sm font-semibold text-on-surface-variant">
            Preview — this is exactly what pastes into Upwork
          </span>
          <div className="flex-1 min-h-0">
            <PreviewPane text={convertedText} />
          </div>
        </div>
      </div>
    </div>
  );
}
