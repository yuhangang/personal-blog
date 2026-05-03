"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, LayoutGrid, Maximize } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Libre_Caslon_Text } from "next/font/google";
import { FEATURED_IMAGES, COASTAL_LOCATIONS, getThumbnailUrl, PANTAI_TIMOR_COPY } from "../config";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ptTrack } from "@/utils/ga-events";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const lightboxFrameVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction === 0 ? 0 : direction > 0 ? 72 : -72,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction === 0 ? 0 : direction > 0 ? -72 : 72,
  }),
};

interface LightboxProps {
  activeImageIndex: number | null;
  setActiveImageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const Lightbox = ({ 
  activeImageIndex, 
  setActiveImageIndex, 
  isGridView,
  setIsGridView
}: LightboxProps) => {
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const prevIndexRef = useRef<number | null>(null);
  const scrollLockYRef = useRef(0);
  const [transitionDirection, setTransitionDirection] = useState(0);

  useEffect(() => {
    if (activeImageIndex !== null && prevIndexRef.current === null) {
      // Opening lightbox
      ptTrack.lightboxOpen(activeImageIndex, FEATURED_IMAGES[activeImageIndex].src);
    } else if (activeImageIndex === null && prevIndexRef.current !== null) {
      // Closing lightbox
      ptTrack.lightboxClose();
    } else if (
      activeImageIndex !== null &&
      prevIndexRef.current !== null &&
      activeImageIndex !== prevIndexRef.current
    ) {
      // Changing image
      ptTrack.lightboxImageChange(prevIndexRef.current, activeImageIndex, FEATURED_IMAGES[activeImageIndex].src);
    }
    prevIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex !== null) {
      ptTrack.lightboxToggleGrid(isGridView);
    }
  }, [isGridView, activeImageIndex]);

