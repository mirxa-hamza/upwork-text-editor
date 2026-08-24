import type { Metadata } from 'next';
import FormatterApp from '@/components/FormatterApp';

export const metadata: Metadata = {
  title: 'Editor — Upwork Text Formatter',
  description: 'Format bold, italic, underline, bullets, numbered lists, and links as plain text that survives pasting into Upwork.',
};

export default function EditorPage() {
  return <FormatterApp />;
}
