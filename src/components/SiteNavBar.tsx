'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

/**
 * Rendered once in the root layout (not inside either page) so the nav bar
 * is a single persistent element across client-side navigation between `/`
 * and `/editor` — React's App Router keeps a layout mounted across route
 * changes and only swaps out `children`, so this never unmounts/remounts
 * (and therefore never visibly resizes, flashes, or re-lays-out) the way it
 * would if each page rendered its own copy of <NavBar>. Only the CTA button
 * needs to differ per route, so that's the one thing derived here.
 */
export default function SiteNavBar() {
  const pathname = usePathname();
  const variant = pathname?.startsWith('/editor') ? 'editor' : 'landing';
  return <NavBar variant={variant} />;
}
