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
 * Suspense), so it's part of the very first HTML the browser paints —
 * no flash, no dependency on data fetching finishing.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 500);
    const removeTimer = setTimeout(() => setVisible(false), 800);
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
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand text-on-brand">
        <Icon name="text_fields" className="text-[26px]" />
      </span>
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface-container-high border-t-brand" />
      <p className="text-sm font-medium text-on-surface-variant">Loading Upwork Text Formatter…</p>
    </div>
  );
}
