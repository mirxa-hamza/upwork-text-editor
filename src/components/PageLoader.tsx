'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';

/**
 * A branded loading screen shown the moment the page first renders. This
 * page has no real data-fetching delay to wait on (everything is static/
 * client-side), so there's nothing to naturally gate a spinner on — the
 * overlay instead shows for a short, fixed minimum time so the "loading"
 * animation is actually visible, then fades out on its own.
 *
 * Rendered as a client component directly in the root layout (not behind
 * Suspense), so it's part of the very first HTML the browser paints — no
 * flash, no dependency on data fetching finishing. Kept deliberately short
 * (was 500/800ms): since this overlay is the first full-viewport thing the
 * browser paints, it's a likely candidate for the page's Largest
 * Contentful Paint element, and every extra millisecond it's held on
 * screen is a millisecond the real content (which is already ready) stays
 * hidden behind it for no reason.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 200);
    const removeTimer = setTimeout(() => setVisible(false), 400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-surface transition-opacity duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Same badge + wordmark as Logo.tsx (the navbar logo), not the
          NavBar's <Logo /> component itself — that renders a <Link>, and a
          clickable/navigable element has no place in an aria-hidden splash
          screen. Kept in sync by hand; if Logo.tsx's markup changes, update
          this (and loading.tsx) to match. */}
      <span className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-on-brand">
          <Icon name="text_fields" className="text-[18px]" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-on-surface">Upwork Text Formatter</span>
      </span>
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface-container-high border-t-brand" />
      <p className="text-sm font-medium text-on-surface-variant">Loading…</p>
    </div>
  );
}
