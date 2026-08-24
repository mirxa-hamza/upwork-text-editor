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
│   │   ├── layout.tsx              # metadata, Poppins font, Material Symbols stylesheet link
│   │   ├── page.tsx                # landing route: NavBar/Hero/WhyFormat/HowItWorks/Faq/Footer
│   │   ├── editor/
│   │   │   └── page.tsx            # editor route: renders FormatterApp (§5.3)
│   │   └── globals.css             # Tailwind entry + the color palette (§5.1, §5.3)
│   ├── components/
│   │   ├── FormatterApp.tsx        # the /editor workspace: nav, instructions, toolbar, dual panel
│   │   ├── Toolbar.tsx             # Bold/Italic/Underline/Bullet/Numbered/Link icon buttons
│   │   ├── Editor.tsx              # contentEditable box, execCommand + Markdown-shortcut glue
│   │   ├── PreviewPane.tsx         # shows converted Unicode text
│   │   ├── CopyButton.tsx          # navigator.clipboard.writeText + "Copied!" state
│   │   ├── Icon.tsx                # thin Material Symbols glyph wrapper
│   │   ├── Logo.tsx                # wordmark used in the nav bar and footer
│   │   ├── NavBar.tsx              # fixed header: logo, section links, "nothing leaves your browser"
│   │   ├── Hero.tsx                # headline + subhead above the editor card
│   │   ├── WhyFormat.tsx           # "why format your text" 6-card feature grid
│   │   ├── HowItWorks.tsx          # 3-step explanation + the Unicode-trick callout
│   │   └── Faq.tsx                 # <details>/<summary> accordion, zero JS
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

### 5.1 Page layout & visual design (added after initial build, per user request)

The user shared a professional landing-page mockup (nav bar, hero, styled editor card,
feature grid, "how it works," FAQ, footer) and asked for the real app to look and read like
that. The page was rebuilt around it:

- **Palette**: a curated subset of the mockup's color tokens (Upwork's brand green plus a
  Material-3-style neutral surface scale) was ported into Tailwind v4's CSS-first `@theme`
  block in `globals.css` — e.g. `--color-upwork-green`, `--color-on-surface-variant`,
  `--color-surface-container-lowest` — which generates real utilities (`bg-upwork-green`,
  `text-on-surface-variant`, …) usable across every component. No dark mode (the mockup
  didn't have one either, and the branded light palette wasn't designed to invert cleanly).
- **Typography**: switched from the default Geist font to **Inter** via `next/font/google`,
  matching the mockup, still self-hosted/optimized by Next.js rather than a runtime Google
  Fonts request.
- **Icons**: Material Symbols Outlined, loaded once via a `<link>` in `layout.tsx`'s `<head>`
  (Next.js App Router hoists a `<link>` rendered anywhere in the tree into the document head).
  No npm icon package — `Icon.tsx` just renders the ligature text the font substitutes for a
  named glyph, exactly like the mockup did.
