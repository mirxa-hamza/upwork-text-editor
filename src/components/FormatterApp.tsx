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
    <section id="editor" className="flex-1 min-h-0 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      {/* Rules / Instructions Bar */}
      <div className="mb-4 flex flex-row flex-wrap items-center justify-center gap-3 text-xs text-slate-600 px-3 py-2 bg-slate-100 rounded-md border border-slate-200">
        <span className="font-semibold text-slate-800">Shortcuts:</span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 font-mono shadow-sm border border-slate-200">Ctrl+B/I/U</kbd></span>
        <span className="text-slate-400">|</span>
        <span>Or type <code className="rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">**bold**</code></span>
        <span><code className="rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">_italic_</code></span>
        <span><code className="rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">~underline~</code></span>
        <span><code className="rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">- list</code></span>
        <span><code className="rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">1. numbered</code></span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl bg-white shadow-md border border-slate-200">
        {/* Toolbar row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
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
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
            >
              <Icon name="delete" className="text-[16px]" />
              Clear
            </button>
            <CopyButton text={convertedText} />
          </div>
        </div>

        {/* Dual panel: editor left, preview right */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="flex-1 min-h-0 flex flex-col p-4">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Editor</span>
            <div className="flex-1 min-h-0">
              <Editor
                ref={editorRef}
                onChange={handleEditorChange}
                onSelectionChange={setActiveFormats}
                placeholder="Type or paste your text — select it and use the toolbar, or type **bold**, _italic_, ~underline~, '- ' or '1. '…"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col bg-slate-50 p-4">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Preview — exactly what pastes into Upwork
            </span>
            <div className="flex-1 min-h-0">
              <PreviewPane text={convertedText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
