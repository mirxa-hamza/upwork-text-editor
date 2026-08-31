import { permanentRedirect } from 'next/navigation';

/**
 * The tool used to live at its own /editor route; it's back on the single
 * landing page now (see app/page.tsx + FormatterApp.tsx), so this route is
 * kept only as a redirect for anyone who bookmarked or linked to /editor
 * directly, rather than leaving it as a dead 404.
 *
 * permanentRedirect() (308) rather than redirect() (307) — this move is
 * permanent, not situational, so search engines should transfer /editor's
 * indexing signal to the new location instead of continuing to crawl both.
 */
export default function EditorRedirect() {
  permanentRedirect('/#editor');
}
