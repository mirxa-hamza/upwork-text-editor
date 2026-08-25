/**
 * Shared metadata for every /guides/* page — one place listing each guide's
 * slug, title, and one-line description, so the /guides index and each
 * guide's own cross-links to "related guides" stay in sync automatically
 * instead of three pages hand-linking to each other and drifting.
 */
export const GUIDES = [
  {
    slug: 'bold-text-in-upwork-proposals',
    title: 'How to Bold Text in an Upwork Proposal',
    description:
      'Upwork strips real bold formatting on paste. Here’s how to actually make text bold in a proposal, job post, or message anyway.',
  },
  {
    slug: 'bullet-points-in-upwork-messages',
    title: 'How to Add Bullet Points to an Upwork Message',
    description:
      'Turn a wall of text into a skimmable list inside any Upwork message, proposal, or job post field.',
  },
  {
    slug: 'why-formatting-disappears-on-upwork',
    title: 'Why Your Formatting Disappears When You Paste Into Upwork',
    description:
      'The real reason bold, italic, and bullets vanish the moment you paste into Upwork — and the one type of character that survives.',
  },
] as const;

export type Guide = (typeof GUIDES)[number];
