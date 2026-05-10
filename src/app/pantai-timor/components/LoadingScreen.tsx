"use client";

import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

export const LoadingScreen = () => {

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
      }}
      className={styles["loading-screen"]}
    >
      <div className={styles["loading-content"]}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles["loading-title-stack"]}
        >
           <h2 className={`${cormorant.className} ${styles["loading-text"]}`}>
            {PANTAI_TIMOR_COPY.loading.text}
          </h2>
        </motion.div>

        {/* Progress bar background */}
        <div className={styles["loading-progress-bg"]}>
          {/* Animated progress line */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "easeInOut" 
            }}
            className={styles["loading-progress-bar"]}
          />
        </div>
      </div>
      
      {/* Subtle background texture or glow */}
      <div className={styles["loading-glow"]}>
        <div className={styles["loading-glow-circle"]} />
      </div>
    </motion.div>
  );
};
