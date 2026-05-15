"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

interface WordProps {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  index: number;
}

const Word = ({ children, progress, range, index }: WordProps) => {
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

export const CoastalAlmanac = forwardRef<HTMLElement, object>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"]
  });

  const { scrollYProgress: horizontalProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Calculate horizontal travel based on the 3:2 landscape image aspect ratio.
  // We use a CSS variable to handle different travel distances on mobile vs desktop.
  const x = useTransform(horizontalProgress, (p) => `calc(${p} * var(--almanac-x-travel))`);

  // Cross-fade logic for two images
  const opacity1 = useTransform(horizontalProgress, [0, 0.45, 0.55], [1, 1, 0]);
  const opacity2 = useTransform(horizontalProgress, [0, 0.45, 0.55, 1], [0, 0, 1, 1]);

  const words = PANTAI_TIMOR_COPY.almanac.content.split(/\s+/);
  
  useImperativeHandle(ref, () => sectionRef.current!);

  return (
    <PantaiSection 
      id="almanac" 
      ref={sectionRef} 
      className={`${styles["almanac-section"]} ${pantaiLayout.gutters}`}
    >
      <div className={styles["almanac-sticky-container"]}>
        <div className={styles["almanac-background-container"]}>
          <Image 
            src="https://cdn.yuhangang.com/pantai-timor/DSC07670_1.jpg" 
            alt="Background" 
            fill 
            className={styles["almanac-background-image"]} 
            sizes="100vw"
          />
          <div className={styles["almanac-background-overlay"]} />
        </div>

        <PantaiFrame className={styles["almanac-frame"]} variant="narrow">
          <div className={styles["almanac-image-container"]}>
            <motion.div 
              className={styles["almanac-image-wrapper"]}
              style={{ x, opacity: opacity1 }}
            >
              <Image 
                src="https://cdn.yuhangang.com/pantai-timor/DSC07763_1.jpg" 
                alt="Fishing Boat" 
                fill 
                className={styles["almanac-image"]} 
                sizes="(min-width: 768px) 70vh, 150vh" 
                priority
              />
            </motion.div>

            <motion.div 
              className={styles["almanac-image-wrapper"]}
              style={{ x, opacity: opacity2 }}
            >
              <Image 
                src="https://cdn.yuhangang.com/pantai-timor/DSC00590.JPG" 
                alt="Coastal Horizon" 
                fill 
                className={styles["almanac-image"]} 
                sizes="(min-width: 768px) 70vh, 150vh" 
              />
            </motion.div>

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
                    const wordCount = words.length;
                    const start = i / wordCount;
                    const end = Math.min(start + 0.15, 1);
                    return (
                      <Word 
                        key={i} 
                        progress={scrollYProgress} 
                        range={[start, end]} 
                        index={i}
                      >
                        {word}
                      </Word>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </PantaiFrame>
      </div>
    </PantaiSection>
  );
});

CoastalAlmanac.displayName = "CoastalAlmanac";
