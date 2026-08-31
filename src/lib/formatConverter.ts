/**
 * formatConverter.ts
 *
 * Converts the HTML produced by the app's rich-text editor into the
 * Unicode plain text Upwork will render as "formatted." This module has
 * zero DOM/React dependencies — it parses the HTML string itself with a
 * small hand-rolled tokenizer, so it can be unit-tested with plain Node
 * (see formatConverter.test.ts, run via `npx tsx`) without jsdom or a
 * browser.
 *
 * The editor only ever produces a known, narrow set of tags (because the UI
 * drives document.execCommand with styleWithCSS off): div, br, b, strong,
 * i, em, u, ul, ol, li, a. Anything else encountered is treated as a plain
 * inline wrapper and passed through safely.
 */

import { styleText, type InlineStyle, PLAIN_STYLE } from './unicodeMaps';

// ---------------------------------------------------------------------------
// 1. A tiny HTML fragment parser (no DOM APIs — works in Node and browser)
// ---------------------------------------------------------------------------

type ElementNode = {
  type: 'element';
  tag: string;
  attrs: Record<string, string>;
  children: Node[];
};
type TextNode = { type: 'text'; value: string };
type Node = ElementNode | TextNode;

const VOID_TAGS = new Set(['br', 'img', 'hr', 'input', 'meta', 'source', 'col', 'area']);

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1] === 'x' || entity[1] === 'X';
      const code = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return NAMED_ENTITIES[entity] ?? whole;
  });
}

function parseHtmlFragment(html: string): ElementNode {
  const root: ElementNode = { type: 'element', tag: '#root', attrs: {}, children: [] };
  const stack: ElementNode[] = [root];

  // One token = a full tag (<...>), an HTML comment, or a run of plain text.
  const tokenRe = /<!--[\s\S]*?-->|<[^>]+>|[^<]+/g;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(html))) {
    const token = match[0];
    if (token.startsWith('<!--')) continue;

    if (token[0] === '<') {
      const isClosing = token[1] === '/';
      const isSelfClosing = /\/>\s*$/.test(token);
      const tagMatch = token.match(/^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!tagMatch) continue;
      const tag = tagMatch[1].toLowerCase();

      if (isClosing) {
        for (let i = stack.length - 1; i > 0; i--) {
          if (stack[i].tag === tag) {
            stack.length = i;
            break;
          }
        }
        continue;
      }

      const attrs: Record<string, string> = {};
      const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s">]+))/g;
      let attrMatch: RegExpExecArray | null;
      while ((attrMatch = attrRe.exec(token))) {
        const name = attrMatch[1].toLowerCase();
        const value = attrMatch[3] ?? attrMatch[4] ?? attrMatch[5] ?? '';
        attrs[name] = decodeEntities(value);
      }

      const node: ElementNode = { type: 'element', tag, attrs, children: [] };
      stack[stack.length - 1].children.push(node);
      if (!VOID_TAGS.has(tag) && !isSelfClosing) {
        stack.push(node);
      }
    } else {
      const text = decodeEntities(token);
      if (text.length > 0) {
        stack[stack.length - 1].children.push({ type: 'text', value: text });
      }
    }
  }

  return root;
}

// ---------------------------------------------------------------------------
// 2. Markdown-in-plain-text resolver
// ---------------------------------------------------------------------------

/**
 * Segments of text produced by splitting on inline markdown delimiters.
 * Each segment carries the text content and the incremental style it adds.
 */
type TextSegment = { text: string; bold: boolean; italic: boolean; underline: boolean };

/**
 * Splits a plain text string on **bold**, _italic_, and ~underline~ delimiters,
 * returning an ordered list of segments each tagged with the formatting they
 * inherited from the delimiter pair.
 *
 * Rules (same as markdownShortcuts.ts to stay consistent):
 * - Content must be non-empty and must not start/end with whitespace.
 * - The opening delimiter must be at the very start of the string or preceded
 *   by a whitespace character (no mid-word bold like foo**bar**).
 * - `**` is matched before `_` so that `**_bold-italic_**` doesn't mis-parse.
 */
