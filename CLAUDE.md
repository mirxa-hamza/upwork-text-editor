# Upwork Text Formatter — Project Guide for AI Assistants

This file is the single source of truth for any AI assistant (Claude, Gemini, etc.) working on this codebase. Read it fully before making any changes.

---

## 1. Project Overview

**Upwork Text Formatter** is a free, client-side web tool that lets Upwork freelancers format their proposals and messages using bold, italic, underline, bullet lists, numbered lists, and hyperlinks. All formatting is converted to Unicode plain text characters that Upwork renders as formatted text when pasted.

- **No backend** — everything runs in the browser. No data is stored or transmitted.
- **No auth** — fully public, no sign-up required.
- **Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Google Fonts (Poppins), Material Symbols (icons).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 with App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (utility-first, no component library) |
| Font | Poppins (Google Fonts, loaded in `layout.tsx`) |
| Icons | Material Symbols Outlined (loaded via CDN `<link>` in `layout.tsx`) |
| Testing | Plain Node (`npx tsx`) — no Jest/jsdom needed for lib tests |

---

## 3. Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: Poppins font, Material Symbols CDN, SiteNavBar, PageLoader
│   ├── page.tsx            # Main landing page (Home)
│   ├── globals.css         # Tailwind v4 theme tokens + global base styles
│   ├── loading.tsx         # Next.js loading UI
│   ├── not-found.tsx       # Custom 404 page
│   ├── privacy/page.tsx    # Privacy Policy page
│   ├── terms/page.tsx      # Terms & Conditions page
│   └── editor/             # (Legacy/unused route — do not delete)
│
├── components/
│   ├── NavBar.tsx          # Fixed top navbar with anchor links
│   ├── SiteNavBar.tsx      # Thin wrapper that mounts NavBar outside page trees
│   ├── Hero.tsx            # Landing page headline section
│   ├── FormatterApp.tsx    # Main tool: shortcuts bar + toolbar + editor + preview panes
│   ├── Editor.tsx          # contentEditable rich-text editor (core input)
│   ├── Toolbar.tsx         # Bold/Italic/Underline/Bullet/Numbered/Link buttons
│   ├── PreviewPane.tsx     # Read-only preview of the converted Unicode text
│   ├── CopyButton.tsx      # Copies converted text to clipboard
│   ├── WhyFormat.tsx       # "Why Format?" section (landing page)
│   ├── HowItWorks.tsx      # "How It Works" section (landing page)
│   ├── Faq.tsx             # FAQ accordion section (landing page)
│   ├── WaitlistSection.tsx # "Have something in mind?" CTA section
│   ├── Footer.tsx          # Site footer with links and legal
│   ├── Logo.tsx            # Brand logo component
│   ├── Icon.tsx            # Wrapper for Material Symbols icons
│   ├── PageLoader.tsx      # Animated page loader on first paint
│   └── Reveal.tsx          # Scroll-reveal animation wrapper
│
└── lib/
    ├── formatConverter.ts       # HTML → Unicode text converter (CORE LOGIC — no DOM deps)
    ├── formatConverter.test.ts  # Unit tests for formatConverter
    ├── markdownShortcuts.ts     # Markdown-style input shortcuts (**bold**, _italic_, etc.)
    ├── markdownShortcuts.test.ts
    └── unicodeMaps.ts           # Unicode character maps for bold/italic/underline
```

---

## 4. Page Layout & Routing

### Main Landing Page (`/`)
- **Navbar**: Fixed at top (`position: fixed`), height ~5rem. Uses `pt-20` on the main container to offset.
- **First Viewport Section**: `Hero` + `FormatterApp` are wrapped in `h-[calc(100vh-5rem)]` so the editor is fully visible without scrolling.
- **Below-fold Sections**: `WhyFormat`, `HowItWorks`, `Faq`, `WaitlistSection` — normal page scroll.
- **Footer**: Full-width at the bottom of the page.

### Page scroll behaviour
- The main page scrolls normally (no locked viewport).
- The first screen (`100vh`) shows the Hero and Editor together.
- Users scroll down to see informational sections.

### Legal Pages (`/privacy`, `/terms`)
- Both pages use `pt-20` + `Footer` to match the main page layout.
- The global `SiteNavBar` renders on all pages via `layout.tsx`.

---

## 5. Design System & Theming

### Colours (defined in `globals.css` `@theme`)
| Token | Value | Usage |
|---|---|---|
| `--color-brand` | `#108a00` | Primary green (Upwork-inspired) — buttons, active states |
| `--color-brand-dark` | `#0e7500` | Hover state for brand elements |
| `--color-on-brand` | `#ffffff` | Text on brand-coloured backgrounds |
| `--color-surface` | `#f8fafc` | Page background |
| `--color-surface-elevated` | `#ffffff` | Cards, editor panels |
| `--color-on-surface` | `#0f172a` | Primary text |
| `--color-on-surface-variant` | `#475569` | Secondary/muted text |
| `--color-error` | `#dc2626` | Destructive actions (Clear button hover) |

Tailwind utility classes map to these tokens (e.g. `bg-brand`, `text-on-surface`).

### Typography
- **Font**: Poppins (weights 300–800), applied globally via CSS variable `--font-poppins`.
- Never use browser default fonts — Poppins is always active.

### Icons
- Use the `<Icon name="..." />` component (`src/components/Icon.tsx`).
- Icons come from **Material Symbols Outlined** (loaded via CDN link in `layout.tsx`).
- Common icons: `format_bold`, `format_italic`, `format_underlined`, `format_list_bulleted`, `format_list_numbered`, `link`, `content_copy`, `check`, `delete`.
- Size is controlled via `className="text-[18px]"` (or `text-[16px]` for smaller).

