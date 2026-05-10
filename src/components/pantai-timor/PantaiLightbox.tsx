"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CAROUSEL_IMAGES } from "./constants";
import Image from "next/image";
import type { CoastalLocation } from "@/app/pantai-timor/config";
import type { PantaiTimorFontClasses, PantaiTimorImage } from "./types";

const lightboxFrameVariants = {
  enter: (direction: number) => ({
    scale: 0.985,
    opacity: 0,
    x: direction === 0 ? 0 : direction > 0 ? 72 : -72,
  }),
  center: {
    scale: 1,
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    scale: 0.985,
    opacity: 0,
    x: direction === 0 ? 0 : direction > 0 ? -72 : 72,
  }),
};

interface PantaiLightboxProps {
  activeImage: PantaiTimorImage | null;
  activeImageIndex: number | null;
  activeLocation: CoastalLocation | null;
  fonts: PantaiTimorFontClasses;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function PantaiLightbox({
  activeImage,
  activeImageIndex,
  activeLocation,
  fonts,
  onClose,
  onNavigate,
}: PantaiLightboxProps) {
  const scrollLockYRef = useRef(0);
  const previousIndexRef = useRef<number | null>(null);
  const [transitionDirection, setTransitionDirection] = useState(0);

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

  useLayoutEffect(() => {
    const previousIndex = previousIndexRef.current;
    if (previousIndex === null || activeImageIndex === null) {
      setTransitionDirection(0);
    } else {
      setTransitionDirection(activeImageIndex > previousIndex ? 1 : -1);
    }
    previousIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  // Preload next and previous images for the lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;

    const indicesToPreload = [
      activeImageIndex + 1,
      activeImageIndex - 1,
      activeImageIndex + 2 // Extra buffer
    ].filter(idx => idx >= 0 && idx < CAROUSEL_IMAGES.length);

    indicesToPreload.forEach(idx => {
      const img = new window.Image();
      img.src = CAROUSEL_IMAGES[idx].src;
    });
  }, [activeImageIndex]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {activeImageIndex !== null && activeImage && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex h-[100svh] w-full touch-auto items-center justify-center overflow-hidden overscroll-none"
          onClick={onClose}
        >
          <div className="absolute inset-0 pointer-events-none bg-[#151612]/38 backdrop-blur-[56px] backdrop-saturate-[180%]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(227,225,218,0.1),transparent_56%),linear-gradient(180deg,rgba(16,17,15,0.08),rgba(16,17,15,0.18))]" />
          <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-[#e3e1da]/12 bg-[#151612]/42 !px-4 !py-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[32px] backdrop-saturate-[180%] md:!px-8" onClick={(event) => event.stopPropagation()}>
            <div className="min-w-0">
              <p className="!mb-0 font-sans !text-[0.56rem] font-black uppercase !leading-none !tracking-[0.26em] !text-[#e3e1da]/42 md:!tracking-[0.34em]">
                Pantai Timor Archive
              </p>
              <p className="!mb-0 !mt-2 truncate font-sans !text-[0.7rem] font-bold uppercase !leading-none !tracking-[0.2em] !text-[#e3e1da] md:!text-[0.78rem]">
                {activeLocation?.name || activeImage.alt}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close photo viewer"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e3e1da]/16 bg-[#e3e1da]/8 text-[#e3e1da] backdrop-blur-xl transition-colors duration-200 hover:border-[#e3e1da]/32 hover:bg-[#e3e1da]/14 hover:text-[#e3e1da] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Previous photo"
            disabled={activeImageIndex === 0}
            onClick={(event) => {
              event.stopPropagation();
              if (activeImageIndex > 0) onNavigate(activeImageIndex - 1);
            }}
            className={`absolute bottom-8 left-4 z-50 flex h-12 w-12 items-center justify-center border border-[#e3e1da]/14 bg-[#10110F]/72 text-[#e3e1da] backdrop-blur-xl transition-all duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:left-8 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 ${activeImageIndex === 0 ? "opacity-25" : ""}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next photo"
            disabled={activeImageIndex === CAROUSEL_IMAGES.length - 1}
            onClick={(event) => {
              event.stopPropagation();
              if (activeImageIndex < CAROUSEL_IMAGES.length - 1) onNavigate(activeImageIndex + 1);
            }}
            className={`absolute bottom-8 right-4 z-50 flex h-12 w-12 items-center justify-center border border-[#e3e1da]/14 bg-[#10110F]/72 text-[#e3e1da] backdrop-blur-xl transition-all duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:right-8 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 ${activeImageIndex === CAROUSEL_IMAGES.length - 1 ? "opacity-25" : ""}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait" custom={transitionDirection}>
            <motion.div
              key={activeImageIndex}
              custom={transitionDirection}
              variants={lightboxFrameVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full w-full transform-gpu items-center justify-center overflow-y-auto pointer-events-auto touch-pan-y !px-4 !pb-28 !pt-24 will-change-transform md:!px-28 md:!pb-14 md:!pt-28"
              data-lenis-prevent
            >
              <div className="grid w-full max-w-[92rem] grid-cols-1 items-end gap-7 pointer-events-auto lg:grid-cols-[minmax(0,1fr)_20rem]" onClick={(event) => event.stopPropagation()}>
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.08}
                  dragMomentum={false}
                  onDragEnd={(_, info) => {
                    const threshold = 110;
                    const velocityThreshold = 550;

                    if (activeImageIndex === null) return;

                    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                      onNavigate(Math.min(CAROUSEL_IMAGES.length - 1, activeImageIndex + 1));
                      return;
                    }

                    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                      onNavigate(Math.max(0, activeImageIndex - 1));
                    }
                  }}
                  className="relative flex h-[58svh] w-full cursor-grab items-center justify-center border border-[#e3e1da]/10 bg-[#151612]/60 !p-2 shadow-[0_34px_110px_rgba(0,0,0,0.62)] active:cursor-grabbing md:h-[74svh]"
                >
                  <Image 
                    src={activeImage.src} 
                    alt={activeImage.alt} 
                    fill
                    unoptimized={true}
                    priority={true}
                    className="object-contain" 
                    draggable={false} 
                  />
                </motion.div>

                <motion.aside
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-l border-[#e3e1da]/12 !pl-5 text-left md:!pl-7"
                >
                  <p className="!mb-5 font-sans !text-[0.58rem] font-black uppercase !tracking-[0.28em] !text-[#e3e1da]/38">
                    {String(activeImageIndex + 1).padStart(2, "0")} / {String(CAROUSEL_IMAGES.length).padStart(2, "0")}
                  </p>
                  <h4 className={`${fonts.serif} !mb-0 !text-[2rem] !leading-[1.05] !tracking-normal !text-[#e3e1da] text-balance md:!text-[2.6rem]`}>
                    {activeLocation?.name || activeImage.alt}
                  </h4>
                  <p className="!mb-0 !mt-6 font-sans !text-[0.84rem] !leading-[2] !text-[#e3e1da]/52 text-pretty">
                    {activeLocation?.description || "A frame from the eastern coast archive."}
                  </p>
                </motion.aside>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
