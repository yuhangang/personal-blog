"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

export const Memory = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const filterValue = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.7, 0.85, 1],
    [
      "blur(8px) brightness(0.1) saturate(0%)",
      "blur(4px) brightness(0.3) saturate(30%)",
      "blur(0px) brightness(1.2) saturate(150%)",
      "blur(0px) brightness(1.2) saturate(150%)",
      "blur(4px) brightness(0.3) saturate(30%)",
      "blur(8px) brightness(0.1) saturate(0%)"
    ]
  );

  const titleColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.7, 0.85, 1],
    ["#e3e1da", "#e3e1da", "#ff4d00", "#ff4d00", "#e3e1da", "#e3e1da"]
  );

  const titleFilter = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.7, 0.85, 1],
    [
      "blur(6px) brightness(0.1) saturate(0%)",
      "blur(3px) brightness(0.3) saturate(20%)",
      "blur(0px) brightness(1.2) saturate(120%)",
      "blur(0px) brightness(1.2) saturate(120%)",
      "blur(3px) brightness(0.3) saturate(20%)",
      "blur(6px) brightness(0.1) saturate(0%)"
    ]
  );

  const titleGlow = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.7, 0.85, 1],
    [
      "0px 0px 0px rgba(255, 77, 0, 0)",
      "0px 0px 0px rgba(255, 77, 0, 0)",
      "0px 0px 40px rgba(255, 77, 0, 0.6)",
      "0px 0px 40px rgba(255, 77, 0, 0.6)",
      "0px 0px 0px rgba(255, 77, 0, 0)",
      "0px 0px 0px rgba(255, 77, 0, 0)"
    ]
  );

  const textContentFilter = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.7, 0.85, 1],
    [
      "blur(6px) brightness(0.1) saturate(0%)",
      "blur(3px) brightness(0.3) saturate(20%)",
      "blur(0px) brightness(1) saturate(100%)",
      "blur(0px) brightness(1) saturate(100%)",
      "blur(3px) brightness(0.3) saturate(20%)",
      "blur(6px) brightness(0.1) saturate(0%)"
    ]
  );

  return (
    <PantaiSection 
      ref={containerRef}
      id="memory" 
      className={styles["memory-section"]}
    >
      <div className={`${styles["memory-sticky-container"]} ${pantaiLayout.gutters}`}>
        <PantaiFrame>
          <div className={styles["memory-grid"]}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 5.0, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className={styles["memory-image-container"]}
            >
              <motion.div 
                className={styles["memory-image-wrapper"]}
                style={{ filter: filterValue, willChange: "filter" }}
              >
                <Image
                  src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00679.JPG"
                  alt="A Fragmented Memory"
                  fill
                  className={styles["memory-image"]}
                  sizes="(min-width: 1024px) 45vw, calc(100vw - 48px)"
                />
              </motion.div>
              <div className={styles["memory-gradient-overlay"]} />
            </motion.div>

            <div className={styles["memory-content"]}>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{ filter: textContentFilter }}
                className={styles["memory-label"]}
              >
                {PANTAI_TIMOR_COPY.memory.label}
              </motion.h3>

              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 3.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{ color: titleColor, textShadow: titleGlow, filter: titleFilter }}
                className={`${cormorant.className} ${styles["memory-title"]}`}
              >
                {PANTAI_TIMOR_COPY.memory.title}
              </motion.h4>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 3.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{ filter: textContentFilter }}
                className={styles["memory-description"]}
              >
                {PANTAI_TIMOR_COPY.memory.content}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 4.0, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{ filter: textContentFilter }}
                className={styles["memory-divider"]}
              />
            </div>
          </div>
        </PantaiFrame>
      </div>
    </PantaiSection>
  );
};