function splitOnMarkdown(text: string): TextSegment[] {
  type Delimiter = { delim: string; field: 'bold' | 'italic' | 'underline' };
  const DELIMITERS: Delimiter[] = [
    { delim: '**', field: 'bold' },
    { delim: '_', field: 'italic' },
    { delim: '~', field: 'underline' },
  ];

  // Find the leftmost matching delimiter pair in `src` starting at `offset`.
  function findFirst(
    src: string,
    offset: number,
  ): { start: number; innerStart: number; innerEnd: number; end: number; field: 'bold' | 'italic' | 'underline' } | null {
    let best: ReturnType<typeof findFirst> = null;

    for (const { delim, field } of DELIMITERS) {
      let searchFrom = offset;
      while (searchFrom < src.length) {
        const openIdx = src.indexOf(delim, searchFrom);
        if (openIdx === -1) break;

        // Opening delimiter word-boundary check.
        const charBefore = openIdx > 0 ? src[openIdx - 1] : '';
        if (charBefore && !/\s/.test(charBefore)) { searchFrom = openIdx + 1; continue; }

        const innerStart = openIdx + delim.length;
        if (innerStart >= src.length) break;
        if (/^\s/.test(src[innerStart])) { searchFrom = openIdx + 1; continue; }

        const closeIdx = src.indexOf(delim, innerStart);
        if (closeIdx === -1) break;
        if (/\s$/.test(src.slice(innerStart, closeIdx))) { searchFrom = openIdx + 1; continue; }
        if (closeIdx === innerStart) { searchFrom = openIdx + 1; continue; }

        const candidate = { start: openIdx, innerStart, innerEnd: closeIdx, end: closeIdx + delim.length, field };
        if (best === null || candidate.start < best.start) best = candidate;
        break; // earliest open for this delimiter found
      }
    }
    return best;
  }

  const segments: TextSegment[] = [];

  function recurse(src: string, offset: number, bold: boolean, italic: boolean, underline: boolean): void {
    let pos = 0;
    while (pos < src.length) {
      const match = findFirst(src, pos);
      if (!match) {
        segments.push({ text: src.slice(pos), bold, italic, underline });
        return;
      }
      // Plain text before the match.
      if (match.start > pos) {
        segments.push({ text: src.slice(pos, match.start), bold, italic, underline });
      }
      // Recurse into the matched span with the extra style toggled on.
      const inner = src.slice(match.innerStart, match.innerEnd);
      recurse(
        inner,
        0,
        bold || match.field === 'bold',
        italic || match.field === 'italic',
        underline || match.field === 'underline',
      );
      pos = match.end;
    }
  }

  recurse(text, 0, false, false, false);
  return segments;
}

/**
 * Converts a plain-text string (from the editor's text nodes) to Unicode,
 * resolving **bold**, _italic_, and ~underline~ markdown delimiters AND
 * combining the result with any style already inherited from parent HTML
 * elements (e.g. the text sits inside a `<b>` tag).
 */
function applyMarkdownToText(text: string, inheritedStyle: InlineStyle): string {
  const segments = splitOnMarkdown(text);
  return segments
    .map(({ text: seg, bold, italic, underline }) =>
      styleText(seg, {
        bold: inheritedStyle.bold || bold,
        italic: inheritedStyle.italic || italic,
        underline: inheritedStyle.underline || underline,
      }),
    )
    .join('');
}

// ---------------------------------------------------------------------------
// 3. HTML tree -> Unicode plain text
// ---------------------------------------------------------------------------

const BOLD_TAGS = new Set(['b', 'strong']);
const ITALIC_TAGS = new Set(['i', 'em']);
const UNDERLINE_TAGS = new Set(['u']);
const BLOCK_TAGS = new Set(['div', 'p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']);

function applyTagStyle(tag: string, style: InlineStyle): InlineStyle {
  return {
    bold: style.bold || BOLD_TAGS.has(tag),
    italic: style.italic || ITALIC_TAGS.has(tag),
    underline: style.underline || UNDERLINE_TAGS.has(tag),
  };
}

/** Collapses incidental HTML whitespace (source line breaks, tabs, &nbsp;) to plain spaces. */
function normalizeWhitespace(raw: string): string {
  return raw.replace(/\u00a0/g, ' ').replace(/[\t\r\n]+/g, ' ');
}