- **Sections, top to bottom**: `NavBar` (fixed, logo + anchor links to the sections below +
  a "nothing leaves your browser" badge in place of a Sign In button, since this tool has no
  accounts by design) → `Hero` (headline/subhead) → `FormatterApp` (the real, working tool —
  restyled as a card that overlaps the hero slightly, toolbar row with icon buttons plus
  Clear/Copy on the right, two-panel editor/preview body) → `WhyFormat` (6 feature cards, one
  per formatting type: bold, italic, underline, bullets, numbered lists, links) →
  `HowItWorks` (3 numbered steps, plus a callout explaining the Unicode substitution trick in
  plain language) → `Faq` (native `<details>`/`<summary>`, zero JavaScript, answers written
  to match this project's actual, verified behavior rather than generic marketing claims) →
  `Footer` (wordmark, one-line privacy note, links back to the sections above).
- **Deliberate departures from the mockup**: no external hotlinked logo images (replaced with
  a small self-contained SVG-free wordmark built from Tailwind + a Material Symbols glyph) and
  no "Sign In" button or Privacy Policy/Terms of Service links (the assignment explicitly
  rules out accounts, and this project has no real legal pages to link to — a placeholder
  link would be dishonest).

### 5.2 Rebrand + motion + footer (added after user feedback)

The first pass ported the mockup's own green Material palette and reused several of its
headings/card copy near-verbatim ("Bold for skills," "Highlight & Format," etc.) — on review
this read as a copy of the reference rather than its own thing, so:

- **New palette, not the mockup's**: `globals.css`'s `@theme` block was replaced with an
  indigo-accent, true-neutral-slate scale (`--color-brand: #4f46e5` instead of Upwork's
  `#14a800` green, `--color-on-surface-variant` etc. re-based on Tailwind's slate scale
  instead of the mockup's green-tinted Material grays). Every `bg-upwork-green` /
  `text-upwork-green` / `text-on-primary` usage across the components was renamed to
  `bg-brand` / `text-brand` / `text-on-brand` to match.
- **All section copy rewritten**: headlines, badge text, the 6 `WhyFormat` card
  titles/descriptions, the 3 `HowItWorks` step titles/descriptions, and all 6 FAQ questions
  were reworded from scratch rather than lightly edited from the mockup's wording — same
  underlying facts, different sentences.
- **Smooth scrolling**: `html { scroll-behavior: smooth }` in `globals.css` — nav bar and
  footer anchor links now glide to their section instead of jumping instantly.
- **Scroll-in animation**: a small `Reveal.tsx` client component wraps the `WhyFormat` cards,
  `HowItWorks` steps, and `Faq` items — each fades and slides up the first time it scrolls
  into view, staggered per item, via one `IntersectionObserver` and a CSS transition (no
  animation library added). Respects `prefers-reduced-motion`. The hero and the editor card
  itself are intentionally left un-animated since they're already on-screen on load.
- **Footer restyled dark**: `bg-slate-950` with a light wordmark (`Logo` gained a `light`
  prop) and a `© {year} Upwork Text Formatter. All rights reserved.` line, per request,
  instead of the previous light footer.

### 5.3 Landing / editor page split + Poppins + Upwork-green theme (added after user request)

The tool was originally a single page — hero, then the editor card embedded directly below
it, then the marketing sections. The user asked for a cleaner separation: a marketing landing
page at `/` that explains the tool and funnels into a dedicated, distraction-free `/editor`
page for actually doing the work.

- **Font**: swapped `Inter` → **Poppins** via `next/font/google` in `layout.tsx`. Poppins
  isn't a variable font on Google Fonts, so it needs an explicit `weight` array
  (`["300","400","500","600","700","800"]`) rather than the single variable-font declaration
  `Inter` used. `globals.css`'s `@theme inline` block now points `--font-sans` at
  `--font-poppins` instead of `--font-inter`.
- **Color**: `--color-brand` reverted from the indigo `#4f46e5` chosen in §5.2 back to
  **Upwork Green `#14a800`** (`--color-brand-dark: #0a6e00` for hover states) per the user's
  explicit hex value — this is a values-only change; the token names (`brand`/`brand-dark`/
  `on-brand`) are untouched, so no component className renames were needed. The §5.2 copy
  rewrite (headlines, card text, FAQ answers) is unaffected and stays as-is — only the accent
  color moved, not the wording. Surfaces stay on the existing white/slate scale, satisfying
  "clean white/slate background... deep charcoal/slate for text" without changes.
- **`app/page.tsx` (landing)**: now composes `NavBar → Hero → WhyFormat → HowItWorks → Faq →
  Footer` — `FormatterApp` (the editor) was removed from this tree entirely. `Hero.tsx` gained
  a subheadline using the user's exact requested phrase ("Format text that actually works in
  Upwork proposals and messages") and two CTAs: a primary **"Open Editor"** button
  (`next/link` to `/editor`) and a secondary "See how it works" anchor link. `NavBar.tsx` also
  gained an always-visible "Open Editor" button, and its old `#formatter` anchor link was
  replaced with a `#why-format` link to the (newly `id`'d) `WhyFormat` section instead, since
  there's no editor card on this page anymore.
- **`app/editor/page.tsx` (new route)**: a thin route file that sets editor-specific metadata
  and renders `FormatterApp`. `FormatterApp.tsx` was rewritten in place (same filename/export,
  so no orphaned file) to be the entire workspace rather than a card on the landing page:
  - **Strict 100vh, no page scroll**: outer wrapper is `flex h-screen flex-col overflow-hidden`.
  - **Fixed-height rows** (`shrink-0`): the same `NavBar` used on the landing page (see §5.4
    for why it's the *same* component rather than a lookalike header), an instruction bar
    spelling out both the keyboard shortcuts and the Markdown-typing shortcuts, and the
    toolbar row (formatting buttons + Clear/Copy) — each sized to its content only.
  - **Flexible dual panel**: the Editor/Preview row is `flex flex-1 min-h-0` (`flex-col` on
    mobile, `md:flex-row` on desktop, divided by a border either way) so it absorbs all
    leftover height below the fixed rows. Each panel is itself `flex flex-1 min-h-0 flex-col`
    around its label + content, and both `Editor.tsx` and `PreviewPane.tsx` had their old fixed
    `min-h-[420px]` removed (that fixed minimum would have fought the new flex-driven sizing
    and reintroduced page-level overflow) in favor of `h-full` + `overflow-y-auto`, so long
    text scrolls *inside* the panel instead of growing the page. The `min-h-0` overrides are
    necessary because flex children default to `min-height: auto`, which otherwise ignores
    `flex-1` and lets content overflow instead of triggering the intended internal scrollbar.
  - `Logo.tsx` switched from a same-page `href="#top"` anchor to a real `next/link` to `/`, and
    `NavBar.tsx` / `Footer.tsx`'s "Editor" links now point at `/editor` instead of `#formatter`
    — all of these needed updating once the editor became a real separate route.

### 5.4 Shared NavBar on `/editor` (added after user feedback, two passes)

The first version of the split gave `/editor` its own small header (wordmark + a "Back to
Home" link, `h-14`) instead of reusing `NavBar`. On review this made the header visibly
resize/restyle the instant you opened the editor — not the intended effect.

**First pass** (not quite sufficient on its own): had both pages render the exact same
`NavBar` component, differing only in its call-to-action.

- **`NavBar.tsx`** gained a `variant?: 'landing' | 'editor'` prop (default `'landing'`).
  Everything else — the logo, the `Why Format`/`How It Works`/`FAQ` links, the "Nothing leaves
  your browser" badge, the `h-16` height, the fixed positioning — is identical between
  variants. Only the right-hand CTA button changes: `variant="landing"` shows **"Open
  Editor"** linking to `/editor`; `variant="editor"` shows **"Back to Home"** linking to `/`.
- `page.tsx` rendered `<NavBar variant="landing" />` and `FormatterApp.tsx` rendered
  `<NavBar variant="editor" />` — each page still mounted its *own instance* of the component.

This got the two bars pixel-identical in isolation, but the user reported the nav still
visibly changed on navigation. Root cause: `/` and `/editor` are two different `page.tsx`
files, so navigating between them unmounts the landing page's `NavBar` instance and mounts a
brand-new one inside `FormatterApp` — even with identical markup, that's a real
unmount+remount, which can flash. On top of that, `/` is tall enough to need a page scrollbar
while `/editor` is deliberately locked to exactly `100vh` and never scrolls — the scrollbar
appearing/disappearing between the two pages shifts the entire viewport a few pixels
horizontally, which reads as the fixed, full-width nav bar "jumping."

**Second pass** (the actual fix) — stopped rendering `NavBar` from either page and instead
render it exactly once, in the root layout, so it's a single persistent element across
navigation rather than two separate instances:

- New **`SiteNavBar.tsx`** (`'use client'`, needs `usePathname()` from `next/navigation`):
  reads the current route and renders `<NavBar variant={pathname.startsWith('/editor') ?
  'editor' : 'landing'} />`. This is the one piece of nav-related logic that has to be
  route-aware.
- **`layout.tsx`** renders `<SiteNavBar />` once, directly in `<body>`, above `{children}`.
  Next's App Router keeps a layout mounted across client-side navigations between routes it
  wraps and only swaps out `children` — since both `/` and `/editor` sit under this one root
  layout with no nested layout in between, `SiteNavBar`/`NavBar` now never unmounts when
  moving between them.
- `page.tsx` and `FormatterApp.tsx` no longer import or render `NavBar` themselves.
  `FormatterApp.tsx` keeps its `shrink-0` spacer `div` (same `h-16` as the nav bar) — still
  needed because `NavBar` is `position: fixed` and therefore outside the normal document flow
  regardless of which component renders it; without the spacer the instruction bar underneath
  would sit behind it, and the spacer is what keeps the `h-screen` flex column's strict
  no-page-scroll layout (§5.3) starting exactly where the fixed bar ends.
- **`globals.css`** also gained `scrollbar-gutter: stable` on `html`, so the browser reserves
  scrollbar space on every page regardless of whether that page's content actually needs to
  scroll — removing the remaining source of a viewport-width (and therefore nav-bar-width)
  shift between the scrollable landing page and the fixed-height editor page.

### 5.5 Reverted back to a single page (added per user request)

After living at `/editor` for a few iterations, the user asked for a single-page site again,
modeled on a reference screenshot (a "Typegrow"-style tool page): nav bar, headline/subhead,
and the editor all visible together near the top, with the toolbar's shortcut instructions
sitting *below* the editor card rather than above it. No formatting behavior changed — same
toolbar buttons, same keyboard shortcuts, same Markdown shorthand, same active-state
highlighting (§6.3) — this was purely a layout/composition change:

- **`app/page.tsx`** now composes `Hero → FormatterApp → WhyFormat → HowItWorks → Faq →
  Footer` again, all on one page — same shape as before the §5.3 split.
- **`FormatterApp.tsx`** went back to being a card embedded on the page (not a standalone
  `h-screen` route): `section#editor` containing the toolbar row, the dual editor/preview
  panel, and — the actual layout change requested — the shortcuts/Markdown-shorthand
  instruction bar moved to *after* the card instead of before it. `Editor.tsx` and
  `PreviewPane.tsx` got a `min-h-[320px]` back (they'd been stripped of any fixed height in
  §5.3 to fill a flex-1 viewport-height container that no longer exists here).
- **`Hero.tsx`** trimmed its vertical padding and dropped the `/editor`-routing CTA buttons —
  with the editor sitting immediately below the headline again, a separate "Open Editor"
  button was redundant, and the extra vertical space it took was the opposite of the "nav +
  hero + editor visible together" goal from the reference screenshot.
- **`NavBar.tsx`** lost the `variant` prop (no second page to differ from any more); its
  "Open Editor" button and the new "Editor" nav link both point at `#editor`, an in-page
  anchor (`FormatterApp`'s `section` has `id="editor" scroll-mt-20`), instead of routing to a
  separate page. `SiteNavBar.tsx` — the wrapper that renders `NavBar` once from the root
  layout so it never remounts (§5.4) — is kept, simplified to a plain pass-through, since that
  still-valid technique (one persistent nav instance) has no reason to change; it just no
  longer needs `usePathname()`-driven variant logic. `Footer.tsx`'s "Editor" link was updated
  the same way.
- **`app/editor/page.tsx`**: rather than leaving a dead route or a 404, this now just calls
  `redirect('/#editor')` — anyone with the old `/editor` URL bookmarked or linked lands back
  on the single page, scrolled to the tool. (I don't have a reliable way to delete files from
  this session, so this file stays on disk as a redirect rather than being removed outright.)

### 5.6 Compacted so the editor fits in the first viewport (added per user feedback)

§5.5 put the editor back on the landing page, but the hero above it was still tall enough
that the editor card ran past the fold on typical screens — the opposite of the "no need to
scroll" goal. Trimmed further, purely visual, no formatting behavior touched:

- **`Hero.tsx`** rewritten to match the reference screenshot's proportions: dropped the
  "No install/No account" badge and the extra marketing paragraph entirely, down to just a
  short `h1` ("Upwork Text Formatter") and one concise line of subtext, with much smaller
  top/bottom padding (`pt-8 pb-4` instead of `pt-20/24 pb-8`).
- **`NavBar.tsx`**: removed the "Open Editor" button per request — with the editor directly
  below the hero, a button whose only job was to link to it added width/visual weight for no
  benefit. The "Editor" nav link (`#editor`) is still there for anyone who's scrolled past it.
- **`FormatterApp.tsx`**: tightened the dual-panel's internal padding (`p-4 sm:p-6` →
  `p-3 sm:p-4`) and label spacing. `Editor.tsx`/`PreviewPane.tsx`'s `min-h-[320px]` (from
  §5.5) reduced to `min-h-[220px]` — still comfortably usable, just not taller than it needs
  to be.
- **`HowItWorks.tsx`**'s "Three steps, no learning curve" cards lost their box styling
  (`rounded-xl bg-surface-container-lowest p-8 shadow-sm` removed from each step) per
  request — the numbered circle, title, and body text now sit directly on the section's
  background instead of inside a card, with the column gap widened slightly (`gap-8` →
  `gap-10`) to keep the three steps visually separated without borders.
- None of this touches `formatConverter.ts`, `unicodeMaps.ts`, `markdownShortcuts.ts`, or any
  toolbar/keyboard-shortcut logic in `Editor.tsx` — same 44/44 passing after the change. Exact
  pixel fit still depends on the viewer's screen size/browser chrome (there's no way to
  guarantee zero scrolling on every device), but the whole nav+hero+editor block is now
  meaningfully shorter and should fit without scrolling on typical laptop/desktop viewports.

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

### 6.2 Keyboard shortcuts + list-visibility bug fix (added with the §5.3 page split)

- **Ctrl/Cmd+B/I/U keyboard shortcuts**: previously the toolbar and the Markdown-shorthand
  typing were the only ways to format text — no keyboard shortcuts were wired up, so the
  browser's own default for `Ctrl+B`/`Ctrl+U` (bookmark / underline-URL-bar-ish browser chrome
  behavior) could fire instead. Fixed by adding an `onKeyDown` handler on the `contentEditable`
  div in `Editor.tsx` that checks `e.ctrlKey || e.metaKey` (Cmd on Mac, Ctrl elsewhere) with
  no Shift/Alt modifier, calls `e.preventDefault()` immediately so the browser never sees the
  key combo, then runs the same formatting logic as the toolbar buttons. To guarantee the
  keyboard path and the toolbar/imperative-handle path can never drift apart, the shared logic
  was factored into one `runCommand(command, value?)` helper (focus the editor → `execCommand`
  → re-sync preview state) that both `onKeyDown` and the `exec` method on `EditorHandle` call.
- **List-visibility bug fix**: Tailwind's preflight reset strips the browser's default
  `list-style` from every `<ul>`/`<ol>`, so a bulleted/numbered list created via the toolbar,
  a keyboard shortcut, or Markdown-shorthand typing was structurally correct (and rendered
  correctly in the plain-text preview pane, which never relied on CSS) but showed **no visible
  bullet or number markers while actually typing** in the editor itself — confusing, since the
  list looked like it silently did nothing. Fixed by adding Tailwind arbitrary-variant
  utilities to the `contentEditable` div's `className`: `[&_ul]:list-disc [&_ul]:ml-5
  [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-0.5`. Uses the `[&_...]` *descendant* selector
  (matches a `<ul>`/`<ol>` at any nesting depth under the editor) rather than the `[&>...]`
  *direct-child* selector, since `execCommand('insertUnorderedList')` and the browser's native
  Enter-to-continue-a-list behavior don't guarantee the list element is always an immediate
  child of the editor root.

### 6.3 Toolbar active-state highlighting + selection-only formatting (added per user request)

Two related requests: (1) the toolbar should show which formats are "on" wherever the caret
or selection currently is — same idea as Word/Google Docs highlighting the Bold button when
your cursor sits inside bold text — and (2) selecting text and pressing Bold (toolbar click
or Ctrl/Cmd+B) should format only that selection, then resume plain typing afterward, not
carry bold into whatever's typed next.

- **Active-state tracking**: `Editor.tsx` exports a new `ActiveFormats` type (`{bold, italic,
  underline, bullet, numbered}`) and a `readActiveFormats()` helper that calls
  `document.queryCommandState('bold' | 'italic' | 'underline' | 'insertUnorderedList' |
  'insertOrderedList')` — the same native API already used elsewhere in this file to detect
  the sticky-formatting boundary (§6.1). `Editor` takes a new `onSelectionChange?: (formats:
  ActiveFormats) => void` prop and calls it: on every keystroke (`onInput`/`onKeyUp`), on
  mouse-driven selection changes (`onMouseUp`), on focus, and via a document-wide
  `selectionchange` listener (needed because selection can change with no input event at all,
  e.g. arrow keys) — each guarded to only fire when the selection is actually inside this
  editor, since `queryCommandState` reflects whatever's focused document-wide. On blur it
  reports all-false, so the toolbar doesn't show a stale "active" state once focus leaves the
  editor (clicking a toolbar button doesn't trigger this, since `Toolbar.tsx`'s existing
  `onMouseDown` → `preventDefault()` already stops those clicks from blurring the editor).
- **`FormatterApp.tsx`** holds an `activeFormats` state, passes `onSelectionChange`
  (`setActiveFormats`) to `Editor` and `active={activeFormats}` down to `Toolbar`.
- **`Toolbar.tsx`** takes the new `active: ActiveFormats` prop; each of the five toggleable
  buttons (Bold/Italic/Underline/Bullet/Numbered — Link is a one-shot action, not a toggle, so
  it's excluded) renders `bg-brand text-on-brand` instead of its default hover-only styling
  when its format is active, plus `aria-pressed` for screen readers.
- **Selection-only formatting fix, generalized**: §6.1 already fixed this for the
  Markdown-shorthand path (`**bold**` auto-converting). The same "sticky caret" root cause
  applies to the toolbar/keyboard path too: select text, click Bold, and a caret later placed
  right at the edge of that now-bold run is a boundary Chrome resolves ambiguously by default,
  continuing bold into new typing. `runCommand()` (shared by the toolbar's `exec` handle and
  the Ctrl/Cmd+B/I/U handler) now checks, before running the command, whether the current
  selection is a real range (not just a collapsed caret). If so — meaning the user selected
  text and is formatting it, rather than toggling a style on for future typing — it collapses
  the selection to the end of the newly-formatted run immediately afterward and, exactly as in
  §6.1, toggles the command off again if `queryCommandState` still reports it "on" for that
  caret position. Toggling Bold with **nothing selected** (the normal "start typing bold from
  here" gesture) is left untouched, since that's the one case where continuing the format into
  new typing is the intended behavior.

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
9. **(Follow-up, §5.3/§6.2)** Split the single page into `/` (landing) and `/editor`
   (workspace): new `app/editor/page.tsx`, `FormatterApp.tsx` rewritten in place as the strict
   h-screen dual-panel workspace, `Hero.tsx`/`NavBar.tsx`/`Footer.tsx`/`Logo.tsx` updated to
   route between the two pages instead of scrolling to an in-page anchor, `layout.tsx`/
   `globals.css` switched to Poppins + Upwork Green. Same pass fixed the Ctrl/Cmd+B/I/U
   keyboard-shortcut gap and the Tailwind list-visibility bug in `Editor.tsx`. `formatConverter.test.ts`
   and `markdownShortcuts.test.ts` re-run afterward (still 44/44 passing) to confirm none of
   this touched the pure conversion/shortcut logic. Delivered as updates to the files already
   on disk plus the two new route files.
10. **(Follow-up, §6.3)** Toolbar active-state highlighting + selection-only formatting fix:
    `Editor.tsx` gained `ActiveFormats`/`readActiveFormats()`/the `onSelectionChange` prop and
    the generalized sticky-caret fix in `runCommand()`; `Toolbar.tsx` gained the `active` prop
    and per-button highlight styling; `FormatterApp.tsx` wired the two together with new state.
    Also made Poppins explicit on `body` in `globals.css` (`font-family: var(--font-sans), ...`)
    so it's guaranteed to apply everywhere rather than relying on Tailwind's preflight picking
    up `--font-sans` implicitly. `formatConverter.test.ts`/`markdownShortcuts.test.ts` re-run
    again afterward, still 44/44.

## 9. Explicitly out of scope (per assignment's "Not Needed")

No login/accounts, no Upwork API integration, no attempt to match Word/Google Docs
formatting beyond bold/italic/underline/bullets/numbered lists/links.
