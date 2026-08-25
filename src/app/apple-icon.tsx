import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS "Add to Home Screen" icon — green background with white "Tf" lettermark,
// matching the browser tab favicon and NavBar logo mark.
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
          borderRadius: 40,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 90,
            fontWeight: 700,
            fontFamily: 'serif',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          Tf
        </span>
      </div>
    ),
    { ...size }
  );
}
