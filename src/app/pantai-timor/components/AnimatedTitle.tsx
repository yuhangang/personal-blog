"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Cormorant_Garamond, Noto_Serif_TC, Amiri } from "next/font/google";
import React from "react";

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
  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden h-[100svh]">
      <motion.h1 
        style={{ 
          scale: titleScale,
          x: titleX,
          y: finalTitleY,
          left: titleLeft,
          top: titleTop,
          opacity: titleOpacity,
          filter: finalTitleBlur,
          letterSpacing: titleLetterSpacing,
          position: "fixed",
          transformOrigin: "center center"
        }}
        className={`${cormorant.className} !mb-0 !text-[clamp(2.1rem,13vw,11rem)] !leading-none !tracking-tight text-center !text-[#f2f0ea] whitespace-nowrap font-normal`}
      >
        PANTAI TIMOR
      </motion.h1>

      <motion.div 
        style={{ 
          x: titleX,
          y: useTransform(finalTitleY, (y: string) => `calc(${y} - clamp(3.8rem, 12vw, 10rem))`),
          left: titleLeft,
          top: titleTop,
          scale: titleScale,
          opacity: secondaryHeroOpacity,
          filter: finalTitleBlur,
          position: "fixed",
          transformOrigin: "center center"
        }}
        className="flex items-center gap-8 md:gap-14 text-[#e3e1da]/40 pointer-events-none whitespace-nowrap w-full justify-center"
      >
         <span className={`${notoSerifTC.className} text-3xl md:text-6xl tracking-[0.2em] md:tracking-[0.4em] ml-[0.2em] md:ml-[0.4em]`}>東海岸</span>
         <span className="w-1.5 h-1.5 rounded-full bg-[#e3e1da]/20"></span>
         <span className={`${amiri.className} text-3xl md:text-6xl`} dir="rtl">ڤنتاي تيمور</span>
      </motion.div>

      <motion.p 
        style={{ 
          x: titleX,
          y: useTransform(finalTitleY, (y: string) => `calc(${y} + clamp(4.5rem, 14vw, 11.5rem))`),
          left: titleLeft,
          top: titleTop,
          scale: titleScale,
          opacity: secondaryHeroOpacity,
          filter: finalTitleBlur,
          position: "fixed",
          transformOrigin: "center center"
        }}
        className="!mb-0 max-w-[18rem] text-center font-sans !text-[0.92rem] font-bold uppercase !leading-[1.5] !tracking-[0.1em] !text-[#e3e1da]/50 pointer-events-none md:max-w-none md:!text-[1.5rem] md:!tracking-[0.25em] text-balance w-full"
      >
        A PHOTOGRAPHIC JOURNEY<br />TO THE EASTERN ENCLAVE
      </motion.p>
    </div>
  );
};