---

## 6. Core Formatting Logic

### Editor (`src/components/Editor.tsx`)
- Uses a `contentEditable` `<div>` as the rich-text input.
- Calls `document.execCommand` with `styleWithCSS = false` to ensure standard `<b>`, `<i>`, `<u>` tags are emitted (not inline CSS styles).
- Intercepts `Ctrl+B/I/U` keyboard shortcuts.
- Exposes a `ref` handle (`EditorHandle`) with methods: `exec(command)`, `insertLink(url)`, `clear()`.
- List markers (`ul`/`ol`) use Tailwind arbitrary variants `[&>ul]:list-disc [&>ul]:ml-5` to stay visible inside `contentEditable`.

### Format Conversion (`src/lib/formatConverter.ts`)
- Takes the editor's `innerHTML` (HTML string) and converts it to Unicode plain text.
- Uses a **hand-rolled HTML tokenizer** — no DOM/jsdom — so it works in Node for testing.
- Supported input tags: `div`, `br`, `b`, `strong`, `i`, `em`, `u`, `ul`, `ol`, `li`, `a`.
- Bold/italic/underline are applied by mapping characters to their Unicode equivalents (via `unicodeMaps.ts`).
- Links are rendered as `Label (https://url)` or just the URL if no label differs.
- List items: bullet `•` for `ul`, `1.` `2.` etc. for `ol`.

### Markdown Shortcuts (`src/lib/markdownShortcuts.ts`)
- Typing markdown-style syntax in the editor triggers automatic formatting:
  - `**text**` → bold
  - `_text_` → italic
  - `~text~` → underline
  - `- ` at line start → bullet list
  - `1. ` at line start → numbered list

---

## 7. Key Components in Detail

### `FormatterApp.tsx`
- The top-level tool wrapper.
- Layout: shortcuts bar (above) → editor card (toolbar + dual panes).
- Uses `flex-1 min-h-0` flex chain so it fills the available height within the `h-[calc(100vh-5rem)]` viewport section.
- Left pane: `Editor`. Right pane: `PreviewPane`.
- Toolbar buttons: `Toolbar` component + Clear button + `CopyButton`.

### `NavBar.tsx`
- Fixed (`position: fixed`) at top of all pages.
- Nav links (anchor-based): **Why Format** (`#why-format`), **How It Works** (`#how-it-works`), **FAQ** (`#faq`).
- "Editor" link was intentionally **removed** — do not add it back.
- Right side: "Nothing leaves your browser" privacy badge.

### `WaitlistSection.tsx`
- Blue gradient CTA section at the bottom of the landing page.
- "Join Us" button is a plain `<a href="https://www.buraq.dev/contact">` — no form inputs.
- Must have `'use client'` directive (uses client interactivity).
- The button card background blends into the gradient (no white card).

### `Footer.tsx`
- White background, rounded top corners (`rounded-t-[3rem]`).
- Left: "We would love to hear from you" headline + body text.
- Right: Two-column grid.
  - **Column 1**: "Contact us" link → `https://www.buraq.dev/contact` (opens in new tab). Privacy Policy and Terms & Conditions links below it.
  - **Column 2**: Page navigation links (Editor, Why Format, How It Works, FAQ).
- No social media section.
- No "Get Started" button.
- Copyright line at the very bottom.

---

## 8. Important Rules & Conventions

### DO
- Keep all existing page sections when modifying layout — `WhyFormat`, `HowItWorks`, `Faq`, `WaitlistSection`, `Footer` must always remain.
- Use the design token classes (`bg-brand`, `text-on-surface`, etc.) for consistency.
- Add `'use client'` to any component that uses event handlers, hooks, or browser APIs.
- Keep the legal pages (`/privacy`, `/terms`) layout consistent with the main page — include `SiteNavBar` (via root layout) + `pt-20` + `Footer`.
- Test formatting logic changes with the unit tests in `src/lib/`.

### DO NOT
- Do not add the "Editor" link back to `NavBar.tsx`.
- Do not force `overflow: hidden` or a fixed `h-screen` on the `<body>` or root `<html>` — the page must scroll normally.
- Do not remove the `SiteNavBar` from `layout.tsx` — it is the single NavBar instance for all routes.
- Do not introduce inline CSS `style` attributes for formatting in the editor (breaks the converter). Always use `execCommand` with `styleWithCSS = false`.
- Do not use `jsdom` or React for unit testing `formatConverter.ts` — it is dependency-free by design.
- Do not add fake/placeholder contact details (phone numbers, addresses) to the Footer.
- Do not add back social media links to the Footer.
- Do not add form inputs to `WaitlistSection.tsx` — the CTA is a direct link.

---

## 9. External Links

| Purpose | URL |
|---|---|
| Contact / Join Us | `https://www.buraq.dev/contact` |
| Privacy Policy page | `/privacy` |
| Terms & Conditions page | `/terms` |

---

## 10. Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run lib unit tests (no test runner needed)
npx tsx src/lib/formatConverter.test.ts
npx tsx src/lib/markdownShortcuts.test.ts

# Build for production
npm run build
```

The dev server runs at `http://localhost:3000`.

---

## 11. Brand & Content Notes

- Brand color is **Upwork Green** (`#108a00`) — intentionally echoes Upwork's own brand since this tool is built for Upwork users.
- The tagline: *"Easily format your Upwork text with bold, italic, underline, lists and links — free, no sign-up."*
- Privacy positioning: "Nothing leaves your browser" — use this phrase in UI copy.
- The app processes all data 100% client-side. This is a core feature and must be preserved.
