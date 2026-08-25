import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';

// Completes the "add to home screen" / share-metadata picture. Even for a
// tool with no plans to be an installable PWA, a manifest is a cheap,
// standard signal of a properly finished site rather than a bare
// create-next-app scaffold — and it's what several SEO/site-audit tools
// check for as a completeness signal.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Upwork Formatter',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#108a00',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
