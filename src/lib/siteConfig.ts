/**
 * Single source of truth for the site's public URL and shared SEO metadata.
 *
 * PLACEHOLDER DOMAIN: this project isn't pointed at a live production
 * domain yet, so `url` below is a clearly-marked placeholder (kept
 * consistent with the `hello@upworkformatter.com` address already used on
 * the Privacy/Terms pages). Every SEO-facing URL — canonical links, the
 * sitemap, robots.txt, Open Graph/Twitter cards, JSON-LD — is generated
 * from this one constant, so once the real domain is live, either set the
 * `NEXT_PUBLIC_SITE_URL` environment variable in hosting, or update the
 * fallback string below. Nothing else in the codebase needs to change.
 */
export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://upworkformatter.com').replace(/\/+$/, ''),
  name: 'Upwork Text Formatter',
  title: 'Upwork Text Formatter — Bold, Italic, Underline & Lists for Upwork',
  description:
    'Format bold, italic, underline, bullet lists, numbered lists, and links as plain Unicode text that survives pasting into Upwork proposals, messages, and job posts. Free, no sign-up, 100% client-side.',
  ogImageAlt: 'Upwork Text Formatter — free text formatting tool for Upwork proposals and messages',
} as const;
