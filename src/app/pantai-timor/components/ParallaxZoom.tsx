"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";
import styles from "../pantai-timor.module.scss";

export const ParallaxZoom = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealStart = 0.36;
  const revealEnd = 0.54;
  const image2SettleEnd = 0.82;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Image 1 (Foreground): DSC00465.JPG
  const image1Scale = useTransform(scrollYProgress, [0, revealEnd], [1, 3]);
  const image1Opacity = useTransform(scrollYProgress, [revealStart, revealEnd], [1, 0]);

  // Image 2 (Background): DSC00590.JPG
  const image2Scale = useTransform(scrollYProgress, [revealStart, image2SettleEnd], [1.02, 1.2]);
  const image2Opacity = useTransform(scrollYProgress, [revealStart, revealEnd], [0, 1]);

  return (
    <section
      ref={containerRef}
      className={styles["parallax-zoom-section"]}
    >
      <div className={styles["parallax-zoom-sticky"]}>
        {/* Image 2: Background layer — revealed as Image 1 fades */}
        <motion.div
          className={`${styles["parallax-zoom-image-wrapper"]} ${styles["secondary"]}`}
          style={{
            opacity: image2Opacity,
            scale: image2Scale,
            zIndex: 1,
            position: "absolute",
          }}
        >
          <Image
            src="https://cdn.yuhangang.com/pantai-timor/DSC00590.JPG"
            alt="Coastal Landscape - Detail"
            fill
            className={styles["parallax-zoom-image"]}
            priority
            sizes="100vw"
          />
        </motion.div>

        {/* Image 1: Foreground layer — zooms and fades out */}
        <motion.div
          className={styles["parallax-zoom-image-wrapper"]}
          style={{
            opacity: image1Opacity,
            scale: image1Scale,
            zIndex: 2,
            position: "absolute",
          }}
        >
          <Image
            src="https://cdn.yuhangang.com/pantai-timor/DSC00465.JPG"
            alt="Coastal Landscape - Wide"
            fill
            className={styles["parallax-zoom-image"]}
            sizes="100vw"
          />
        </motion.div>

        {/* Subtle vignette overlay */}
        <div className={styles["parallax-zoom-overlay"]} />
      </div>
    </section>
  );
};
