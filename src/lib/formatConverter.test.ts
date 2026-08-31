/**
 * Standalone tests for formatConverter.ts / unicodeMaps.ts.
 *
 * No test framework, no jsdom, no Next.js — just Node's built-in assert
 * module, runnable with:
 *
 *   npx tsx src/lib/formatConverter.test.ts
 *
 * This is deliberately dependency-free so the core conversion logic can be
 * verified in complete isolation from the UI, per the assignment's "keep
 * this separate from the UI so it's easy to test."
 */

import assert from 'node:assert/strict';
import { convertEditorHtmlToUpworkText } from './formatConverter';
import { toStyledChar, styleText } from './unicodeMaps';

type Case = { name: string; run: () => void };
const cases: Case[] = [];
const test = (name: string, run: () => void) => cases.push({ name, run });

// ---------------------------------------------------------------------------
// unicodeMaps: codepoint-level checks
// ---------------------------------------------------------------------------

test('bold uppercase A maps to U+1D400', () => {
  assert.equal(toStyledChar('A', { bold: true, italic: false }), '𝐀');
  assert.equal('𝐀'.codePointAt(0), 0x1d400);
});

test('bold lowercase a maps to U+1D41A', () => {
  assert.equal('𝐚'.codePointAt(0), 0x1d41a);
  assert.equal(toStyledChar('a', { bold: true, italic: false }), '𝐚');
});

test('italic lowercase h uses the U+210E Planck-constant fallback (U+1D455 is an unassigned gap)', () => {
  const result = toStyledChar('h', { bold: false, italic: true });
  assert.equal(result.codePointAt(0), 0x210e);
});

test('italic uppercase A maps to U+1D434', () => {
  assert.equal(toStyledChar('A', { bold: false, italic: true }).codePointAt(0), 0x1d434);
});

test('bold+italic uppercase A maps to U+1D468', () => {
  assert.equal(toStyledChar('A', { bold: true, italic: true }).codePointAt(0), 0x1d468);
});

test('bold digit 7 maps to the bold digit set (U+1D7CE base)', () => {
  const result = toStyledChar('7', { bold: true, italic: false });
  assert.equal(result.codePointAt(0), 0x1d7ce + 7);
});

test('italic-only digits are left as plain ASCII (no italic digit variant exists in Unicode)', () => {
  assert.equal(toStyledChar('7', { bold: false, italic: true }), '7');
});

test('punctuation, spaces, and non-Latin characters pass through unchanged', () => {
  assert.equal(toStyledChar('!', { bold: true, italic: true }), '!');
  assert.equal(toStyledChar(' ', { bold: true, italic: false }), ' ');
});

test('styleText applies U+0332 combining underline after every character, including spaces', () => {
  const result = styleText('Hi there', { bold: false, italic: false, underline: true });
  const expectedChars = Array.from('Hi there')
    .map((ch) => ch + '̲')
    .join('');
  assert.equal(result, expectedChars);
});

test('bold + underline together: underline combines after the already-bold codepoint', () => {
  const result = styleText('Hi', { bold: true, italic: false, underline: true });
  assert.equal(result, '𝐇̲𝐢̲');
});

// ---------------------------------------------------------------------------
// formatConverter: HTML -> Upwork plain text
// ---------------------------------------------------------------------------

test('plain text with no tags passes through unchanged', () => {
  assert.equal(convertEditorHtmlToUpworkText('hello world'), 'hello world');
});

test('empty / whitespace-only input converts to an empty string', () => {
  assert.equal(convertEditorHtmlToUpworkText(''), '');
  assert.equal(convertEditorHtmlToUpworkText('   '), '');
});

test('<b> and <strong> both apply bold', () => {
  assert.equal(convertEditorHtmlToUpworkText('<b>hi</b>'), '𝐡𝐢');
  assert.equal(convertEditorHtmlToUpworkText('<strong>hi</strong>'), '𝐡𝐢');
});

test('<i> and <em> both apply italic', () => {
  const expected = styleText('hi', { bold: false, italic: true, underline: false }); // 'ℎ𝑖' — h uses the U+210E fallback
  assert.equal(convertEditorHtmlToUpworkText('<i>hi</i>'), expected);
  assert.equal(convertEditorHtmlToUpworkText('<em>hi</em>'), expected);
});

test('nested <b><i> applies bold-italic', () => {
  const result = convertEditorHtmlToUpworkText('<b><i>hi</i></b>');
  assert.equal(result, styleText('hi', { bold: true, italic: true, underline: false }));
  // sanity: bold-italic lowercase 'h' should land in the U+1D482 lowercase bold-italic range
  assert.equal(result.codePointAt(0), 0x1d482 + ('h'.charCodeAt(0) - 'a'.charCodeAt(0)));
});

