# Plan: Upwork Text Formatter

## 1. Goal

A single-page Next.js (App Router) app where a user types/pastes text, applies formatting
(bold, italic, underline, bullets, numbered list, link) with a toolbar, sees a live preview
of exactly what will appear when pasted into Upwork, and copies the final result with one
click. Reference UX: https://upcat.app/tools/upwork-text-formatter/ (two-panel editor +
preview, toolbar, Copy button).

## 2. Why this works (the trick)

Upwork's job post / proposal / message boxes are plain-text fields — they strip HTML and
Markdown on paste. But they can't strip Unicode. So instead of applying real bold/italic/
underline formatting, we swap each letter for a Unicode character that already *looks*
bold/italic, and use a combining character to draw an underline under each character. The
result is a plain-text string that *renders* as formatted text anywhere, including Upwork.

## 3. Tech stack (already scaffolded by the user locally)

- Next.js **15.5.10**, App Router, TypeScript, Turbopack
- React 19.1.0
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- ESLint 9 / eslint-config-next
- No extra runtime dependencies planned — the rich-text editor is a hand-rolled
  `contentEditable` box driven by `document.execCommand` (bold/italic/underline/lists/link),
  which keeps the app dependency-free and easy to audit. No login, no API calls, no backend.

## 4. Unicode research (must be correct — this is the core of the assignment)

### 4.1 Bold / Italic / Bold-Italic — Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF)

Each style is a contiguous run of 26 uppercase + 26 lowercase codepoints (all outside the
Basic Multilingual Plane, so JS must build them with `String.fromCodePoint`, not
`fromCharCode`):

| Style | Uppercase A–Z starts at | Lowercase a–z starts at | Notes |
|---|---|---|---|
| Bold | U+1D400 | U+1D41A | digits 0–9 also have a bold set: U+1D7CE |
| Italic | U+1D434 | U+1D44E | **U+1D455 (italic lowercase h) is unassigned** — must special-case it to U+210E (PLANCK CONSTANT), the character every "fancy text" generator substitutes |
| Bold Italic | U+1D468 | U+1D482 | fully contiguous, no gaps |

