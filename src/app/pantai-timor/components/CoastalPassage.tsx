"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import styles from "../pantai-timor.module.scss";

/**
 * Full-bleed scroll passage for Besut & Setiu (Pantai Penarik):
 * opens from a letterboxed aperture on the coastal sand track, then
 * dissolves into the motion-blurred road beneath the palms.
 */
export const CoastalPassage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle cinema aperture opens into full-bleed as the section enters
  const insetY = useTransform(scrollYProgress, [0.04, 0.24], [3.5, 0]);
  const insetX = useTransform(scrollYProgress, [0.04, 0.24], [2, 0]);
  const apertureClip = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;

  // Frame 1: DSC01024.jpg — coastal track through headless palms
  const frame1Scale = useTransform(scrollYProgress, [0.08, 0.56], [1.09, 1.01]);
  const frame1Opacity = useTransform(scrollYProgress, [0.42, 0.58], [1, 0]);

  // Frame 2: DSC01061.jpg — passing motorbike along the sea road
  const frame2Scale = useTransform(scrollYProgress, [0.42, 0.88], [1.07, 1]);
  const frame2Opacity = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);

  if (reduceMotion) {
    return (
      <div className={styles["passage-static"]}>
        <div className={styles["passage-static-frame"]}>
          <Image
            src="https://cdn.yuhangang.com/pantai-timor/DSC01024.jpg"
            alt="Coastal track through coconut palms at Pantai Penarik, Setiu"
            fill
            className={styles["passage-image"]}
            sizes="100vw"
          />
          <div className={styles["passage-vignette"]} aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles["passage-section"]}>
      <div className={styles["passage-sticky"]}>
        <motion.div
          className={styles["passage-aperture"]}
          style={{ clipPath: apertureClip }}
        >
          <motion.div
            className={styles["passage-layer"]}
            style={{ opacity: frame2Opacity, scale: frame2Scale }}
          >
            <Image
              src="https://cdn.yuhangang.com/pantai-timor/DSC01061.jpg"
              alt="Coastal road under coconut palms at Pantai Penarik, Setiu"
              fill
              className={styles["passage-image"]}
              sizes="100vw"
            />
          </motion.div>

          <motion.div
            className={styles["passage-layer"]}
            style={{ opacity: frame1Opacity, scale: frame1Scale }}
          >
            <Image
              src="https://cdn.yuhangang.com/pantai-timor/DSC01024.jpg"
              alt="Coastal track through coconut palms at Pantai Penarik, Setiu"
              fill
              className={styles["passage-image"]}
              sizes="100vw"
            />
          </motion.div>

          <div className={styles["passage-vignette"]} aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
};