  useLayoutEffect(() => {
    const previousIndex = prevIndexRef.current;
    if (previousIndex === null || activeImageIndex === null) {
      setTransitionDirection(0);
    } else {
      setTransitionDirection(activeImageIndex > previousIndex ? 1 : -1);
    }
    prevIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex === null) return;

    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalLeft = body.style.left;
    const originalRight = body.style.right;
    const originalWidth = body.style.width;

    scrollLockYRef.current = window.scrollY;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollLockYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.left = originalLeft;
      body.style.right = originalRight;
      body.style.width = originalWidth;
      window.scrollTo(0, scrollLockYRef.current);
    };
  }, [activeImageIndex]);
  
  if (!portalRoot) return null;

  const activeImage = activeImageIndex === null ? null : FEATURED_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((loc) => loc.image === activeImage.src) : null;

  return createPortal(
    <AnimatePresence>
      {activeImageIndex !== null && activeImage && (
        <motion.div 
          initial={false} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden overscroll-none ${isGridView ? "touch-auto" : "touch-none"}`}
          onClick={() => setActiveImageIndex(null)}
        >
          <div className="absolute inset-0 pointer-events-none bg-[#151612]/38 backdrop-blur-[56px] backdrop-saturate-[180%]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(227,225,218,0.12),transparent_60%)]" />
          
          <div className="absolute top-6 right-4 z-[120] flex gap-3 md:right-8 md:top-8">
            <button 
              type="button"
               aria-label={isGridView ? PANTAI_TIMOR_COPY.lightbox.aria.closeGrid : PANTAI_TIMOR_COPY.lightbox.aria.openGrid}
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
               aria-label={PANTAI_TIMOR_COPY.lightbox.aria.closeLightbox}
              onClick={() => setActiveImageIndex(null)}
              className="group relative flex h-12 w-12 items-center justify-center text-[#e3e1da] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:h-14 md:w-14"
            >
              <X className="relative z-10 h-5 w-5 transition-opacity duration-300 group-hover:opacity-50" />
            </button>
          </div>

          <button 
            type="button"
             aria-label={PANTAI_TIMOR_COPY.lightbox.aria.prevPhoto}
            disabled={activeImageIndex === 0 || isGridView}
            onClick={(e) => {
              e.stopPropagation();
              if (activeImageIndex > 0) setActiveImageIndex(activeImageIndex - 1);
            }}
            className={`fixed inset-y-0 left-0 z-[110] flex w-[20%] items-center justify-start pl-2 text-[#e3e1da] outline-none transition-all duration-300 md:w-[15%] md:pl-6 ${(activeImageIndex === 0 || isGridView) ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-100'}`}
          >
            <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" />
          </button>

          <button 
            type="button"
             aria-label={PANTAI_TIMOR_COPY.lightbox.aria.nextPhoto}
            disabled={activeImageIndex === FEATURED_IMAGES.length - 1 || isGridView}
            onClick={(e) => {
              e.stopPropagation();
              if (activeImageIndex < FEATURED_IMAGES.length - 1) setActiveImageIndex(activeImageIndex + 1);
            }}
            className={`fixed inset-y-0 right-0 z-[110] flex w-[20%] items-center justify-end pr-2 text-[#e3e1da] outline-none transition-all duration-300 md:w-[15%] md:pr-6 ${(activeImageIndex === FEATURED_IMAGES.length - 1 || isGridView) ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-100'}`}
          >
            <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
          </button>

          <AnimatePresence mode="wait">
            {isGridView ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex h-full w-full justify-center overflow-y-auto !px-4 !pb-20 !pt-28 md:!px-10 md:!pt-32 xl:!px-14 scrollbar-hide touch-pan-y"
                data-lenis-prevent
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full max-w-[92rem]">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 md:gap-5 xl:gap-6">
                    {FEATURED_IMAGES.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => {
                          setActiveImageIndex(idx);
                          setIsGridView(false);
                        }}
                        className={`group relative aspect-square w-full cursor-pointer overflow-hidden border transition-all duration-500 bg-[#161715] ${
                          idx === activeImageIndex 
                            ? 'z-10 scale-[1.02] border-[#e3e1da]' 
                            : 'border-[#e3e1da]/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={getThumbnailUrl(img.src)}
                          alt={img.alt}
                          fill
                          sizes="(min-width: 1536px) 18rem, (min-width: 1280px) 21vw, (min-width: 1024px) 24vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#10110F]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                          <span className="font-sans text-[0.55rem] font-black text-[#e3e1da] uppercase tracking-[0.2em]">{PANTAI_TIMOR_COPY.lightbox.viewPhoto}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                <AnimatePresence mode="wait" custom={transitionDirection}>
                  <motion.div
                    key={activeImageIndex}
                    custom={transitionDirection}
                    variants={lightboxFrameVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex h-full w-full items-center justify-center !p-4 will-change-transform md:!p-16 lg:!p-24"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.08}
                      dragMomentum={false}
                      onDragEnd={(_, info) => {
                        const threshold = 110;
                        const velocityThreshold = 550;

                        if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                          setActiveImageIndex((prev) =>
                            prev !== null && prev < FEATURED_IMAGES.length - 1 ? prev + 1 : prev
                          );
                        } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                          setActiveImageIndex((prev) =>
                            prev !== null && prev > 0 ? prev - 1 : prev
                          );
                        }
                      }}
                      className="relative flex h-[55vh] w-full max-w-[88rem] cursor-grab items-center justify-center active:cursor-grabbing sm:h-[70vh] lg:h-[80vh]"
                    >
                      <Image
                        src={activeImage.src}
                        alt={activeImage.alt}
                        fill
                        className="object-contain"
                        priority
                        sizes="95vw"
                        draggable={false}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Fixed UI elements - stay consistent while images scroll */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none z-20">
                  <div className="h-[45vh] bg-gradient-to-t from-[#10110F] via-[#10110F]/60 to-transparent" />
                  
                  <AnimatePresence mode="wait">
                    <motion.aside
                      key={activeImageIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-0 left-0 right-0 !p-6 md:!p-16 text-left pb-12 md:pb-20 pointer-events-auto"
                    >
                      <p className="!mb-4 font-sans !text-[0.58rem] font-black uppercase !tracking-[0.28em] !text-[#e3e1da]/42">
                        {String(activeImageIndex + 1).padStart(2, "0")} / {String(FEATURED_IMAGES.length).padStart(2, "0")}
                      </p>
                      <h4 className={`${libreCaslon.className} !mb-0 !text-[1.8rem] !leading-[1.1] !tracking-tight !text-[#e3e1da] text-balance md:!text-[2.8rem]`}>
                        {activeLocation?.name || activeImage.alt}
                      </h4>
                       <p className="!mb-0 !mt-4 max-w-[42rem] font-sans !text-[0.84rem] !leading-[1.8] !text-[#e3e1da]/60 text-pretty md:!text-[0.92rem]">
                        {activeLocation?.description || PANTAI_TIMOR_COPY.lightbox.defaultDescription}
                      </p>
                    </motion.aside>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
