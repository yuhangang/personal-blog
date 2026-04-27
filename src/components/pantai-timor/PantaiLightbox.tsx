"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import type { WheelEvent } from "react";
import { CAROUSEL_IMAGES } from "./constants";
import type { CoastalLocation } from "@/app/pantai-timor/data";
import type { PantaiTimorFontClasses, PantaiTimorImage } from "./types";

interface PantaiLightboxProps {
  activeImage: PantaiTimorImage | null;
  activeImageIndex: number | null;
  activeLocation: CoastalLocation | null;
  fonts: PantaiTimorFontClasses;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onOverlayWheel: (event: WheelEvent<HTMLDivElement>) => void;
}

export function PantaiLightbox({
  activeImage,
  activeImageIndex,
  activeLocation,
  fonts,
  onClose,
  onNavigate,
  onOverlayWheel,
}: PantaiLightboxProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {activeImageIndex !== null && activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex h-[100svh] w-full items-center justify-center overflow-hidden bg-[#10110F]/92 backdrop-blur-[26px]"
          onClick={onClose}
          onWheelCapture={onOverlayWheel}
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(227,225,218,0.08),transparent_38%),linear-gradient(180deg,rgba(16,17,15,0.45),rgba(16,17,15,0.95))]" />
          <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-[#e3e1da]/10 bg-[#10110F]/68 !px-4 !py-4 backdrop-blur-xl md:!px-8" onClick={(event) => event.stopPropagation()}>
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
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e3e1da]/16 bg-[#e3e1da]/5 text-[#e3e1da] transition-colors duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50"
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

          <motion.div
            key={activeImageIndex}
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full items-center justify-center pointer-events-none !px-4 !pb-28 !pt-24 md:!px-28 md:!pb-14 md:!pt-28"
          >
            <div className="grid w-full max-w-[92rem] grid-cols-1 items-end gap-7 pointer-events-auto lg:grid-cols-[minmax(0,1fr)_20rem]" onClick={(event) => event.stopPropagation()}>
              <div className="relative flex min-h-0 w-full items-center justify-center border border-[#e3e1da]/10 bg-[#151612]/60 !p-2 shadow-[0_34px_110px_rgba(0,0,0,0.62)]">
                <img src={activeImage.src} alt={activeImage.alt} className="max-h-[58svh] w-auto max-w-full object-contain md:max-h-[74svh]" />
              </div>

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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
