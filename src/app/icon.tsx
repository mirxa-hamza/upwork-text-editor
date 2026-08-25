import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Replaces reliance on the leftover create-next-app favicon.ico (the
// default Next.js triangle logo — never actually swapped for this app's own
// mark). Next auto-generates the <link rel="icon"> tag pointing at this
// route, which modern browsers prefer over favicon.ico; favicon.ico is left
// in place purely as a legacy fallback for anything that still looks for it
// directly.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
          backgroundColor: '#108a00',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 6h14M5 12h9M5 18h14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
