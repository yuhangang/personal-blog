"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React, { useRef } from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const Word = ({ children, progress, range, index }: { children: React.ReactNode, progress: MotionValue<number>, range: [number, number], index: number }) => {
  // Reverse effect: fade OUT as scroll progress increases
  const opacity = useTransform(progress, range, [1, 0]);
  // Wavy dissolve: words sink and blur as they fade out
  const y = useTransform(progress, range, [0, 24 + Math.sin(index * 0.4) * 12]);
  const blur = useTransform(progress, range, ["blur(0px)", "blur(12px)"]);
  
  return (
    <motion.span 
      suppressHydrationWarning
      style={{ 
        opacity, 
        y, 
        filter: blur,
      }} 
      className={styles["almanac-word"]}
    >
      {children}
    </motion.span>
  );
};

export const QuoteSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Trigger as the section moves into the upper half of the viewport
    offset: ["start 0.4", "start 0"]
  });

  const words = PANTAI_TIMOR_COPY.quote.text.split(/\s+/);

  return (
    <section className={styles["quote-section"]}>
      {/* Background Image */}
      <div className={styles["quote-bg-container"]}>
        <Image
          src="https://cdn.yuhangang.com/pantai-timor/DSC01024.jpg"
          alt="Coastal sunset background"
          fill
          className={styles["quote-bg-image"]}
          priority
        />
        {/* Dark Overlay */}
        <div className={styles["quote-dark-overlay"]} />
      </div>

      {/* Wavy gradient background */}
      <div className={styles["quote-pulse-overlay"]}>
        <div className={styles["pulse-circle"]} />
      </div>

      <PantaiFrame variant="narrow" className={styles["quote-content-frame"]}>
        <span className={styles["quote-mark"]}>&ldquo;</span>
        
        <div 
          ref={containerRef}
          className={`${libreCaslon.className} ${styles["quote-text"]}`}
        >
          {words.map((word, i) => {
            const wordCount = words.length;
            // Progressive reveal: each word starts its transition slightly after the previous one
            const start = (i / wordCount) * 0.7; 
            const end = start + 0.3;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, Math.min(end, 1)]} index={i}>
                {word}
              </Word>
            );
          })}
        </div>

        <cite className={styles["quote-cite"]}>
          {PANTAI_TIMOR_COPY.quote.author}
        </cite>
      </PantaiFrame>
    </section>
  );
};
