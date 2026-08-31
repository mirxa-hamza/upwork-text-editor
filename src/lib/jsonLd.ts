import { siteConfig } from './siteConfig';

/**
 * BreadcrumbList structured data.
 *
 * Google uses this to render the "Home > Guides > …" trail in place of the
 * raw URL in a search result, which is both more readable and a clearer
 * signal of how the guides relate to the tool itself. Paths are
 * root-relative and get absolutised here, since schema.org `item` needs a
 * full URL (unlike Next's metadata, which resolves against metadataBase).
 */
export function breadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}
