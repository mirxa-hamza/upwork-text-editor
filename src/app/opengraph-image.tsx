import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/siteConfig';

export const runtime = 'edge';
export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Generated at request time (and cached by Next) rather than a static PNG,
// so the share-card copy stays driven by siteConfig.ts instead of a design
// file nobody remembers to update. Colors are the same brand tokens used in
// globals.css (@theme), hardcoded here since this file runs on the Edge
// runtime and can't read Tailwind's CSS custom properties.
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          backgroundColor: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 20,
            backgroundColor: '#108a00',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 6h14M5 12h9M5 18h14"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: -1.5,
          }}
        >
          Upwork Text Formatter
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 500,
            color: '#475569',
            maxWidth: 880,
            textAlign: 'center',
          }}
        >
          Bold, italic, underline & lists that survive pasting into Upwork
        </div>
      </div>
    ),
    { ...size }
  );
}
