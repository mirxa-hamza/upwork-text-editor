import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS "Add to Home Screen" icon — Apple ignores rel="icon"/manifest icons
// and specifically looks for this convention (or an explicit
// apple-touch-icon link, which Next generates automatically from this file).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#108a00',
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 6h14M5 12h9M5 18h14" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
