"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

export const Memory = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const filterValue = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.8, 0.9, 1],
    [
      "blur(8px) brightness(0.1) saturate(0%)",
      "blur(4px) brightness(0.3) saturate(30%)",
      "blur(0px) brightness(1.2) saturate(150%)",
      "blur(0px) brightness(1.2) saturate(150%)",
      "blur(4px) brightness(0.3) saturate(30%)",
      "blur(8px) brightness(0.1) saturate(0%)"
    ]
  );

  // Scale up slightly when blurred to prevent "blur offset" edge-bleed
  const scaleValue = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1.1, 1, 1, 1.1]
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
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className={styles["memory-image-container"]}
            >
              <motion.div 
                className={styles["memory-image-wrapper"]}
                style={{ 
                  filter: filterValue, 
                  scale: scaleValue,
                  willChange: "filter, transform" 
                }}
              >
                <Image
                  src="https://cdn.yuhangang.com/pantai-timor/DSC00679.JPG"
                  alt="A Fragmented Memory"
                  fill
                  className={styles["memory-image"]}
                  sizes="(min-width: 1024px) 72vh, calc(100vw - 32px)"
                />
              </motion.div>
              <div className={styles["memory-gradient-overlay"]} />
            </motion.div>
          </div>
        </PantaiFrame>
      </div>
    </PantaiSection>
  );
};
