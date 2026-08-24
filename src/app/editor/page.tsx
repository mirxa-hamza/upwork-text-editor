import { redirect } from 'next/navigation';

/**
 * The tool used to live at its own /editor route; it's back on the single
 * landing page now (see app/page.tsx + FormatterApp.tsx), so this route is
 * kept only as a redirect for anyone who bookmarked or linked to /editor
 * directly, rather than leaving it as a dead 404.
 */
export default function EditorRedirect() {
  redirect('/#editor');
}
