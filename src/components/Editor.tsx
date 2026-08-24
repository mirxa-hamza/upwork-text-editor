'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type KeyboardEvent } from 'react';
import { matchInlineShortcut, matchBlockShortcut } from '@/lib/markdownShortcuts';

const BLOCK_TAG_NAMES = new Set(['DIV', 'P', 'LI']);
const TAG_TO_COMMAND: Record<'b' | 'i' | 'u', string> = { b: 'bold', i: 'italic', u: 'underline' };
const INLINE_COMMANDS = new Set(['bold', 'italic', 'underline']);

function closestBlockElement(node: Node, root: HTMLElement): HTMLElement | null {
  let el = node.parentElement;
  while (el && el !== root) {
    if (BLOCK_TAG_NAMES.has(el.tagName)) return el;
    el = el.parentElement;
  }
  return el === root ? root : null;
}

/**
 * Runs right after every keystroke. Detects the two Markdown-style
 * shortcuts this editor supports — **bold** /_italic_/~underline~ inline,
 * and "- "/"* "/"1. " at the very start of a line — and, on a match,
 * replaces the typed delimiters with real formatting (a <b>/<i>/<u>
 * element, or a native list via execCommand). The actual pattern matching
 * lives in markdownShortcuts.ts and is unit-tested there; this function is
 * just the DOM glue, which needs a browser to test.
 *
 * Returns true if it changed anything (caller re-syncs preview state either
 * way, but this is useful for callers that want to know).
 */
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

/** Which formatting commands are "on" for the current selection/caret — drives the toolbar's active-button highlighting. */
export type ActiveFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  bullet: boolean;
  numbered: boolean;
};

const NO_ACTIVE_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  bullet: false,
  numbered: false,
};

function readActiveFormats(): ActiveFormats {
  try {
    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      bullet: document.queryCommandState('insertUnorderedList'),
      numbered: document.queryCommandState('insertOrderedList'),
    };
  } catch {
    return NO_ACTIVE_FORMATS;
  }
}

type EditorProps = {
  onChange: (html: string) => void;
  /** Reports which formats are active at the current caret/selection, so the toolbar can highlight matching buttons. */
  onSelectionChange?: (formats: ActiveFormats) => void;
  placeholder?: string;
};

const Editor = forwardRef<EditorHandle, EditorProps>(function Editor({ onChange, onSelectionChange, placeholder }, ref) {
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

  useEffect(() => {
    // Selection can change without any input event (arrow keys, clicking to
    // a new spot, selecting with the mouse) — listen document-wide and
    // filter to selections inside this editor, so the toolbar's active
    // state always matches wherever the caret actually is.
    const handleSelectionChange = () => {
      const root = divRef.current;
      const selection = window.getSelection();
      if (!root || !selection || selection.rangeCount === 0) return;
      if (!root.contains(selection.anchorNode)) return;
      onSelectionChange?.(readActiveFormats());
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [onSelectionChange]);

  const notify = () => onChange(divRef.current?.innerHTML ?? '');

  const reportActiveFormats = () => {
    const root = divRef.current;
    if (!root) return;
    const selection = window.getSelection();
    // Only report state when the selection is actually inside this editor —
    // queryCommandState reflects whatever's focused document-wide, so a
    // stray call while focus is elsewhere would show a stale/wrong state.
    if (!selection || selection.rangeCount === 0 || !root.contains(selection.anchorNode)) return;
    onSelectionChange?.(readActiveFormats());
  };

  const handleInput = () => {
    const root = divRef.current;
    if (root) applyMarkdownShortcuts(root);
    notify();
    reportActiveFormats();
  };

  // Shared by the imperative `exec` handle and the Ctrl/Cmd+B/I/U keyboard
  // shortcuts below, so both paths run the exact same focus/execCommand/sync
  // sequence.
  const runCommand = (command: string, value?: string) => {
    const root = divRef.current;
    root?.focus();

    const selection = window.getSelection();
    const hadRangeSelection = !!selection && !selection.isCollapsed;

    document.execCommand(command, false, value);

    if (hadRangeSelection && INLINE_COMMANDS.has(command)) {
      // The user selected text and pressed Bold/Italic/Underline (toolbar or
      // Ctrl/Cmd+B/I/U): format *only* that selection, then collapse the
      // caret to the end of it so typing afterwards comes out plain. Left
      // alone, a caret sitting right at the edge of the freshly-formatted
      // run is a boundary Chrome resolves ambiguously and keeps "sticking"
      // to the format — the same issue fixed for Markdown-shortcut typing
      // below, generalized here to the toolbar/keyboard-shortcut path.
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        if (document.queryCommandState(command)) {
          document.execCommand(command);
        }
      }
    }

    notify();
    reportActiveFormats();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Support both Ctrl (Windows/Linux) and Cmd (Mac) as the modifier.
    if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;

    const key = e.key.toLowerCase();
    if (key === 'b') {
      e.preventDefault();
      runCommand('bold');
    } else if (key === 'i') {
      e.preventDefault();
      runCommand('italic');
    } else if (key === 'u') {
      e.preventDefault();
      runCommand('underline');
    }
  };

  useImperativeHandle(ref, () => ({
    exec: (command, value) => runCommand(command, value),
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
      onSelectionChange?.(NO_ACTIVE_FORMATS);
    },
    getHtml: () => divRef.current?.innerHTML ?? '',
  }));

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onKeyUp={reportActiveFormats}
      onMouseUp={reportActiveFormats}
      onFocus={reportActiveFormats}
      onBlur={() => onSelectionChange?.(NO_ACTIVE_FORMATS)}
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
      className="h-full min-h-[220px] w-full overflow-y-auto whitespace-pre-wrap rounded-lg border border-surface-variant bg-surface-container-lowest p-4 leading-relaxed text-on-surface focus:outline-none focus:ring-2 focus:ring-brand empty:before:text-on-surface-variant/50 empty:before:content-[attr(data-placeholder)] [&_a]:text-brand [&_a]:underline [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-0.5"
    />
  );
});

export default Editor;
