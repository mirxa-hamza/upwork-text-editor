# Upwork Text Formatter — Project Guide for AI Assistants

This file is the single source of truth for any AI assistant (Claude, Gemini, etc.) working on this codebase. Read it fully before making any changes.

---

## 1. Project Overview

**Upwork Text Formatter** is a free, client-side web tool that lets Upwork freelancers format their proposals and messages using bold, italic, underline, bullet lists, numbered lists, and hyperlinks. All formatting is converted to Unicode plain text characters that Upwork renders as formatted text when pasted.

- **Live at**: `https://upworkformatter.buraq.dev`
- **No backend** — everything runs in the browser. No data is stored or transmitted.
- **No auth** — fully public, no sign-up required.
- **Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Google Fonts (Poppins), Material Symbols (icons).

Beyond the tool itself, the site carries an SEO content layer (`/guides`, `/about`) and a full metadata stack — see §6.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 with App Router (Turbopack for dev and build) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (utility-first, no component library) |
| Font | Poppins (Google Fonts, loaded in `layout.tsx`) |
| Icons | Material Symbols Outlined (loaded via CDN `<link>` in `layout.tsx`) |
| Testing | Plain Node (`npx tsx`) — no Jest/jsdom needed for lib tests |
| Hosting | Vercel (or any Next.js-compatible host) |

---

## 3. Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: Poppins, Material Symbols CDN, root metadata,
│   │                       #   SoftwareApplication JSON-LD, SiteNavBar, PageLoader
│   ├── page.tsx            # Main landing page (Home) + FAQPage JSON-LD
│   ├── globals.css         # Tailwind v4 theme tokens + global base styles
│   ├── loading.tsx         # Next.js loading UI
│   ├── not-found.tsx       # Custom 404 page
│   │
│   ├── about/page.tsx      # About page (who built it, why)
│   ├── privacy/page.tsx    # Privacy Policy page
│   ├── terms/page.tsx      # Terms & Conditions page
│   ├── editor/page.tsx     # 308 permanentRedirect to /#editor (legacy URL — do not delete)
│   │
│   ├── guides/
│   │   ├── page.tsx                                  # Guides index
│   │   ├── bold-text-in-upwork-proposals/page.tsx    # + HowTo JSON-LD
│   │   ├── bullet-points-in-upwork-messages/page.tsx # + HowTo JSON-LD
│   │   └── why-formatting-disappears-on-upwork/page.tsx
│   │
│   ├── sitemap.ts          # Generated sitemap.xml (static routes + GUIDES)
│   ├── robots.ts           # Generated robots.txt (host + sitemap)
│   ├── manifest.ts         # Web app manifest
│   ├── opengraph-image.tsx # 1200x630 share card, rendered via next/og (edge runtime)
│   ├── icon.tsx            # 32x32 favicon, generated
│   └── apple-icon.tsx      # 180x180 apple touch icon, generated
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
│   ├── Faq.tsx             # FAQ accordion section — exports FAQS, reused for JSON-LD
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
    ├── unicodeMaps.ts           # Unicode character maps for bold/italic/underline
    ├── siteConfig.ts            # SINGLE SOURCE OF TRUTH for site URL + shared metadata
    ├── pageMetadata.ts          # Builds per-route canonical + OG + Twitter metadata
    ├── jsonLd.ts                # BreadcrumbList structured-data helper
    └── guides.ts                # Shared slug/title/description for every /guides page
```

`next.config.ts` also pins `outputFileTracingRoot` / `turbopack.root` to this directory (a stray `package-lock.json` in the parent folder otherwise corrupts the routes manifest at runtime) and sets baseline security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.

---

## 4. Page Layout & Routing

| Route | Purpose |
|---|---|
| `/` | Landing page + the formatter tool |
| `/guides` | Guides index |
| `/guides/<slug>` | Individual guide (3 of them, listed in `lib/guides.ts`) |
| `/about` | About the tool and who built it |
| `/privacy` | Privacy Policy |
| `/terms` | Terms & Conditions |
| `/editor` | 308 permanent redirect to `/#editor` (legacy bookmark support) |

### Main Landing Page (`/`)
- **Navbar**: Fixed at top (`position: fixed`), height ~5rem. Uses `pt-20` on the main container to offset.
- **First Viewport Section**: `Hero` + `FormatterApp` are wrapped in `h-[calc(100vh-5rem)]` so the editor is fully visible without scrolling.
- **Below-fold Sections**: `WhyFormat`, `HowItWorks`, `Faq`, `WaitlistSection` — normal page scroll.
- **Footer**: Full-width at the bottom of the page.

### Page scroll behaviour
- The main page scrolls normally (no locked viewport).
- The first screen (`100vh`) shows the Hero and Editor together.
- Users scroll down to see informational sections.

