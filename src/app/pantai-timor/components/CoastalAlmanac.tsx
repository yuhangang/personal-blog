"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

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
  const sectionRef = useRef<HTMLElement>(null);

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
          </div>
        </PantaiFrame>
      </div>
    </PantaiSection>
  );
});

CoastalAlmanac.displayName = "CoastalAlmanac";
