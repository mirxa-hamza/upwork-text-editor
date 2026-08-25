# Upwork Text Formatter

A free, client-side tool that lets Upwork freelancers format their proposals, messages, and job posts — bold, italic, underline, bullet lists, numbered lists, and links — even though Upwork strips real formatting on paste.

**How it works, in one sentence:** Upwork's text fields strip HTML and Markdown, but they can't strip plain characters — so instead of sending real formatting, this tool converts your text into Unicode characters that already *look* bold, italic, or underlined. There's nothing for Upwork to strip, because nothing but plain text was ever sent.

No backend, no account, no sign-up. Everything runs locally in your browser — nothing you type or paste is stored or transmitted anywhere.

## Features

- **Bold, italic, underline** — via the toolbar, `Ctrl/Cmd+B/I/U`, or Markdown-style shorthand (`**bold**`, `_italic_`, `~underline~`)
- **Bullet and numbered lists** — via the toolbar or typing `- ` / `1. ` at the start of a line
- **Links** — inserted as plain, readable text (`label (https://url)`) so they stay visible even where a field doesn't auto-link
- **Live preview** — shows exactly what will paste into Upwork, side-by-side with the editor
- **One-click copy** of the converted text
- **Toolbar active-state highlighting** — buttons reflect the formatting under the current selection/caret, like a normal rich-text editor

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme` config, no component library) |
| Font | [Poppins](https://fonts.google.com/specimen/Poppins) (via `next/font/google`) |
| Icons | [Material Symbols Outlined](https://fonts.google.com/icons) |

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running. The dev server uses Turbopack, so edits to any file under `src/` hot-reload immediately.

```bash
# Run the formatting-logic unit tests (plain Node, no test runner needed)
npx tsx src/lib/formatConverter.test.ts
npx tsx src/lib/markdownShortcuts.test.ts

# Production build
npm run build
npm run start

# Lint
npm run lint
```

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing page — hero + the editor tool, above the fold
│   ├── layout.tsx            # Root layout: fonts, nav, metadata, JSON-LD
│   ├── globals.css           # Tailwind v4 theme tokens (brand color, surfaces, etc.)
│   ├── about/                # About page
│   ├── guides/                # SEO/help guides (bold text, bullet points, why formatting disappears)
│   ├── privacy/, terms/       # Legal pages
│   ├── editor/                # Legacy route — permanently redirects to /#editor
│   ├── robots.ts, sitemap.ts  # Search-engine file-convention routes
│   ├── icon.tsx, apple-icon.tsx, opengraph-image.tsx, manifest.ts   # Generated icons/share image/PWA manifest
│   └── not-found.tsx          # Custom 404
│
├── components/
│   ├── FormatterApp.tsx      # The tool itself: shortcuts bar + toolbar + editor + preview
│   ├── Editor.tsx             # contentEditable rich-text input (core interaction logic)
│   ├── Toolbar.tsx            # Bold/Italic/Underline/Bullet/Numbered/Link buttons
│   ├── PreviewPane.tsx        # Read-only preview of the converted Unicode text
│   ├── Hero.tsx, WhyFormat.tsx, HowItWorks.tsx, Faq.tsx, WaitlistSection.tsx, Footer.tsx
│   └── NavBar.tsx, SiteNavBar.tsx, Logo.tsx, Icon.tsx, PageLoader.tsx, Reveal.tsx
│
└── lib/
    ├── formatConverter.ts        # HTML → Unicode text converter (the core logic, DOM-free)
    ├── markdownShortcuts.ts      # **bold**, _italic_, ~underline~, list shorthand
    ├── unicodeMaps.ts            # Unicode character maps for bold/italic/underline
    ├── siteConfig.ts             # Single source of truth for the site URL + shared metadata
    └── guides.ts                 # Shared metadata for the /guides pages
```

## Configuring the production domain

Every SEO-facing URL (canonical links, the sitemap, `robots.txt`, Open Graph/Twitter cards, JSON-LD) is generated from one constant in `src/lib/siteConfig.ts`. Once this is deployed to a real domain, set the `NEXT_PUBLIC_SITE_URL` environment variable in your hosting provider (or edit the fallback string in that file directly) — nothing else needs to change.

## Deploying

Built for [Vercel](https://vercel.com) (or any Next.js-compatible host). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.

## Author

Built and maintained by **Hamza Mustafa** ([@mirxa-hamza](https://github.com/mirxa-hamza)) and [buraq.dev](https://www.buraq.dev).

Questions or feedback: [buraq.dev/contact](https://www.buraq.dev/contact)
