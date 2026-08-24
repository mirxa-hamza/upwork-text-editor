'use client';

import { useRef, useState } from 'react';
import Editor, { type EditorHandle } from './Editor';
import Toolbar from './Toolbar';
import PreviewPane from './PreviewPane';
import CopyButton from './CopyButton';
import Icon from './Icon';
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
    <section id="formatter" className="scroll-mt-20">
      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-elevated shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant bg-surface-container-lowest px-4 py-3 sm:px-6">
            <Toolbar
              onBold={() => editorRef.current?.exec('bold')}
              onItalic={() => editorRef.current?.exec('italic')}
              onUnderline={() => editorRef.current?.exec('underline')}
              onBullet={() => editorRef.current?.exec('insertUnorderedList')}
              onNumbered={() => editorRef.current?.exec('insertOrderedList')}
              onLink={handleLink}
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

          <div className="grid grid-cols-1 divide-y divide-surface-variant md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-4 sm:p-6">
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">Editor</span>
              <Editor
                ref={editorRef}
                onChange={handleEditorChange}
                placeholder="Type or paste your text — select it and use the toolbar, or type **bold**, _italic_, ~underline~, '- ' or '1. '…"
              />
            </div>

            <div className="bg-surface-container-lowest p-4 sm:p-6">
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">
                Preview — this is exactly what pastes into Upwork
              </span>
              <PreviewPane text={convertedText} />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-on-surface-variant">
          Works in job posts, proposals, and messages. Tip: typing{' '}
          <code className="rounded bg-surface-container px-1 py-0.5">**bold**</code>,{' '}
          <code className="rounded bg-surface-container px-1 py-0.5">_italic_</code>,{' '}
          <code className="rounded bg-surface-container px-1 py-0.5">~underline~</code>, or starting a line with{' '}
          <code className="rounded bg-surface-container px-1 py-0.5">- </code> /{' '}
          <code className="rounded bg-surface-container px-1 py-0.5">1. </code> auto-formats as you type. Underline uses a
          Unicode combining character — always double-check it renders correctly in the specific field you&apos;re pasting
          into.
        </p>
      </div>
    </section>
  );
}
