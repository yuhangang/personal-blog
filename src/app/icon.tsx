import { ImageResponse } from 'next/og';
 
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
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px', // Rounded corners (approx 25% of 32px)
          overflow: 'hidden',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute' }}
        >
          {/* Thick, few messy orange threads */}
          {/* Color: #ff4d00 */}
          
          {/* Extreme Chaos: Dense, frantic scribbles */}
          
          {/* Base scribbles - providing fullness */}
          <path d="M2 16 Q 16 -10, 30 16 T 2 16" stroke="#ff4d00" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M16 2 Q -10 16, 16 30 T 16 2" stroke="#ff4d00" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
          
          {/* Erratic erratic loops */}
          <path d="M4 4 C 12 20, 28 0, 16 32" stroke="#ff4d00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M28 4 C 0 12, 32 28, 4 28" stroke="#ff4d00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Sharp jagged cuts */}
          <path d="M0 10 L 10 0 L 20 10 L 32 5" stroke="#ff4d00" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M32 22 L 22 32 L 12 22 L 0 28" stroke="#ff4d00" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          
          {/* Circular chaotic swirls */}
          <path d="M16 16 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0" stroke="#ff4d00" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" strokeDasharray="4 2" />
          
          {/* Random noise lines */}
          <path d="M6 6 Q 26 26, 6 26" stroke="#ff4d00" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M26 6 Q 6 26, 26 26" stroke="#ff4d00" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M16 0 V 32" stroke="#ff4d00" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <path d="M0 16 H 32" stroke="#ff4d00" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          
          {/* Final heavy overlay for texture */}
          <path d="M2 2 C 8 8, 24 24, 30 30 M 30 2 C 24 8, 8 24, 2 30" stroke="#ff4d00" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