Digits have **no italic variant** in Unicode — generators leave italic digits as plain
ASCII. Bold digits exist (U+1D7CE base), so bold and bold-italic runs render digits in the
bold digit set (there's no separate bold-italic digit block).

Implementation: a single `toStyledChar(char, {bold, italic})` function does a codepoint
offset lookup per character, with the `h` and digit exceptions handled explicitly.

### 4.2 Underline — combining character U+0332 (COMBINING LOW LINE)

Insert U+0332 immediately after each base character (including spaces) in an underlined
run. Combining marks attach to whatever precedes them, so this works after a plain letter
or after an already-bold/italic-mapped codepoint. This must be verified by actually pasting
into Upwork (see §7) — combining-character underlines are known to render inconsistently
across some fonts/renderers, so this is a "trust but verify" item, not an assumption.

### 4.3 Bullets

Plain `• ` prefix on each line. No nesting beyond one level (matches "Not needed" scope).

### 4.4 Numbered lists

Plain `1. `, `2. `, `3. ` … prefix, counter increments per item and resets at the start of
each new numbered list.

### 4.5 Hyperlinks

Upwork fields are plain text, so a `createLink`-produced `<a href>` in the editor can't
survive as a clickable HTML link. The converter emits the link as visible plain text
(`label (url)` when the label differs from the URL, otherwise just the bare URL). Whether
Upwork *auto-links* a bare `https://…` URL once pasted depends on the field — this is
tested live and documented in TESTING.md, not assumed.

### 4.6 Undo/Redo

This is a browser/contentEditable limitation, not something the converter can fix: once
Unicode-swapped text (or any pasted text) lands in a plain `<textarea>`/`contenteditable`
field like Upwork's, the browser's native undo stack for *that* field often doesn't treat
the paste as a single coherent unit the way it tracks native typing, so Ctrl+Z can behave
oddly (undo the whole paste in one jump, or do nothing, depending on browser/field). We
document this rather than "fix" it, per the assignment.

## 5. Architecture / file structure

```
upwork-text-formatter/
├── plan.md
├── TESTING.md                     # research + live Upwork test results (§7)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # metadata, font, global styles
│   │   ├── page.tsx                # thin wrapper that renders <FormatterApp />
│   │   └── globals.css             # Tailwind entry + minor base styles
│   ├── components/
│   │   ├── FormatterApp.tsx        # page state: editor HTML, converted text, layout
│   │   ├── Toolbar.tsx             # Bold/Italic/Underline/Bullet/Numbered/Link/Clear buttons
│   │   ├── Editor.tsx              # contentEditable box, wraps execCommand calls
│   │   ├── PreviewPane.tsx         # shows converted Unicode text
│   │   └── CopyButton.tsx          # navigator.clipboard.writeText + "Copied!" state
│   └── lib/
│       ├── formatConverter.ts       # pure: editor HTML string -> Upwork-ready Unicode text
│       ├── unicodeMaps.ts           # the codepoint tables + toStyledChar() from §4.1/4.2
│       ├── formatConverter.test.ts  # standalone tests, run with `tsx` (no test runner dep)
│       ├── markdownShortcuts.ts     # pure pattern-matching for §6.1's "type Markdown" shortcuts
│       └── markdownShortcuts.test.ts
```

`formatConverter.ts` has **zero DOM/React dependencies** beyond parsing an HTML string with
a small hand-rolled tokenizer (the editor only ever produces a known, narrow set of tags:
`div, p, br, b, strong, i, em, u, ul, ol, li, a`), so it can be unit-tested with plain
Node via `tsx` — no jsdom, no Next.js runtime needed. This satisfies the assignment's "keep
this separate from the UI so it's easy to test."

## 6. Editor behavior

- `contentEditable` div; toolbar buttons call `document.execCommand('bold' | 'italic' |
  'underline' | 'insertUnorderedList' | 'insertOrderedList' | 'createLink')` against the
  current selection — a deliberately low-tech, dependency-free approach appropriate for a
  "simple editor."
- On every input event, `editor.innerHTML` is read and passed through
  `formatConverter.ts` to produce the live preview text.
- Clear button resets the editor and preview.
- Copy button copies exactly the string shown in the preview pane (same variable, no
  re-derivation), satisfying the "copy button copies exactly what's shown" requirement.

### 6.1 Markdown-shorthand typing (added after initial build, per user request)

The toolbar (select text, click a button) is the primary, required way to format, per the
assignment. On top of that, the editor also recognizes Markdown-style shorthand as you type,
since that's a common expectation for formatting-aware text tools:

| Type this | Get this |
|---|---|
| `**word**` | **bold** |
| `_word_` | *italic* |
| `~word~` | underline |
| `- ` or `* ` at the start of an empty line | starts a bullet list |
| `1. ` at the start of an empty line | starts a numbered list |

Design:

- **Pattern matching is pure and separate from the DOM**, same philosophy as
  `formatConverter.ts`: `src/lib/markdownShortcuts.ts` exports `matchInlineShortcut(textBeforeCaret)`
  and `matchBlockShortcut(lineTextSoFar)`, both plain string functions with zero DOM
  dependency, unit-tested in `markdownShortcuts.test.ts` via `tsx` (16 tests).
- **The DOM mutation lives in `Editor.tsx`** (`applyMarkdownShortcuts()`), which runs on every
  keystroke (`onInput`). On an inline match it deletes the typed delimiters and replaces them
  with a real `<b>`/`<i>`/`<u>` element (so `formatConverter.ts` needs zero changes — it
  already understands those tags). On a block match it strips the `- `/`1. ` prefix and calls
  the same `execCommand('insertUnorderedList' | 'insertOrderedList')` the toolbar buttons use.
- **False-positive guards** on the inline matcher: content between delimiters can't be empty
  or have leading/trailing whitespace, can't contain the delimiter again (so an
  already-converted earlier pair on the same line isn't re-matched), and the opening
  delimiter must sit at a word boundary (start of line or preceded by whitespace) — so
  `foo_bar_` does **not** trigger italic on "bar". This is the same trade-off every Markdown
  shorthand implementation (Slack, Discord, Notion, …) makes: it's a heuristic, not a full
  parser, and unusual text with stray `*`/`_`/`~` characters can still occasionally
  false-trigger. Low risk, but worth knowing about.
- **List shortcuts only fire on an empty line** (the trigger text must be the *entire* line
  typed so far) — this avoids misfiring on text that merely contains "1. " mid-sentence.
  Continuing a list after the first item relies on the browser's native Enter-key behavior
  inside a real `<ul>`/`<ol>`, not on re-detecting "2. ".
- **Known limitation**: the inline replacement is a direct DOM mutation (`Range.deleteContents`
  / `insertNode`), not something `execCommand` tracks — so, consistent with the assignment's
  existing "undo/redo is a browser limitation, document it, don't fix it" stance for pasting
  into Upwork (§4.6), Ctrl+Z right after an auto-conversion may not cleanly revert just that
  conversion in every browser.
- **Fixed bug: "sticky" formatting after the closing delimiter.** Placing a collapsed caret
  immediately after a freshly-inserted `<b>`/`<i>`/`<u>` element is a boundary Chrome resolves
  ambiguously — left alone, whatever you typed *next* kept extending the bold/italic/underline
  run instead of coming out as plain text (reported by the user testing locally). Fixed by
  checking `document.queryCommandState(command)` right after placing the caret and, if it
  reports the "typing style" is still on, toggling the same `execCommand(command)` back off —
  this clears the pending style for the caret without touching any DOM content, unlike a
  zero-width-space workaround. This is DOM/Selection-API behavior, so it isn't covered by the
  Node-only unit tests in `markdownShortcuts.test.ts` — it needs a real browser to verify,
  pending the user re-testing locally after this fix.

## 7. Verification plan (maps to the assignment's "Done When" list)

1. **Unit tests** (`src/lib/formatConverter.test.ts`, run via `npx tsx`) — deterministic
   checks that specific input HTML produces the exact expected Unicode string, for bold,
   italic, bold+italic, underline, bold+underline, bullets, numbered lists, links, and
   mixed paragraphs. Plus `src/lib/markdownShortcuts.test.ts` (16 tests) for the §6.1
   shorthand matcher — both suites pass (44/44) as of this writing.
2. **Live Upwork test** — with the dev server running locally and the user logged into
   Upwork in Chrome, use browser automation to paste sample bold/italic/underline/bulleted/
   numbered/linked output into a real Upwork field (job post, proposal, or message — whatever
   is reachable) and confirm visually it renders as intended. Findings (including anything
   that *doesn't* render as expected, e.g. underline spacing quirks) are written to
   `TESTING.md`.
3. **Hyperlink behavior** — test a bare URL pasted into Upwork fields to determine if it
   auto-links, and document it.
4. **Undo/redo** — confirm and document the behavior described in §4.6 (no fix attempted,
   per spec).

## 8. Build steps

1. Write `plan.md` (this file). ✅
2. Build `src/lib/unicodeMaps.ts` + `src/lib/formatConverter.ts`.
3. Write `src/lib/formatConverter.test.ts`, run it with `tsx` in the cloud sandbox to
   verify the conversion logic before it ever touches the UI.
4. Build `Toolbar.tsx`, `Editor.tsx`, `PreviewPane.tsx`, `CopyButton.tsx`, `FormatterApp.tsx`.
5. Wire into `app/page.tsx` / `app/layout.tsx`, Tailwind styling for a clean two-panel layout.
6. Deliver all files into the user's local project folder.
7. User runs `npm run dev` locally; live-test in Chrome against Upwork; write `TESTING.md`.
8. **(Follow-up, §6.1)** Add Markdown-shorthand typing on top of the toolbar: `markdownShortcuts.ts`
   + its tests, wired into `Editor.tsx`; placeholder/hint text updated so the shortcuts are
   discoverable. Delivered as an update to the same files already on disk.

## 9. Explicitly out of scope (per assignment's "Not Needed")

No login/accounts, no Upwork API integration, no attempt to match Word/Google Docs
formatting beyond bold/italic/underline/bullets/numbered lists/links.
