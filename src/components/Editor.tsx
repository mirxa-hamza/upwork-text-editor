'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { matchInlineShortcut, matchBlockShortcut } from '@/lib/markdownShortcuts';

const BLOCK_TAG_NAMES = new Set(['DIV', 'P', 'LI']);
const TAG_TO_COMMAND: Record<'b' | 'i' | 'u', string> = { b: 'bold', i: 'italic', u: 'underline' };

function closestBlockElement(node: Node, root: HTMLElement): HTMLElement | null {
  let el = node.parentElement;
  while (el && el !== root) {
    if (BLOCK_TAG_NAMES.has(el.tagName)) return el;
    el = el.parentElement;
  }
  return el === root ? root : null;
}

// /**
//  * Runs right after every keystroke. Detects the two Markdown-style
//  * shortcuts this editor supports — **bold**/_italic_/~underline~ inline,
//  * and "- "/"* "/"1. " at the very start of a line — and, on a match,
//  * replaces the typed delimiters with real formatting (a <b>/<i>/<u>
//  * element, or a native list via execCommand). The actual pattern matching
//  * lives in markdownShortcuts.ts and is unit-tested there; this function is
//  * just the DOM glue, which needs a browser to test.
//  *
//  * Returns true if it changed anything (caller re-syncs preview state either
//  * way, but this is useful for callers that want to know).
//  */
function applyMarkdownShortcuts(root: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return false;

  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE || !root.contains(node)) return false;

  const textNode = node as Text;
  const caretOffset = range.startOffset;
  const textBefore = textNode.textContent?.slice(0, caretOffset) ?? '';

  // --- Block-level: "- " / "* " -> bullet list, "1. " -> numbered list ---
  // Only fires when the trigger is literally the whole line typed so far.
  const block = closestBlockElement(textNode, root);
  if (block && block.textContent === textBefore) {
    const blockMatch = matchBlockShortcut(textBefore);
    if (blockMatch) {
      const clear = document.createRange();
      clear.setStart(textNode, 0);
      clear.setEnd(textNode, caretOffset);
      clear.deleteContents();

      const caret = document.createRange();
      caret.setStart(textNode, 0);
      caret.collapse(true);
      selection.removeAllRanges();
      selection.addRange(caret);

      document.execCommand(blockMatch === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList');
      return true;
    }
  }

  // --- Inline: **bold**, _italic_, ~underline~ just closed ---
  const inlineMatch = matchInlineShortcut(textBefore);
  if (inlineMatch) {
    const wrapRange = document.createRange();
    wrapRange.setStart(textNode, inlineMatch.start);
    wrapRange.setEnd(textNode, inlineMatch.end);
    wrapRange.deleteContents();

    const el = document.createElement(inlineMatch.tag);
    el.textContent = inlineMatch.content;
    wrapRange.insertNode(el);

    const after = document.createRange();
    after.setStartAfter(el);
    after.collapse(true);
    selection.removeAllRanges();
    selection.addRange(after);

    // A collapsed caret placed immediately after an inline element like <b>
    // is a boundary Chrome resolves ambiguously: left alone, whatever you
    // type next keeps "sticking" to bold/italic/underline instead of coming
    // out as plain text. queryCommandState reflects that pending "typing
    // style"; toggling the same command back off clears it for the caret
    // without touching any DOM content.
    const command = TAG_TO_COMMAND[inlineMatch.tag];
    if (document.queryCommandState(command)) {
      document.execCommand(command);
    }

    return true;
  }

  return false;
}

export type EditorHandle = {
  /** Runs a document.execCommand formatting action (bold/italic/underline/lists) and re-syncs state. */
  exec: (command: string, value?: string) => void;
  /** Wraps the current selection (or, if the caret is collapsed, inserts the URL itself) in a link. */
  insertLink: (url: string) => void;
  focus: () => void;
  clear: () => void;
  getHtml: () => string;
};

type EditorProps = {
  onChange: (html: string) => void;
  placeholder?: string;
};

const Editor = forwardRef<EditorHandle, EditorProps>(function Editor({ onChange, placeholder }, ref) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force execCommand to emit plain tags (<b>, <i>, <u>) instead of
    // inline style="font-weight:bold" spans, so formatConverter's tag-based
    // parsing stays predictable regardless of which formats are combined.
    try {
      document.execCommand('defaultParagraphSeparator', false, 'div');
      document.execCommand('styleWithCSS', false, 'false');
    } catch {
      // execCommand is best-effort and safe to skip if unsupported.
    }
  }, []);

  const notify = () => onChange(divRef.current?.innerHTML ?? '');

  const handleInput = () => {
    const root = divRef.current;
    if (root) applyMarkdownShortcuts(root);
    notify();
  };

  useImperativeHandle(ref, () => ({
    exec: (command, value) => {
      divRef.current?.focus();
      document.execCommand(command, false, value);
      notify();
    },
    insertLink: (url) => {
      const container = divRef.current;
      const selection = window.getSelection();
      if (!container || !selection) return;
      container.focus();

      // If the selection isn't inside the editor (e.g. focus moved away
      // while the URL prompt was open), fall back to appending at the end.
      let range: Range;
      if (
        selection.rangeCount > 0 &&
        container.contains(selection.getRangeAt(0).commonAncestorContainer)
      ) {
        range = selection.getRangeAt(0);
      } else {
        range = document.createRange();
        range.selectNodeContents(container);
        range.collapse(false);
      }

      const anchor = document.createElement('a');
      anchor.href = url;

      if (range.collapsed) {
        // Nothing selected: the URL itself becomes the visible link text.
        anchor.textContent = url;
        range.insertNode(anchor);
      } else {
        anchor.appendChild(range.extractContents());
        range.insertNode(anchor);
      }

      const after = document.createRange();
      after.setStartAfter(anchor);
      after.collapse(true);
      selection.removeAllRanges();
      selection.addRange(after);

      notify();
    },
    focus: () => divRef.current?.focus(),
    clear: () => {
      if (divRef.current) divRef.current.innerHTML = '';
      notify();
    },
    getHtml: () => divRef.current?.innerHTML ?? '',
  }));

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onPaste={(e) => {
        // Always paste as plain text. The whole point of this tool is that
        // *this* toolbar controls formatting — letting Word/Google Docs
        // formatting leak in through paste would defeat the purpose.
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        notify();
      }}
      data-placeholder={placeholder}
      className="h-full min-h-[420px] w-full overflow-y-auto whitespace-pre-wrap rounded-lg border border-surface-variant bg-surface-container-lowest p-4 leading-relaxed text-on-surface focus:outline-none focus:ring-2 focus:ring-upwork-green empty:before:text-on-surface-variant/50 empty:before:content-[attr(data-placeholder)] [&_a]:text-upwork-green [&_a]:underline"
    />
  );
});

export default Editor;