### Content pages (`/about`, `/guides`, `/guides/*`, `/privacy`, `/terms`)
- All share the same shell: `min-h-screen bg-slate-50 flex flex-col` → `<main className="flex-1 pt-20 pb-20 ...">` → white rounded card → `Footer`.
- The global `SiteNavBar` renders on all pages via `layout.tsx`, so the `pt-20` offset is required on every page.
- `/privacy` and `/terms` each hold a hand-maintained `LAST_UPDATED` constant. **Bump it by hand when the content actually changes** — it is deliberately not `new Date()`, which would falsely claim the policy was updated on every visit.

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

`opengraph-image.tsx`, `icon.tsx`, and `apple-icon.tsx` run on the Edge runtime and **cannot** read Tailwind's CSS custom properties, so they hardcode the same hex values. If a brand colour changes in `globals.css`, update those three files too.

### Typography
- **Font**: Poppins (weights 300–800), applied globally via CSS variable `--font-poppins`.
- Never use browser default fonts — Poppins is always active.

### Icons
- Use the `<Icon name="..." />` component (`src/components/Icon.tsx`).
- Icons come from **Material Symbols Outlined** (loaded via CDN link in `layout.tsx`).
- Common icons: `format_bold`, `format_italic`, `format_underlined`, `format_list_bulleted`, `format_list_numbered`, `link`, `content_copy`, `check`, `delete`.
- Size is controlled via `className="text-[18px]"` (or `text-[16px]` for smaller).

---

## 6. SEO & Metadata

This is a load-bearing part of the codebase — the site's whole point is to rank for Upwork-formatting queries. Treat it with the same care as the formatting logic.

### The URL flows from exactly one place

`src/lib/siteConfig.ts` holds `url`, and every SEO-facing URL derives from it: canonical links, `sitemap.xml`, `robots.txt`, Open Graph / Twitter cards, and all JSON-LD. `NEXT_PUBLIC_SITE_URL` overrides the fallback at build time. `siteConfig.domain` is the same value without the scheme, for prose.

**Never hardcode the domain anywhere else.** This has already gone wrong once: a guide had `upworkformatter.com` — a domain nobody owns — baked into its `HowTo` structured data.

### Every new page needs `pageMetadata()`

```ts
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata({
  title: 'Guides',
  description: '…',
  path: '/guides',
});
```

This helper exists because of a genuine Next.js trap: **child metadata replaces the parent's `openGraph` object wholesale — there is no field-by-field merge.** A page that sets only `openGraph.title` silently loses the `og:image` that `app/opengraph-image.tsx` contributes to the root segment, and inherits the homepage's `og:url`. `pageMetadata()` emits a consistent canonical + OG + Twitter card + share image every time. Do not hand-roll a `metadata` object on a new page.

### Structured data (JSON-LD)

| Type | Where | Source |
|---|---|---|
| `SoftwareApplication` | `app/layout.tsx` (all pages) | inline const |
| `FAQPage` | `app/page.tsx` | generated from the `FAQS` array `Faq.tsx` renders |
| `HowTo` | two guide pages | generated from each page's `STEPS` array |
| `BreadcrumbList` | `/guides` + all guides | `lib/jsonLd.ts` → `breadcrumbJsonLd()` |

`FAQPage` and `HowTo` are generated from the same arrays the visible page renders, so the markup can never drift from the content. Keep it that way — never write a second, parallel copy of the text into JSON-LD.

### Environment variables (all optional)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Overrides the production URL. Defaults to `https://upworkformatter.buraq.dev`. |
| `GOOGLE_SITE_VERIFICATION` | Emits the Search Console `google-site-verification` meta tag. Unset is fine if the property was verified by DNS. |

### Adding a guide

1. Add the slug/title/description to `GUIDES` in `src/lib/guides.ts`.
2. Create `src/app/guides/<slug>/page.tsx` — copy an existing guide's shape: `pageMetadata()`, `breadcrumbJsonLd()`, optional `HowTo`, and a "More guides" block built from `GUIDES.filter(...)`.

`sitemap.ts`, the guides index, and every guide's cross-links all read from `GUIDES`, so step 1 wires up the rest automatically. `/editor` is deliberately excluded from the sitemap — it is a redirect, not a page worth indexing.

---

## 7. Core Formatting Logic

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

## 8. Key Components in Detail

### `FormatterApp.tsx`
- The top-level tool wrapper.
- Layout: shortcuts bar (above) → editor card (toolbar + dual panes).
- Uses `flex-1 min-h-0` flex chain so it fills the available height within the `h-[calc(100vh-5rem)]` viewport section.
- Left pane: `Editor`. Right pane: `PreviewPane`.
- Toolbar buttons: `Toolbar` component + Clear button + `CopyButton`.

### `NavBar.tsx`
- Fixed (`position: fixed`) at top of all pages.
- Nav links (anchor-based): **Why Format** (`/#why-format`), **How It Works** (`/#how-it-works`), **FAQ** (`/#faq`).
- "Editor" link was intentionally **removed** — do not add it back.
- Right side: "Nothing leaves your browser" privacy badge.

