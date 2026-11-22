"use client";

import { Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import { CAROUSEL_IMAGES } from "./constants";
import type { LocalArchiveSectionProps } from "./types";

export function LocalArchiveSection({
  carouselRef,
  carouselX,
  carouselOpacity,
  hasExitedLocalSection,
  isLocalAutoplaying,
  localSectionRef,
  onImageClick,
  onToggleAutoplay,
  sectionOpacity,
  shouldReduceMotion,
}: LocalArchiveSectionProps) {
  // Preload images for the living artifact section
  useEffect(() => {
    const preloadImages = () => {
      CAROUSEL_IMAGES.forEach((item) => {
        const img = new window.Image();
        img.src = item.src;
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => preloadImages());
    } else {
      const timer = setTimeout(preloadImages, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section ref={localSectionRef} className="relative w-full h-[640svh] md:h-[760svh] bg-[#10110F] z-10">
      <motion.div style={{ opacity: hasExitedLocalSection ? 1 : sectionOpacity }} className="sticky top-0 h-[100svh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#10110F] via-[#10110F]/80 to-transparent z-40 pointer-events-none md:h-32" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#10110F] to-transparent z-40 pointer-events-none" />

        <div className="relative w-full h-full max-w-[1700px] !mx-auto !px-4 md:!px-10 lg:!px-16 flex items-end justify-center pb-8 md:pb-12">
          <div className="relative z-30 flex items-center gap-4">
            <button
              type="button"
              aria-label={isLocalAutoplaying ? "Pause horizontal autoplay" : "Start horizontal autoplay"}
              onClick={onToggleAutoplay}
              disabled={shouldReduceMotion}
              className="flex h-11 items-center gap-3 border border-[#e3e1da]/16 bg-[#10110F]/72 !px-4 font-sans text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#e3e1da] backdrop-blur-xl transition-colors duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLocalAutoplaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isLocalAutoplaying ? "PAUSE" : "AUTO"}</span>
            </button>
          </div>

          <div className="absolute inset-0 z-10 flex items-center">
            <motion.div
              ref={carouselRef}
              id="pantai-timor-scroller"
              style={{ x: carouselX, opacity: hasExitedLocalSection ? 1 : carouselOpacity }}
              className="flex h-[54svh] min-h-[280px] max-h-[520px] w-max items-center gap-6 will-change-transform !pl-[10vw] pr-[20vw] md:h-[74svh] md:max-h-none md:gap-28"
            >
              {CAROUSEL_IMAGES.map((item, idx) => (
                <div
                  key={item.src}
                  onClick={() => onImageClick(idx)}
                  className={`relative flex h-full max-w-[82vw] shrink-0 cursor-pointer overflow-hidden border border-[#e3e1da]/10 bg-[#161715] group md:max-w-none ${item.isPortrait ? "aspect-[2/3]" : "aspect-square md:aspect-auto"}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 85vw"
                    priority={idx < 3}
                    unoptimized={true}
                    className={`transition-transform duration-700 ease-out group-hover:scale-[1.03] ${item.isPortrait ? "object-contain" : "object-cover"}`}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
