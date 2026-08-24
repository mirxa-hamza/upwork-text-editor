/**
 * Standalone tests for markdownShortcuts.ts. Run with:
 *   npx tsx src/lib/markdownShortcuts.test.ts
 */

import assert from 'node:assert/strict';
import { matchInlineShortcut, matchBlockShortcut } from './markdownShortcuts';

type Case = { name: string; run: () => void };
const cases: Case[] = [];
const test = (name: string, run: () => void) => cases.push({ name, run });

// ---------------------------------------------------------------------------
// Inline: **bold** / _italic_ / ~underline~
// ---------------------------------------------------------------------------

test('**bold** at the start of a line matches bold', () => {
  const m = matchInlineShortcut('**hello**');
  assert.ok(m);
  assert.equal(m?.tag, 'b');
  assert.equal(m?.content, 'hello');
  assert.equal(m?.start, 0);
  assert.equal(m?.end, '**hello**'.length);
});

test('_italic_ matches italic', () => {
  const m = matchInlineShortcut('_hello_');
  assert.ok(m);
  assert.equal(m?.tag, 'i');
  assert.equal(m?.content, 'hello');
});

test('~underline~ matches underline', () => {
  const m = matchInlineShortcut('~hello~');
  assert.ok(m);
  assert.equal(m?.tag, 'u');
  assert.equal(m?.content, 'hello');
});

test('a shortcut mid-sentence matches only the just-closed span', () => {
  const m = matchInlineShortcut('Please make this **bold**');
  assert.ok(m);
  assert.equal(m?.content, 'bold');
  assert.equal(m?.start, 'Please make this '.length);
  assert.equal(m?.end, 'Please make this **bold**'.length);
});

test('an unclosed delimiter does not match', () => {
  assert.equal(matchInlineShortcut('**bold'), null);
  assert.equal(matchInlineShortcut('_italic'), null);
});

test('empty content between delimiters does not match', () => {
  assert.equal(matchInlineShortcut('****'), null);
  assert.equal(matchInlineShortcut('__'), null);
});

test('leading or trailing whitespace inside the delimiters does not match', () => {
  assert.equal(matchInlineShortcut('** bold**'), null);
  assert.equal(matchInlineShortcut('**bold **'), null);
});

test('opening delimiter must sit at a word boundary — mid-word does not match', () => {
  // "bar" here is glued to "foo" with no space, so this should NOT trigger
  // italic on "bar" even though there's a well-formed "_..._" at the end.
  assert.equal(matchInlineShortcut('foo_bar_'), null);
});

test('opening delimiter preceded by whitespace does match', () => {
  const m = matchInlineShortcut('foo _bar_');
  assert.ok(m);
  assert.equal(m?.content, 'bar');
});

test('a second, later pair on the same line matches only the new (rightmost) pair, not a stale earlier one', () => {
  const m = matchInlineShortcut('**one** and **two**');
  assert.ok(m);
  assert.equal(m?.content, 'two');
});

test('adjacent double delimiters with nothing between them do not match (empty content)', () => {
  assert.equal(matchInlineShortcut('snake__'), null);
});

// ---------------------------------------------------------------------------
// Block: "- " / "* " -> bullet, "1. " -> numbered
// ---------------------------------------------------------------------------

test('"- " triggers a bullet list', () => {
  assert.equal(matchBlockShortcut('- '), 'bullet');
});

test('"* " triggers a bullet list', () => {
  assert.equal(matchBlockShortcut('* '), 'bullet');
});

test('"1. " triggers a numbered list', () => {
  assert.equal(matchBlockShortcut('1. '), 'numbered');
});

test('"2. " does not trigger (only the first item needs the shortcut)', () => {
  assert.equal(matchBlockShortcut('2. '), null);
});

test('a dash that is not a standalone line-start trigger does not match', () => {
  assert.equal(matchBlockShortcut('well- '), null);
  assert.equal(matchBlockShortcut('-  '), null);
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
