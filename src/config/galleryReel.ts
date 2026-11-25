import type { CinematicCoverSource } from "@/components/common/CinematicCover/CinematicCover";

const PORTRAIT = "(max-aspect-ratio: 4/5)";

/**
 * Touge reel used as the /gallery cover.
 * Highlights from 7:30, 9:05, 11:10 and 12:32, cross-dissolved into a seamless
 * loop. AV1 first (Chrome, Firefox, Edge, AV1-capable Apple chips), HEVC for
 * other Apple devices; portrait screens get a 3:4 crop to match the stacked
 * phone layout.
 */
export const GALLERY_REEL = {
  sources: [
    {
      src: "/videos/touge-reel-3x4.av1.mp4",
      type: 'video/mp4; codecs="av01.0.08M.10"',
      media: PORTRAIT,
    },
    {
      src: "/videos/touge-reel-3x4.hevc.mp4",
      type: 'video/mp4; codecs="hvc1.1.6.L120.B0"',
      media: PORTRAIT,
    },
    {
      src: "/videos/touge-reel-1440p.av1.mp4",
      type: 'video/mp4; codecs="av01.0.12M.10"',
    },
    {
      src: "/videos/touge-reel-1440p.hevc.mp4",
      type: 'video/mp4; codecs="hvc1.1.6.L150.B0"',
    },
  ] satisfies CinematicCoverSource[],
  poster: "/images/touge-reel-poster.webp",
};
