import type { MotionValue } from "framer-motion";
import type { RefObject } from "react";

export interface PantaiTimorFontClasses {
  serif: string;
  sans: string;
  chinese?: string;
  arabic?: string;
}

export interface PantaiTimorImage {
  src: string;
  alt: string;
  isSpecial?: boolean;
  isPortrait?: boolean;
}

export interface LocalArchiveSectionProps {
  carouselRef: RefObject<HTMLDivElement | null>;
  localSectionRef: RefObject<HTMLElement | null>;
  carouselX: MotionValue<number>;
  carouselOpacity: MotionValue<number>;
  fonts: PantaiTimorFontClasses;
  hasExitedLocalSection: boolean;
  isLocalAutoplaying: boolean;
  localSnapIndex: number;
  onImageClick: (index: number) => void;
  onToggleAutoplay: () => void;
  sectionOpacity: MotionValue<number>;
  shouldReduceMotion: boolean;
}
