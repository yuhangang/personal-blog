"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Cormorant_Garamond, Noto_Serif_TC, Amiri } from "next/font/google";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import React from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

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
    <div className={styles["title-viewport"]}>
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
        className={`${cormorant.className} ${styles["main-hero-title"]}`}
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
        className={styles["secondary-title-wrapper"]}
      >
         <span className={`${notoSerifTC.className} ${styles["chinese-title"]}`}>{PANTAI_TIMOR_COPY.animatedTitle.chinese}</span>
         <span className={styles["title-dot"]}></span>
         <span className={`${amiri.className} ${styles["jawi-title"]}`} dir="rtl">{PANTAI_TIMOR_COPY.animatedTitle.jawi}</span>
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
        className={styles["subtitle-text"]}
      >
        {PANTAI_TIMOR_COPY.animatedTitle.subtitle}
      </motion.p>
    </div>
  );
};