function renderInlineChildren(nodes: Node[], style: InlineStyle): string {
  let out = '';
  for (const node of nodes) {
    out += node.type === 'text'
      ? applyMarkdownToText(normalizeWhitespace(node.value), style)
      : renderInlineNode(node, style);
  }
  return out;
}

function renderInlineNode(node: ElementNode, style: InlineStyle): string {
  const tag = node.tag;

  if (tag === 'br') return '\n';

  if (tag === 'a') {
    const href = (node.attrs.href || '').trim();
    const label = renderInlineChildren(node.children, style).trim();
    if (!href) return label;
    if (label && label.toLowerCase() !== href.toLowerCase()) return `${label} (${href})`;
    return href; // href kept literal (never Unicode-mapped) so it stays a valid, linkable URL
  }

  if (tag === 'ul' || tag === 'ol') return renderList(node, style).join('\n');

  if (BLOCK_TAGS.has(tag)) {
    return renderBlockChildren(node.children, applyTagStyle(tag, style)).join('\n');
  }

  // Generic inline wrapper (span, font, etc.) — recurse with any style it adds.
  return renderInlineChildren(node.children, applyTagStyle(tag, style));
}

function renderList(node: ElementNode, style: InlineStyle): string[] {
  const isOrdered = node.tag === 'ol';
  let n = 0;
  const lines: string[] = [];
  for (const child of node.children) {
    if (child.type !== 'element' || child.tag !== 'li') continue;
    n += 1;
    const prefix = isOrdered ? `${n}. ` : '• '; // "1. " / "• "
    const content = renderBlockChildren(child.children, style).join(' ').replace(/\s+/g, ' ').trim();
    lines.push(prefix + content);
  }
  return lines;
}

/**
 * Renders a list of sibling nodes into an array of output lines. Each
 * block-level child (div/p/li/...) or list (ul/ol) starts a new line (or
 * lines); consecutive inline/text siblings accumulate onto the current line.
 */
function renderBlockChildren(nodes: Node[], style: InlineStyle): string[] {
  const lines: string[] = [];
  let current = '';
  let hasContent = false;

  const flush = () => {
    lines.push(current);
    current = '';
    hasContent = false;
  };

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === 'text') {
      current += applyMarkdownToText(normalizeWhitespace(node.value), style);
      if (node.value.trim()) hasContent = true;
      continue;
    }

    const tag = node.tag;

    if (tag === 'br') {
      // A <br> that is the LAST child of this block is almost always a
      // contentEditable artifact (browsers append one to keep an empty or
      // final line focusable/visible), not a deliberate extra line break —
      // the trailing `flush()` after this loop already terminates the
      // current line, so honoring this <br> too would double it up (one
      // blank line in the editor turning into two or three in the output).
      // A <br> that has more siblings after it (e.g. "Hello<br><br>World")
      // is a real, deliberate line break and still flushes normally.
      const isLast = i === nodes.length - 1;
      if (!isLast) flush();
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      if (hasContent) flush();
      lines.push(...renderList(node, style));
      continue;
    }

    if (BLOCK_TAGS.has(tag)) {
      if (hasContent) flush();
      lines.push(...renderBlockChildren(node.children, applyTagStyle(tag, style)));
      continue;
    }

    current += renderInlineNode(node, style);
    hasContent = true;
  }

  flush(); // always emit the trailing (possibly empty) line
  return lines;
}

// ---------------------------------------------------------------------------
// 3. Public API
// ---------------------------------------------------------------------------

/**
 * Converts the editor's `innerHTML` into the plain-text, Unicode-styled
 * string that should be pasted into Upwork. This is the single source of
 * truth for both the preview pane and the Copy button.
 */
export function convertEditorHtmlToUpworkText(html: string): string {
  if (!html || !html.trim()) return '';

  const root = parseHtmlFragment(html);
  const lines = renderBlockChildren(root.children, PLAIN_STYLE);

  // Drop purely-empty leading/trailing lines (contentEditable commonly leaves
  // a lone empty <div><br></div> at the end). Blank lines the user created
  // deliberately in the middle of their text are left untouched.
  while (lines.length && lines[0] === '') lines.shift();
  while (lines.length && lines[lines.length - 1] === '') lines.pop();

  return lines.join('\n');
}
