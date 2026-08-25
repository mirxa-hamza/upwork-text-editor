import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Browser tab favicon — green rounded square with white "Tf" lettermark,
// matching the NavBar logo mark exactly.
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
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960">
          <path fill="#ffffff" d="M280-160v-520H80v-120h520v120H400v520H280Zm360 0v-320H520v-120h360v120H760v320H640Z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
