"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Cormorant_Garamond, Noto_Serif_TC, Amiri } from "next/font/google";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import React from "react";
import { PANTAI_TIMOR_COPY } from "../config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

interface AnimatedTitleProps {
  titleScale: MotionValue<number>;
  titleX: MotionValue<string>;
  finalTitleY: MotionValue<string>;
  titleLeft: MotionValue<number>;
  titleTop: MotionValue<number>;
  titleOpacity: MotionValue<number>;
  finalTitleBlur: MotionValue<string>;
  titleLetterSpacing: MotionValue<string>;
  secondaryHeroOpacity: MotionValue<number>;
}

export const AnimatedTitle = ({
  titleScale,
  titleX,
  finalTitleY,
  titleLeft,
  titleTop,
  titleOpacity,
  finalTitleBlur,
  titleLetterSpacing,
  secondaryHeroOpacity,
}: AnimatedTitleProps) => {
  const { lenis } = useLenis();

  const handleTitleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden h-[100svh]">
      <motion.h1 
        onClick={handleTitleClick}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.8 }}
        style={{ 
          scale: titleScale,
          x: titleX,
          y: finalTitleY,
          left: titleLeft,
          top: titleTop,
          opacity: titleOpacity,
          filter: finalTitleBlur,
          letterSpacing: titleLetterSpacing,
          position: "absolute",
         transformOrigin: "center center"
        }}
        className={`${cormorant.className} !mb-0 !text-[clamp(2.1rem,13vw,11rem)] !leading-none !tracking-tight text-center !text-[#f2f0ea] whitespace-nowrap font-normal pointer-events-auto cursor-pointer`}
      >
        {PANTAI_TIMOR_COPY.animatedTitle.title}
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        style={{ 
          x: titleX,
          y: useTransform(finalTitleY, (y: string) => `calc(${y} - clamp(3.8rem, 12vw, 10rem))`),
          left: titleLeft,
          top: titleTop,
          scale: titleScale,
          opacity: secondaryHeroOpacity,
          filter: finalTitleBlur,
          position: "absolute",
          transformOrigin: "center center"
        }}
        className="flex items-center gap-8 md:gap-14 text-[#e3e1da]/40 pointer-events-none whitespace-nowrap w-full justify-center"
      >
         <span className={`${notoSerifTC.className} text-3xl md:text-6xl tracking-[0.2em] md:tracking-[0.4em] ml-[0.2em] md:ml-[0.4em]`}>{PANTAI_TIMOR_COPY.animatedTitle.chinese}</span>
         <span className="w-1.5 h-1.5 rounded-full bg-[#e3e1da]/20"></span>
         <span className={`${amiri.className} text-3xl md:text-6xl`} dir="rtl">{PANTAI_TIMOR_COPY.animatedTitle.jawi}</span>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        style={{ 
          x: titleX,
          y: useTransform(finalTitleY, (y: string) => `calc(${y} + clamp(4.5rem, 14vw, 11.5rem))`),
          left: titleLeft,
          top: titleTop,
          scale: titleScale,
          opacity: secondaryHeroOpacity,
          filter: finalTitleBlur,
          position: "absolute",
         transformOrigin: "center center"
        }}
        className="!mb-0 max-w-[18rem] text-center font-sans !text-[0.92rem] font-bold uppercase !leading-[1.5] !tracking-[0.1em] !text-[#e3e1da]/50 pointer-events-none md:max-w-none md:!text-[1.5rem] md:!tracking-[0.25em] text-balance w-full"
      >
        {PANTAI_TIMOR_COPY.animatedTitle.subtitle}
      </motion.p>
    </div>
  );
};
