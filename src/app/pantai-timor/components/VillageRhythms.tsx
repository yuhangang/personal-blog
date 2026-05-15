"use client";

import { motion } from "framer-motion";
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

export const VillageRhythms = () => {
  return (
    <PantaiSection id="village" className={`${styles["village-section"]} ${pantaiLayout.gutters}`}>
      <PantaiFrame>
        <div className={styles["village-container"]}>
          {/* Split Image Background */}
          <div className={styles["village-split-bg"]}>
            <div className={styles["village-image-wrapper"]}>
              <Image 
                src="https://cdn.yuhangang.com/pantai-timor/DSC00645.JPG" 
                alt="Village Life" 
                fill 
                className={styles["village-image"]} 
                sizes="(min-width: 768px) 50vw, 100vw" 
              />
            </div>
            <div className={`${styles["village-image-wrapper"]} ${styles["border-top"]}`}>
              <Image 
                src="https://cdn.yuhangang.com/pantai-timor/DSC00788.JPG" 
                alt="Coastal House" 
                fill 
                className={styles["village-image"]} 
                sizes="(min-width: 768px) 50vw, 100vw" 
              />
            </div>
          </div>
          
          {/* Unified Overlay Content */}
          <div className={styles["village-overlay"]}>
            <div className={styles["village-content"]}>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className={styles["village-label"]}
              >
                {PANTAI_TIMOR_COPY.villageRhythms.label}
              </motion.h3>
              
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`${cormorant.className} ${styles["village-title"]}`}
              >
                {PANTAI_TIMOR_COPY.villageRhythms.title}
              </motion.h4>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className={styles["village-description"]}
              >
                {PANTAI_TIMOR_COPY.villageRhythms.content}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
                className={styles["village-divider"]}
              >
                <div className={styles["divider-line"]} />
                <div className={styles["divider-dot"]} />
                <div className={styles["divider-line"]} />
              </motion.div>
            </div>
          </div>
        </div>
      </PantaiFrame>
    </PantaiSection>
  );
};
