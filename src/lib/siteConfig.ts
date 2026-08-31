/**
 * Single source of truth for the site's public URL and shared SEO metadata.
 *
 * Every SEO-facing URL — canonical links, the sitemap, robots.txt, Open
 * Graph/Twitter cards, JSON-LD — is generated from `url` below, so a domain
 * change only ever needs to happen here (or via the `NEXT_PUBLIC_SITE_URL`
 * environment variable in hosting, which takes precedence).
 */
const rawUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://upworkformatter.buraq.dev').replace(
  /\/+$/,
  ''
);

export const siteConfig = {
  url: rawUrl,
  // Bare host, for prose that reads better without the scheme
  // ("the editor at upworkformatter.buraq.dev"). Derived rather than
  // written out twice so it can't drift from `url`.
  domain: rawUrl.replace(/^https?:\/\//, ''),
  name: 'Upwork Text Formatter',
  title: 'Upwork Text Formatter — Bold Text & Proposal Formatting for Upwork',
  description:
    "Free Unicode text converter for Upwork proposal formatting. Bold, italic, underline, and bullet points that survive Upwork's plain-text fields. No sign-up.",
  ogImageAlt: 'Upwork Text Formatter — free text formatting tool for Upwork proposals and messages',
  // Set GOOGLE_SITE_VERIFICATION in hosting to emit the Search Console
  // <meta name="google-site-verification"> tag. Left undefined when unset so
  // no empty tag is rendered — DNS/HTML-file verification works fine too.
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
} as const;