### `Faq.tsx`
- Exports the `FAQS` array as well as the component, because `app/page.tsx` builds its `FAQPage` JSON-LD from it. Edit a question in one place and both stay in sync.

### `WaitlistSection.tsx`
- Blue gradient CTA section at the bottom of the landing page.
- "Join Us" button is a plain `<a href="https://www.buraq.dev/contact">` — no form inputs.
- Must have `'use client'` directive (uses client interactivity).
- The button card background blends into the gradient (no white card).

### `Footer.tsx`
- White background, rounded top corners (`rounded-t-[3rem]`). `'use client'`.
- Left: "We would love to hear from you" headline + body text.
- Right: Two-column grid.
  - **Column 1**: "Contact us" link → `https://www.buraq.dev/contact` (opens in new tab), then About, Guides, Privacy Policy, Terms & Conditions.
  - **Column 2** ("Links"): Editor, Why Format, How It Works, FAQ — all `/#anchor` links.
- The `/#anchor` links use `<Link>` with an `onClick` that overrides navigation with `window.location.href`. This is deliberate: it satisfies ESLint's `no-html-link-for-pages` rule while still doing a real navigation to `/#section` from a subpage. Without it, Next's client router appends the hash to the current path (`/privacy#editor`). Keep the `href` — crawlers rely on it.
- No social media section. No "Get Started" button.
- Copyright line at the very bottom.

---

## 9. Important Rules & Conventions

### DO
- Keep all existing page sections when modifying layout — `WhyFormat`, `HowItWorks`, `Faq`, `WaitlistSection`, `Footer` must always remain.
- Use the design token classes (`bg-brand`, `text-on-surface`, etc.) for consistency.
- Add `'use client'` to any component that uses event handlers, hooks, or browser APIs.
- Use `pageMetadata()` for every new route, and `siteConfig` for every URL reference.
- Keep the content pages (`/about`, `/guides`, `/privacy`, `/terms`) layout-consistent with each other — `SiteNavBar` (via root layout) + `pt-20` + `Footer`.
- Test formatting logic changes with the unit tests in `src/lib/`.
- Run `npm run build` after any metadata change, then grep the emitted HTML under `.next/server/app/` to confirm the tags are actually present. Metadata bugs are invisible in the browser but obvious in the build output.

### DO NOT
- Do not add the "Editor" link back to `NavBar.tsx`.
- Do not hardcode the site domain anywhere outside `src/lib/siteConfig.ts`.
- Do not add `aggregateRating`, `review`, or invented `datePublished` values to JSON-LD. Fabricated structured data violates Google's guidelines and risks a manual action — there is no real review data behind this tool.
- Do not force `overflow: hidden` or a fixed `h-screen` on the `<body>` or root `<html>` — the page must scroll normally.
- Do not remove the `SiteNavBar` from `layout.tsx` — it is the single NavBar instance for all routes.
- Do not introduce inline CSS `style` attributes for formatting in the editor (breaks the converter). Always use `execCommand` with `styleWithCSS = false`.
- Do not use `jsdom` or React for unit testing `formatConverter.ts` — it is dependency-free by design.
- Do not add fake/placeholder contact details (phone numbers, addresses) to the Footer.
- Do not add back social media links to the Footer.
- Do not add form inputs to `WaitlistSection.tsx` — the CTA is a direct link.
- Do not delete `src/app/editor/page.tsx` — it is the redirect that preserves the old URL's indexing signal.

---

## 10. External Links

| Purpose | URL |
|---|---|
| Live site | `https://upworkformatter.buraq.dev` |
| Contact / Join Us | `https://www.buraq.dev/contact` |
| Parent brand | `https://www.buraq.dev` |
| Privacy Policy page | `/privacy` |
| Terms & Conditions page | `/terms` |

---

## 11. Running the Project

```bash
# Install dependencies
npm install

# Start dev server (Turbopack) — http://localhost:3000
npm run dev

# Run lib unit tests (no test runner needed)
npx tsx src/lib/formatConverter.test.ts
npx tsx src/lib/markdownShortcuts.test.ts

# Typecheck and lint
npx tsc --noEmit
npm run lint

# Build for production
npm run build
```

Note: `CLAUDE.md` is listed in `.gitignore`, so it is not tracked by git. A duplicate copy lives in the parent folder (`../CLAUDE.md`) — keep the two in sync when editing this file.

---

## 12. Brand & Content Notes

- Brand color is **Upwork Green** (`#108a00`) — intentionally echoes Upwork's own brand since this tool is built for Upwork users.
- The tagline: *"Easily format your Upwork text with bold, italic, underline, lists and links — free, no sign-up."*
- Privacy positioning: "Nothing leaves your browser" — use this phrase in UI copy.
- The app processes all data 100% client-side. This is a core feature and must be preserved.
- "Upwork" is a registered trademark of Upwork Inc. This site is an independent tool, not affiliated with or endorsed by Upwork. Do not add copy that implies otherwise.
