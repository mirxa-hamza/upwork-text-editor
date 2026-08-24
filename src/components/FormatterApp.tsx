'use client';

import { useRef, useState } from 'react';
import Editor, { type ActiveFormats, type EditorHandle } from './Editor';
import Toolbar from './Toolbar';
import PreviewPane from './PreviewPane';
import CopyButton from './CopyButton';
import Icon from './Icon';
import { convertEditorHtmlToUpworkText } from '@/lib/formatConverter';

/**
 * The actual tool, embedded directly on the landing page right below the
 * hero (single page — no separate /editor route). Toolbar buttons and
 * keyboard shortcuts are unchanged; only the layout around them changed:
 * the shortcut/Markdown-shorthand instructions sit *below* the editor card
 * instead of above it, so the nav bar, hero copy, and the editor itself are
 * all visible together without the instructions pushing the tool down.
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
    <section id="editor" className="scroll-mt-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-elevated shadow-xl">
          {/* Toolbar row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant bg-surface-container-lowest px-4 py-3 sm:px-6">
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

          {/* Dual panel: editor left, preview right (stacked on mobile) */}
          <div className="grid grid-cols-1 divide-y divide-surface-variant md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-3 sm:p-4">
              <span className="mb-1.5 block text-sm font-semibold text-on-surface-variant">Editor</span>
              <Editor
                ref={editorRef}
                onChange={handleEditorChange}
                onSelectionChange={setActiveFormats}
                placeholder="Type or paste your text — select it and use the toolbar, or type **bold**, _italic_, ~underline~, '- ' or '1. '…"
              />
            </div>

            <div className="bg-surface-container-lowest p-3 sm:p-4">
              <span className="mb-1.5 block text-sm font-semibold text-on-surface-variant">
                Preview — this is exactly what pastes into Upwork
              </span>
              <PreviewPane text={convertedText} />
            </div>
          </div>
        </div>

        {/* Instructions — below the editor card, not above it */}
        <div className="mx-auto mt-4 max-w-3xl rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-on-surface-variant">
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
              <code className="rounded bg-surface-container-lowest px-1 py-0.5">1. </code> as you go. Underline uses a
              Unicode combining character — always double-check it renders correctly in the specific field you&apos;re
              pasting into.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
