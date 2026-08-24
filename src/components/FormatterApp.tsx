'use client';

import { useRef, useState } from 'react';
import Editor, { type EditorHandle } from './Editor';
import Toolbar from './Toolbar';
import PreviewPane from './PreviewPane';
import CopyButton from './CopyButton';
import { convertEditorHtmlToUpworkText } from '@/lib/formatConverter';

export default function FormatterApp() {
  const editorRef = useRef<EditorHandle>(null);
  const [convertedText, setConvertedText] = useState('');

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
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Upwork Text Formatter</h1>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
          Upwork strips bold, italic, underline, bullets, numbering, and clickable links from
          anything you paste. Format your text below with the toolbar, then copy the result —
          it&apos;s plain text under the hood, built from Unicode characters that already look
          formatted, so Upwork can&apos;t strip it.
        </p>
      </header>

      <Toolbar
        onBold={() => editorRef.current?.exec('bold')}
        onItalic={() => editorRef.current?.exec('italic')}
        onUnderline={() => editorRef.current?.exec('underline')}
        onBullet={() => editorRef.current?.exec('insertUnorderedList')}
        onNumbered={() => editorRef.current?.exec('insertOrderedList')}
        onLink={handleLink}
        onClear={handleClear}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">Editor</span>
          <Editor
            ref={editorRef}
            onChange={handleEditorChange}
            placeholder="Type or paste your text — select it and use the toolbar, or type **bold**, _italic_, ~underline~, '- ' or '1. '…"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">Preview — this is exactly what pastes into Upwork</span>
          <PreviewPane text={convertedText} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={convertedText} />
        <span className="text-xs text-slate-500">
          Works in job posts, proposals, and messages. Tip: typing{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">**bold**</code>,{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">_italic_</code>,{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">~underline~</code>, or starting a
          line with <code className="rounded bg-slate-100 px-1 py-0.5">- </code> /{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">1. </code> auto-formats as you type.
          Underline uses a Unicode combining character — always double-check it renders correctly
          in the specific field you&apos;re pasting into.
        </span>
      </div>
    </div>
  );
}
