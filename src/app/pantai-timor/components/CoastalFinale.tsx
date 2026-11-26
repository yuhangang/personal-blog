"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { StoryPlate } from "../story";
import styles from "../pantai-timor.module.scss";

interface CoastalFinaleProps {
  plate: StoryPlate;
  onOpen: (index: number) => void;
}

/**
 * Full-bleed widescreen closing beat for the final plate (Kuala Dungun):
 * the 16:9 dusk horizon gently pulls back and settles into the dark ground,
 * while remaining clickable to open the viewer at its story index.
 */
export const CoastalFinale = ({ plate, onOpen }: CoastalFinaleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const frameScale = useTransform(scrollYProgress, [0.1, 0.65], [0.94, 1]);
  const imageScale = useTransform(scrollYProgress, [0.1, 0.95], [1.08, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0.05, 0.32], [0.45, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.48, 0.72], [0, 1]);

  if (reduceMotion) {
    return (
      <figure className={styles["finale-static"]}>
        <button
          type="button"
          aria-haspopup="dialog"
          className={styles["finale-button"]}
          onClick={() => onOpen(plate.index)}
        >
          <span className={styles["finale-media"]}>
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              className={styles["finale-image"]}
              sizes="100vw"
            />
            <span className={styles["finale-vignette"]} aria-hidden="true" />
          </span>
        </button>
        <figcaption className={styles["finale-caption-static"]}>{plate.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure ref={containerRef} className={styles["finale-section"]}>
      <div className={styles["finale-sticky"]}>
        <motion.div
          className={styles["finale-stage"]}
          style={{ scale: frameScale, opacity: imageOpacity }}
        >
          <button
            type="button"
            aria-haspopup="dialog"
            className={styles["finale-button"]}
            onClick={() => onOpen(plate.index)}
          >
            <motion.span
              className={styles["finale-media"]}
              style={{ scale: imageScale }}
            >
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                className={styles["finale-image"]}
                sizes="100vw"
              />
            </motion.span>
            <span className={styles["finale-vignette"]} aria-hidden="true" />
          </button>

          <motion.figcaption
            className={styles["finale-caption"]}
            style={{ opacity: captionOpacity }}
          >
            {plate.caption}
          </motion.figcaption>
        </motion.div>
      </div>
    </figure>
  );
};
