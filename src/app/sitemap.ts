import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';
import { GUIDES } from '@/lib/guides';

// /editor is intentionally excluded — it's a redirect-only route (see
// app/editor/page.tsx), not a page worth indexing on its own.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/guides', changeFrequency: 'monthly', priority: 0.6 },
    ...GUIDES.map((guide) => ({
      path: `/guides/${guide.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
