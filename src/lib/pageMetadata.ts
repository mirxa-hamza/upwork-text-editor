import type { Metadata } from 'next';
import { siteConfig } from './siteConfig';

/**
 * Builds a route's Metadata: canonical URL plus matching Open Graph and
 * Twitter cards.
 *
 * Next merges child metadata into the root layout's, but `openGraph` is
 * replaced wholesale rather than field-by-field — so a page that sets only
 * `title`/`description` still inherits the *homepage's* og:title and
 * og:url. Every share of a guide would then preview as the homepage. This
 * helper keeps the two in sync for every route.
 *
 * `path` is root-relative and matches the route ('/guides/…'), resolved
 * against `metadataBase` from the root layout.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  // The root layout's title template appends the site name to `title`; the
  // OG card has no such template, so it gets the suffix explicitly.
  const fullTitle = `${title} | ${siteConfig.name}`;

  // Declaring `openGraph` on a child route replaces the parent's object
  // outright, which also drops the og:image that app/opengraph-image.tsx
  // contributes to the root segment — verified in the build output: pages
  // with an openGraph override emitted no og:image at all. So the share card
  // is re-attached here, by the route the file convention already serves.
  const images = [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.ogImageAlt }];

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      url: path,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images,
    },
  };
}
