import Icon from '@/components/Icon';

/**
 * Next.js's built-in route-loading UI — automatically shown by the App
 * Router while this route segment is being prepared (e.g. during
 * client-side navigation, or while the server is streaming the page).
 * Same look as PageLoader.tsx (the first-paint splash rendered from the
 * root layout) for a consistent loading experience; this one is markup
 * only, no client-side fade, since Next swaps it out for the real page
 * automatically once it's ready.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-surface">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand text-on-brand">
        <Icon name="text_fields" className="text-[26px]" />
      </span>
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface-container-high border-t-brand" />
      <p className="text-sm font-medium text-on-surface-variant">Loading Upwork Text Formatter…</p>
    </div>
  );
}