test('<u> underlines every character in the run', () => {
  const result = convertEditorHtmlToUpworkText('<u>hi</u>');
  assert.equal(result, 'h̲i̲');
});

test('multiple top-level <div> lines are separated by newlines', () => {
  const html = '<div>line one</div><div>line two</div>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'line one\nline two');
});

test('<br> inside a line creates a line break', () => {
  const html = '<div>line one<br>line two</div>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'line one\nline two');
});

test('a lone trailing empty <div><br></div> (common contentEditable artifact) is trimmed', () => {
  const html = '<div>hello</div><div><br></div>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'hello');
});

test('one blank line in the editor (<div><br></div> between two paragraphs) stays exactly one blank line in the output', () => {
  const html = '<div>Para one.</div><div><br></div><div>Para two.</div>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'Para one.\n\nPara two.');
});

test('a trailing <br> on a non-empty line does not add a spurious blank line after it', () => {
  const html = '<div>Hello world<br></div><div>Next line.</div>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'Hello world\nNext line.');
});

test('bullet list uses a plain "• " prefix per line', () => {
  const html = '<ul><li>first</li><li>second</li></ul>';
  assert.equal(convertEditorHtmlToUpworkText(html), '• first\n• second');
});

test('numbered list uses plain "1. ", "2. ", "3. " prefixes', () => {
  const html = '<ol><li>first</li><li>second</li><li>third</li></ol>';
  assert.equal(convertEditorHtmlToUpworkText(html), '1. first\n2. second\n3. third');
});

test('a second, separate numbered list restarts its counter at 1', () => {
  const html = '<ol><li>a</li><li>b</li></ol><div>between</div><ol><li>x</li></ol>';
  assert.equal(convertEditorHtmlToUpworkText(html), '1. a\n2. b\nbetween\n1. x');
});

test('list items keep inline bold/italic formatting', () => {
  const html = '<ul><li><b>bold item</b></li></ul>';
  assert.equal(convertEditorHtmlToUpworkText(html), '• ' + styleText('bold item', { bold: true, italic: false, underline: false }));
});

test('link with label different from the URL renders as "label (url)", href kept literal', () => {
  const html = '<a href="https://upwork.com">Upwork</a>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'Upwork (https://upwork.com)');
});

test('link whose label equals its URL renders as just the bare URL, not duplicated', () => {
  const html = '<a href="https://upwork.com">https://upwork.com</a>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'https://upwork.com');
});

test('a bold link keeps its href unstyled (still a valid, clickable URL) but styles the label', () => {
  const html = '<b><a href="https://upwork.com">Upwork</a></b>';
  const result = convertEditorHtmlToUpworkText(html);
  assert.equal(result, styleText('Upwork', { bold: true, italic: false, underline: false }) + ' (https://upwork.com)');
});

test('HTML entities are decoded (&amp; &lt; &gt; &nbsp;)', () => {
  const html = '<div>Tom &amp; Jerry &lt;3&gt;&nbsp;end</div>';
  assert.equal(convertEditorHtmlToUpworkText(html), 'Tom & Jerry <3> end');
});

test('a realistic mixed document matches the full expected output', () => {
  const html =
    '<div><b>Project Update</b></div>' +
    '<div>Here is my <i>proposal</i> with an <u>underlined</u> deadline.</div>' +
    '<ul><li>Design mockups</li><li>Front-end build</li></ul>' +
    '<ol><li>Kickoff call</li><li>Delivery</li></ol>' +
    '<div>See <a href="https://example.com">my portfolio</a> for more.</div>' +
    '<div><br></div>';

  const expected = [
    styleText('Project Update', { bold: true, italic: false, underline: false }),
    'Here is my ' + styleText('proposal', { bold: false, italic: true, underline: false }) + ' with an ' +
      styleText('underlined', { bold: false, italic: false, underline: true }) + ' deadline.',
    '• Design mockups',
    '• Front-end build',
    '1. Kickoff call',
    '2. Delivery',
    'See my portfolio (https://example.com) for more.',
  ].join('\n');

  assert.equal(convertEditorHtmlToUpworkText(html), expected);
});

// ---------------------------------------------------------------------------
// runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

for (const c of cases) {
  try {
    c.run();
    passed += 1;
    console.log(`  ✓ ${c.name}`);
  } catch (err) {
    failed += 1;
    console.log(`  ✗ ${c.name}`);
    console.log(err instanceof Error ? `      ${err.message}` : `      ${String(err)}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed (${cases.length} total)`);
if (failed > 0) process.exit(1);
