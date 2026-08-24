import NavBar from './NavBar';

/**
 * Thin wrapper rendered once in the root layout, above `{children}`, so the
 * nav bar is a single persistent element rather than something each page
 * mounts on its own. Back when the app had two routes (`/` and `/editor`)
 * this also picked the right nav variant per pathname; now that everything
 * lives on one page, it's just a pass-through — kept as its own file/import
 * so `layout.tsx` doesn't need touching if that ever changes again.
 */
export default function SiteNavBar() {
  return <NavBar />;
}
