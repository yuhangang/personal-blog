"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React, { useRef } from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

interface CoastalAlmanacProps {
  almanacRef: React.RefObject<HTMLElement | null>;
}

const Word = ({ children, progress, range, index }: { children: React.ReactNode, progress: MotionValue<number>, range: [number, number], index: number }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  // Wavy pattern: vertical offset that follows a sine wave staggered by word index
  const y = useTransform(progress, range, [24 + Math.sin(index * 0.4) * 12, 0]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
  
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

const Ripple = () => {
  return (
    <div className={styles["ripple-container"]}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [0.5, 1.5], 
            opacity: [0, 0.5, 0] 
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 3.3,
            ease: "easeInOut"
          }}
          className={styles["ripple-circle"]}
        />
      ))}
    </div>
  );
};

export const CoastalAlmanac = ({ almanacRef }: CoastalAlmanacProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"]
  });

  const words = PANTAI_TIMOR_COPY.almanac.content.split(/\s+/);

  return (
    <PantaiSection id="almanac" ref={almanacRef} className={`${styles["almanac-section"]} ${pantaiLayout.gutters}`}>
      <PantaiFrame className={styles["almanac-frame"]} variant="narrow">
        <div 
          className={styles["almanac-image-container"]}
        >
          <div className={styles["almanac-image-wrapper"]}>
            <Image 
              src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg" 
              alt="Fishing Boat" 
              fill 
              className={styles["almanac-image"]} 
              sizes="(min-width: 768px) 90vw, calc(100vw - 48px)" 
            />
          </div>

          <Ripple />
          
          {/* Overlay Content */}
          <div className={styles["almanac-overlay"]}>
            <div className={styles["almanac-content-wrapper"]}>
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className={styles["almanac-label"]}
              >
                {PANTAI_TIMOR_COPY.almanac.label}
              </motion.h3>
              
              <div 
                ref={containerRef}
                className={`${libreCaslon.className} ${styles["almanac-text"]}`}
              >
                {words.map((word, i) => {
                  // Staggered range to create a wave-like progression
                  const wordCount = words.length;
                  const start = i / wordCount;
                  const end = start + 0.15; // Slightly longer overlap for smoother wavy reveal
                  return (
                    <Word key={i} progress={scrollYProgress} range={[start, Math.min(end, 1)]} index={i}>
                      {word}
                    </Word>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </PantaiFrame>
    </PantaiSection>
  );
};
