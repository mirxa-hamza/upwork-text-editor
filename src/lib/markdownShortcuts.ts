/**
 * markdownShortcuts.ts
 *
 * Pure pattern-matching for the editor's "type Markdown, get real formatting"
 * convenience: **bold**, _italic_, ~underline~ inline, and "- "/"* " or
 * "1. " at the start of a line to start a list. This is a UI nicety layered
 * on top of the toolbar (the toolbar remains the primary, required way to
 * format per the assignment) — added because typing shorthand is how people
 * expect a lot of formatting-aware text tools to behave.
 *
 * These functions only do string matching — no DOM, no Range/Selection —
 * so, like formatConverter.ts, they're unit-testable with plain Node via
 * `tsx`. The DOM mutation (actually replacing the typed delimiters with a
 * real <b>/<i>/<u> element, or triggering execCommand for lists) lives in
 * Editor.tsx, which is the only place that needs a browser.
 */

export type InlineShortcutMatch = {
  /** Offset within the text node where the opening delimiter starts. */
  start: number;
  /** Offset within the text node right after the closing delimiter (i.e. the caret position). */
  end: number;
  /** The text that was between the delimiters, with the delimiters themselves stripped. */
  content: string;
  tag: 'b' | 'i' | 'u';
};

const INLINE_DELIMITERS: Array<{ delim: string; tag: 'b' | 'i' | 'u' }> = [
  { delim: '**', tag: 'b' },
  { delim: '_', tag: 'i' },
  { delim: '~', tag: 'u' },
];

/**
 * Given the plain text immediately before the caret (within the current
 * text node), detects whether the user just typed a closing delimiter that
 * completes a **bold**, _italic_, or ~underline~ span, and returns the span
 * to replace plus which tag to wrap it in.
 *
 * Requires, to avoid false positives on ordinary text: non-empty content,
 * no leading/trailing whitespace just inside the delimiters (so "* * word * *"-
 * style spacing doesn't match), the opening delimiter sits at a word
 * boundary (start of the text or preceded by whitespace — so "foo**bar**"
 * does NOT trigger off the "bar" between the two inner asterisks), and no
 * unmatched delimiter inside the content (so an already-converted earlier
 * pair on the same line isn't re-matched).
 */
export function matchInlineShortcut(textBefore: string): InlineShortcutMatch | null {
  for (const { delim, tag } of INLINE_DELIMITERS) {
    const match = matchOneDelimiter(textBefore, delim, tag);
    if (match) return match;
  }
  return null;
}

function matchOneDelimiter(textBefore: string, delim: string, tag: 'b' | 'i' | 'u'): InlineShortcutMatch | null {
  if (!textBefore.endsWith(delim)) return null;

  const beforeClose = textBefore.slice(0, -delim.length);
  const openIdx = beforeClose.lastIndexOf(delim);
  if (openIdx === -1) return null;

  const content = beforeClose.slice(openIdx + delim.length);
  if (content.length === 0) return null;
  if (/^\s|\s$/.test(content)) return null;
  if (content.includes(delim)) return null;

  const charBeforeOpen = openIdx > 0 ? beforeClose[openIdx - 1] : '';
  if (charBeforeOpen && !/\s/.test(charBeforeOpen)) return null;

  return { start: openIdx, end: textBefore.length, content, tag };
}

export type BlockShortcut = 'bullet' | 'numbered';

/**
 * Detects the plain-text trigger for a list, when it is literally the
 * entire line typed so far: "- " or "* " starts a bullet list, "1. " starts
 * a numbered list. (Only the first item needs the shortcut — pressing Enter
 * inside a native <ul>/<ol> already continues the list on its own.)
 */
export function matchBlockShortcut(lineTextSoFar: string): BlockShortcut | null {
  if (lineTextSoFar === '- ' || lineTextSoFar === '* ') return 'bullet';
  if (lineTextSoFar === '1. ') return 'numbered';
  return null;
}
