"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import React from "react";
import { CAROUSEL_IMAGES, COASTAL_LOCATIONS } from "../data";
import { ptTrack } from "@/utils/ga-events";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

const LOCAL_TRAVEL_START = 0.01;
const LOCAL_TRAVEL_DISTANCE = 0.98; // LOCAL_TRAVEL_END - LOCAL_TRAVEL_START

interface CarouselItemProps {
  item: typeof CAROUSEL_IMAGES[0];
  index: number;
  totalItems: number;
  localScrollProgress: MotionValue<number>;
  onClick: () => void;
}

const CarouselItem = ({ item, index, totalItems, localScrollProgress, onClick }: CarouselItemProps) => {
  const centerProgress = totalItems > 1 
    ? LOCAL_TRAVEL_START + (index / (totalItems - 1)) * LOCAL_TRAVEL_DISTANCE 
    : 0.5;
  const itemProgressRange = [
    Math.max(0, centerProgress - 0.12),
    centerProgress,
    Math.min(1, centerProgress + 0.12),
  ];
  
  const scale = useTransform(localScrollProgress, 
    itemProgressRange, 
    [0.92, 1.05, 0.92]
  );
  const opacity = useTransform(localScrollProgress, 
    itemProgressRange, 
    [0.5, 1, 0.5]
  );

  return (
    <motion.div 
      onClick={() => {
        ptTrack.carouselClickImage(index, item.src);
        onClick();
      }}
      style={{ scale, opacity }}
      className={`relative h-full ${item.isPortrait ? "aspect-[2/3]" : "aspect-square md:aspect-[3/2]"} flex shrink-0 bg-[#161715] overflow-hidden border border-[#e3e1da]/10 group cursor-pointer`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 60vw, 80vw"
        className="object-cover md:object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </motion.div>
  );
};

interface TheLocalSectionProps {
  localSectionRef: React.RefObject<HTMLElement | null>;
  sectionOpacity: MotionValue<number>;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  carouselX: MotionValue<number>;
  carouselOpacity: MotionValue<number>;
  carouselPaddings: { left: number; right: number };
  localScrollProgress: MotionValue<number>;
  setActiveImageIndex: (index: number) => void;
  setIsGridView: (isGrid: boolean) => void;
}

export const TheLocalSection = ({
  localSectionRef,
  sectionOpacity,
  carouselRef,
  carouselX,
  carouselOpacity,
  carouselPaddings,
  localScrollProgress,
  setActiveImageIndex,
  setIsGridView
}: TheLocalSectionProps) => {
  const featuredImages = CAROUSEL_IMAGES.map((img, originalIdx) => ({
    ...img,
    originalIdx
  })).filter(img => {
    const loc = COASTAL_LOCATIONS.find(l => l.image === img.src);
    return loc?.featured;
  });

  return (
    <section id="archive" ref={localSectionRef} className="relative w-full h-[400svh] md:h-[500svh] bg-[#10110F] z-10">
      <motion.div style={{ opacity: sectionOpacity }} className="sticky top-0 h-[100svh] w-full flex items-start overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#10110F] via-[#10110F]/80 to-transparent z-20 pointer-events-none md:h-32" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#10110F] to-transparent z-40 pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-[#10110F] via-[#10110F]/90 to-transparent z-20 pointer-events-none" />

        <div className="relative w-full h-full max-w-[1700px] !mx-auto !px-4 !pt-32 md:!pt-0 md:!px-10 lg:!px-16 flex flex-col items-start md:flex-row md:items-center">
          
          <div className="relative z-30 flex w-[calc(100vw-3rem)] max-w-[28rem] flex-col justify-start pt-44 pb-10 shrink-0 pointer-events-none md:justify-center md:pt-0">
            <div className="pointer-events-auto">
              <h2 className="font-sans !text-xs font-black uppercase !tracking-[0.34em] !text-[#e3e1da] !mb-10 md:!tracking-[0.4em] drop-shadow-2xl">
                THE LOCAL
              </h2>
              <h3 className={`${cormorant.className} !text-[clamp(3.8rem,14vw,4.5rem)] md:!text-[4.5rem] !leading-[1.05] !tracking-normal !text-[#e3e1da] !mb-10 text-balance drop-shadow-2xl font-semibold`}>
                The Living<br />Artifact
              </h3>
              <p className="max-w-full md:max-w-[26rem] !text-sm md:!text-base !leading-[2] !text-[#e3e1da] !mb-10 text-pretty drop-shadow-lg">
                Our collection spans decades of coastal memories. We preserve not just the images, but the atmosphere of the Timor coast, treating each photographic practice with a sense of urgency.
              </p>
              <button 
                onClick={() => {
                  ptTrack.carouselViewArchive();
                  setActiveImageIndex(0);
                  setIsGridView(true);
                }}
                className="group relative flex items-center gap-4 border border-[#e3e1da]/14 bg-[#e3e1da]/8 !px-6 !py-3 font-sans !text-[0.65rem] font-black uppercase !tracking-[0.24em] !text-[#e3e1da] backdrop-blur-xl transition-all duration-300 hover:border-[#e3e1da]/40 hover:bg-[#e3e1da] hover:text-[#10110F] md:!px-8 md:!py-4"
              >
                View All Archive
                <div className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex-1 w-full h-full flex items-center">
            <motion.div
              ref={carouselRef}
              id="pantai-timor-scroller"
              style={{ 
                x: carouselX, 
                opacity: carouselOpacity,
                paddingLeft: carouselPaddings.left,
                paddingRight: carouselPaddings.right
              }}
              className="flex gap-10 md:gap-28 h-[38svh] min-h-[280px] max-h-[400px] md:h-[74svh] md:max-h-none items-center will-change-transform w-max"
            >
              {featuredImages.map((item, idx) => (
                <CarouselItem 
                  key={idx}
                  item={item}
                  index={idx}
                  totalItems={featuredImages.length}
                  localScrollProgress={localScrollProgress}
                  onClick={() => setActiveImageIndex(item.originalIdx)}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
