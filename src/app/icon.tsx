import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a1a1a',
          borderRadius: 8, // Rounded corners for the icon
        }}
      >
         <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '80%', height: '80%' }}
        >
        {/* Abstract Y */}
        <path
            d="M18 18L32 32L18 46"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="round"
        />
        <path
            d="M32 32H46"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="round"
        />
        <path
            d="M46 18V46"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="round"
        />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
