"use client";

import { motion } from "framer-motion";
import styles from "./SectionDivider.module.scss";

export default function SectionDivider() {
  return (
    <div className={styles.dividerContainer}>
      <svg
        width="100%"
        height="100"
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        preserveAspectRatio="none"
      >
        <motion.path
          d="M-100 50 C 200 100 400 0 600 50 S 1000 100 1540 50"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        {/* Secondary line for more "curly" feel */}
        <motion.path
          d="M-100 60 C 200 110 400 10 600 60 S 1000 110 1540 60"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  );
}
