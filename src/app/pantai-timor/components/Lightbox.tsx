"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, LayoutGrid, Maximize } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Libre_Caslon_Text } from "next/font/google";
import { CAROUSEL_IMAGES, COASTAL_LOCATIONS, getThumbnailUrl } from "../data";
import React, { useEffect, useRef } from "react";
import { ptTrack } from "@/utils/ga-events";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

interface LightboxProps {
  activeImageIndex: number | null;
  setActiveImageIndex: (index: number | null) => void;
  handleOverlayWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const Lightbox = ({ 
  activeImageIndex, 
  setActiveImageIndex, 
  handleOverlayWheel,
  isGridView,
  setIsGridView
}: LightboxProps) => {
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const prevIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeImageIndex !== null && prevIndexRef.current === null) {
      // Opening lightbox
      ptTrack.lightboxOpen(activeImageIndex, CAROUSEL_IMAGES[activeImageIndex].src);
    } else if (activeImageIndex === null && prevIndexRef.current !== null) {
      // Closing lightbox
      ptTrack.lightboxClose();
    } else if (
      activeImageIndex !== null &&
      prevIndexRef.current !== null &&
      activeImageIndex !== prevIndexRef.current
    ) {
      // Changing image
      ptTrack.lightboxImageChange(prevIndexRef.current, activeImageIndex, CAROUSEL_IMAGES[activeImageIndex].src);
    }
    prevIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex !== null) {
      ptTrack.lightboxToggleGrid(isGridView);
    }
  }, [isGridView, activeImageIndex]);
  
  if (!portalRoot) return null;

  const activeImage = activeImageIndex === null ? null : CAROUSEL_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((loc) => loc.image === activeImage.src) : null;

  return createPortal(
    <AnimatePresence>
      {activeImageIndex !== null && activeImage && (
        <motion.div 
          initial={false} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex h-[100svh] w-full touch-none items-center justify-center overflow-hidden overscroll-none"
          onClick={() => setActiveImageIndex(null)}
          onWheelCapture={handleOverlayWheel}
        >
          <div className="absolute inset-0 pointer-events-none bg-[#151612]/38 backdrop-blur-[56px] backdrop-saturate-[180%]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(227,225,218,0.12),transparent_60%)]" />
          
          <div className="absolute top-6 right-4 z-50 flex gap-3 md:right-8 md:top-8">
            <button 
              type="button"
              aria-label={isGridView ? "Close grid view" : "Open grid view"}
              onClick={(e) => {
                e.stopPropagation();
                setIsGridView(!isGridView);
              }}
              className="group relative flex h-12 w-12 items-center justify-center text-[#e3e1da] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:h-14 md:w-14"
            >
              <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-50">
                {isGridView ? (
                  <Maximize className="h-5 w-5" />
                ) : (
                  <LayoutGrid className="h-5 w-5" />
                )}
              </div>
            </button>
            <button 
              type="button"
              aria-label="Close photo viewer"
              onClick={() => setActiveImageIndex(null)}
              className="group relative flex h-12 w-12 items-center justify-center text-[#e3e1da] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:h-14 md:w-14"
            >
              <X className="relative z-10 h-5 w-5 transition-opacity duration-300 group-hover:opacity-50" />
            </button>
          </div>

          <button 
            type="button"
            aria-label="Previous photo"
            disabled={activeImageIndex === 0 || isGridView}
            onClick={(e) => {
              e.stopPropagation();
              if (activeImageIndex > 0) setActiveImageIndex(activeImageIndex - 1);
            }}
            className={`group absolute bottom-8 left-4 z-50 flex h-12 w-12 items-center justify-center border border-[#e3e1da]/14 bg-[#10110F]/72 text-[#e3e1da] backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:left-8 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 ${(activeImageIndex === 0 || isGridView) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronLeft className="relative z-10 h-5 w-5 transition-opacity duration-300 group-hover:opacity-50" />
          </button>

          <button 
            type="button"
            aria-label="Next photo"
            disabled={activeImageIndex === CAROUSEL_IMAGES.length - 1 || isGridView}
            onClick={(e) => {
              e.stopPropagation();
              if (activeImageIndex < CAROUSEL_IMAGES.length - 1) setActiveImageIndex(activeImageIndex + 1);
            }}
            className={`group absolute bottom-8 right-4 z-50 flex h-12 w-12 items-center justify-center border border-[#e3e1da]/14 bg-[#10110F]/72 text-[#e3e1da] backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:right-8 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 ${(activeImageIndex === CAROUSEL_IMAGES.length - 1 || isGridView) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronRight className="relative z-10 h-5 w-5 transition-opacity duration-300 group-hover:opacity-50" />
          </button>

          <AnimatePresence mode="wait">
            {isGridView ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 h-full w-full overflow-y-auto !px-4 !pb-20 !pt-28 md:!px-20 md:!pt-32 scrollbar-hide"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 max-w-[100rem] mx-auto">
                  {CAROUSEL_IMAGES.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(idx);
                        setIsGridView(false);
                      }}
                      className={`group relative aspect-square cursor-pointer overflow-hidden border border-[#e3e1da]/10 bg-[#161715] transition-colors duration-300 hover:border-[#e3e1da]/30 ${idx === activeImageIndex ? 'border-[#e3e1da]/60' : ''}`}
                    >
                      <Image
                        src={getThumbnailUrl(img.src)}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#10110F]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                         <span className="font-sans text-[0.55rem] font-black text-[#e3e1da] uppercase tracking-[0.2em]">View Photo</span>
                      </div>
                      {idx === activeImageIndex && (
                        <div className="absolute top-2 left-2 bg-[#e3e1da] text-[#10110F] !px-2 !py-0.5 font-sans text-[0.5rem] font-black uppercase tracking-tighter">
                          Current
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeImageIndex}
                initial={{ scale: 0.985, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.985, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex h-full w-full transform-gpu items-center justify-center pointer-events-none !pb-28 !pt-12 will-change-transform md:!pb-14 md:!pt-14"
              >
                <div className="relative flex w-full flex-col items-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex h-[65vh] w-full items-center justify-center sm:h-[78vh] lg:h-[86vh]">
                    <Image 
                      src={activeImage.src} 
                      alt={activeImage.alt}
                      fill
                      className="object-contain"
                      priority
                      sizes="95vw"
                    />

                    {/* Bottom Gradient Overlay for readability */}
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none h-1/2 bg-gradient-to-t from-[#10110F]/92 via-[#10110F]/42 to-transparent" />
                    
                    <motion.aside
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-0 left-0 right-0 !p-6 md:!p-10 text-left"
                    >
                      <p className="!mb-4 font-sans !text-[0.58rem] font-black uppercase !tracking-[0.28em] !text-[#e3e1da]/42">
                        {String(activeImageIndex + 1).padStart(2, "0")} / {String(CAROUSEL_IMAGES.length).padStart(2, "0")}
                      </p>
                      <h4 className={`${libreCaslon.className} !mb-0 !text-[1.8rem] !leading-[1.1] !tracking-tight !text-[#e3e1da] text-balance md:!text-[2.8rem]`}>
                        {activeLocation?.name || activeImage.alt}
                      </h4>
                      <p className="!mb-0 !mt-4 max-w-[42rem] font-sans !text-[0.84rem] !leading-[1.8] !text-[#e3e1da]/60 text-pretty md:!text-[0.92rem]">
                        {activeLocation?.description || "A frame from the eastern coast archive."}
                      </p>
                    </motion.aside>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
