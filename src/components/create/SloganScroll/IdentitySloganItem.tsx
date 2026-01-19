"use client";

import { useRef, useEffect, useState } from "react";
import { MotionValue, useScroll, useTransform, motion } from "framer-motion";
import styles from "./SloganScroll.module.scss";
import { AlternateTitle } from "./sloganConfig";

interface Props {
  title: string;
  alternateTitles: AlternateTitle[]; // Required for this component
  desc: string;
  index: number;
  setActiveIndex: (i: number) => void;
  isLast?: boolean;
  listProgress?: MotionValue<number>;
  totalCount?: number;
}

export default function IdentitySloganItem({
  // title prop ignored as "Your" is static
  alternateTitles,
  desc,
  index,
  setActiveIndex,
  isLast,
  listProgress,
  totalCount,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Title Cycling Logic
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    // Uniform Rotation: Cycle continuously
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % alternateTitles.length);
    }, 100); // 0.1s hyper-fast glitch speed

    return () => clearInterval(interval);
  }, [alternateTitles]);

  // Use current alternate title
  const currentTitleObj = alternateTitles[titleIndex];

  // Standard Scroll Progress (Item-relative) - Used for non-sticky items
  const { scrollYProgress: itemProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Decide which progress to use
  const progressToUse = isLast && listProgress ? listProgress : itemProgress;

  // --- STANDARD ITEM LOGIC ---
  const getVisibility = (v: number) => {
    const dist = Math.abs(v - 0.5);
    const safeZone = 0.2;
    if (dist <= safeZone) return 1;
    const normalizedFalloff = (dist - safeZone) / (0.5 - safeZone);
    return Math.max(0, 1 - normalizedFalloff);
  };

  // --- STICKY ITEM LOGIC ---
  const bufferStart = totalCount ? totalCount / (totalCount + 1) : 0.9;

  // Opacity:
  const opacity = useTransform(progressToUse, (v) => {
    if (isLast && listProgress) {
      // Sticky Phase: If we are in the buffer zone, fade out.
      if (v >= bufferStart) {
        // Map [bufferStart, 1] -> [1, 0]
        const fadeProgress = (v - bufferStart) / (1 - bufferStart);
        return 1 - fadeProgress;
      }
      return 1;
    }

    // Normal Item Behavior
    const val = getVisibility(v);
    return val;
  });

  // Blur / Transform / Scale
  const rotateY = useTransform(itemProgress, [0.2, 0.5, 0.8], [10, 0, 10]);
  const scale = useTransform(itemProgress, [0.2, 0.5, 0.8], [0.9, 1, 0.9]);

  // Blur only for normal items
  const blurValue = useTransform(itemProgress, (v) => {
    if (isLast) return 0; // Keep sharp when sticky
    const val = getVisibility(v);
    return (1 - val) * 6;
  });
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  // Detect active
  useEffect(() => {
    const unsubscribe = itemProgress.on("change", (v) => {
      if (v > 0.3 && v < 0.7) {
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [itemProgress, index, setActiveIndex]);

  return (
    <div ref={ref} className={styles.sloganItem}>
      <motion.div
        className={styles.sloganContent}
        style={{ opacity, rotateY, scale, filter, perspective: 1000 }}
      >
        <span className={styles.sloganIndex}>
          ({String(index + 1).padStart(2, "0")})
        </span>

        {/* Animated Title Switcher (Reserved height to prevent jumping) */}
        {/* Animated Title Switcher */}
        <div className={styles.identityWrapper}>
          {/* Static "Your" */}
          <h2 className={`${styles.sloganTitle} ${styles.identityStatic}`}>
            Your
          </h2>

          {/* Dynamic "Identity" */}
          <h2
            className={`${styles.sloganTitle} ${styles.identityDynamic}`}
            style={{
              color: currentTitleObj.color,
              fontFamily: currentTitleObj.fontFamily,
              lineHeight: currentTitleObj.lineHeight || "1.0",
              fontWeight: currentTitleObj.lang === "jv" ? 700 : 600,
              direction: currentTitleObj.lang === "jv" ? "rtl" : "ltr",
              fontSize:
                currentTitleObj.lang === "ta"
                  ? "clamp(4.5rem, 9vw, 8rem)"
                  : currentTitleObj.lang === "jv"
                    ? "clamp(4.5rem, 10vw, 9rem)"
                    : "clamp(5.5rem, 13vw, 12rem)", // Increased base size for mobile impact
            }}
          >
            {currentTitleObj.text}
          </h2>
        </div>

        <p className={styles.sloganDesc}>{desc}</p>
      </motion.div>
    </div>
  );
}
