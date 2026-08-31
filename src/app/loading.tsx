import Icon from '@/components/Icon';

/**
 * Next.js's built-in route-loading UI — automatically shown by the App
 * Router while this route segment is being prepared (e.g. during
 * client-side navigation, or while the server is streaming the page).
 * Same look as PageLoader.tsx (the first-paint splash rendered from the
 * root layout) for a consistent loading experience; this one is markup
 * only, no client-side fade, since Next swaps it out for the real page
 * automatically once it's ready.
 *
 * Shows the same badge + wordmark as Logo.tsx (the navbar logo), not the
 * NavBar's <Logo /> component itself — that renders a <Link>, which has no
 * place in a loading screen. Kept in sync with Logo.tsx and PageLoader.tsx
 * by hand.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-surface">
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
