"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./SloganScroll.module.scss";
import { SLOGAN_ITEMS } from "./sloganConfig";

interface SloganTextDisplayProps {
  activeIndex: number;
}

export default function SloganTextDisplay({
  activeIndex,
}: SloganTextDisplayProps) {
  const item = SLOGAN_ITEMS[activeIndex];

  return (
    <div className={styles.textDisplayContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={styles.sloganContent}
        >
          <span className={styles.sloganIndex}>
            {String(activeIndex + 1).padStart(2, "0")} / {SLOGAN_ITEMS.length}
          </span>
          <h2 className={styles.sloganTitle}>{item.title}</h2>
          <p className={styles.sloganDesc}>{item.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
