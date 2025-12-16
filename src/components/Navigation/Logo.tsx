export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="YH Logo"
    >
      {/* Abstract Y */}
      <path
        d="M18 18L32 32L18 46"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M32 32H46"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      {/* Abstract H implied by the horizontal and vertical connections? 
          User asked for 'Creative'. Let's try a unified glyph.
          A single path that forms Y and H.
      */}
      <path
        d="M46 18V46"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
// Try 2: A simpler, sharher modern YH
// Y: Left branch, Right branch merging.
// H: Two verticals.
// 
// Let's replace with:
// A stylish Monoline YH
// M 16 16 L 32 32 L 48 16 (The V of Y, but also top of H?)
// M 32 32 V 48 (Stem of Y)
// M 16 16 V 48 (Left H) ?? No.
//
// Let's go with the one implemented below:
// Sharp geometric YH.
// Y constructed of 2 separate lines?
// H constructed of 2 separate lines.
// Minimalist:
// Y: \ / |
// H: | - |
