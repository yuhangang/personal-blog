"use client";

import { useRef, useEffect, useState } from "react";
import { MotionValue, useScroll, useTransform, motion } from "framer-motion";
import styles from "./SloganScroll.module.scss";
import { AlternateTitle } from "./sloganConfig";

interface Props {
  title: string;
  alternateTitles: AlternateTitle[];
  desc: string;
  index: number;
  setActiveIndex: (i: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
  listProgress?: MotionValue<number>;
  totalCount?: number;
  itemRef?: (el: HTMLDivElement | null) => void;
}

export default function IdentitySloganItem({
  alternateTitles,
  desc,
  index,
  setActiveIndex,
  isFirst,
  isLast,
  listProgress,
  totalCount,
  itemRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // --- SCROLL PROGRESS ---
  // Standard Item Progress
  const { scrollYProgress: itemProgress } = useScroll({
    target: !isFirst ? ref : undefined,
    offset: ["start end", "end start"],
  });

  // Wrapper Progress (for Sticky First Item)
  const { scrollYProgress: wrapperProgress } = useScroll({
    target: isFirst ? wrapperRef : undefined,
    offset: ["start end", "end start"],
  });

  // Decide which progress to use
  // For isFirst, we MUST use wrapperProgress to track the entire track duration
  const progressToUse = isFirst
    ? wrapperProgress
    : isLast && listProgress
      ? listProgress
      : itemProgress;

  // --- TRANSFORM LOGIC ---
  const getVisibility = (v: number) => {
    const dist = Math.abs(v - 0.5);
    const safeZone = 0.2;
    if (dist <= safeZone) return 1;
    const normalizedFalloff = (dist - safeZone) / (0.5 - safeZone);
    return Math.max(0, 1 - normalizedFalloff);
  };

  const opacity = useTransform(progressToUse, (v) => {
    if (isFirst) {
      // [0.6, 0.8] -> [1, 0]
      if (v < 0.6) return 1;
      if (v > 0.8) return 0;
      return 1 - (v - 0.6) / 0.2;
    }
    if (isLast && listProgress) {
      const bufferStart = totalCount ? totalCount / (totalCount + 1) : 0.9;
      if (v >= bufferStart) {
        return 1 - (v - bufferStart) / (1 - bufferStart);
      }
      return 1;
    }
    // Default
    return getVisibility(v);
  });

  const rotateY = useTransform(progressToUse, (v) => {
    if (isFirst) {
      // [0.6, 0.9] -> [0, 10]
      if (v < 0.6) return 0;
      if (v > 0.9) return 10;
      return ((v - 0.6) / 0.3) * 10;
    }
    if (isLast && listProgress) return 0;

    // Default: [0.2, 0.5, 0.8] -> [10, 0, 10]
    if (v < 0.2) return 10;
    if (v > 0.8) return 10;
    if (v < 0.5) {
      // 0.2->0.5 map 10->0
      return 10 * (1 - (v - 0.2) / 0.3);
    } else {
      // 0.5->0.8 map 0->10
      return 10 * ((v - 0.5) / 0.3);
    }
  });

  const scale = useTransform(progressToUse, (v) => {
    if (isFirst) {
      // [0.6, 0.9] -> [1, 0.9]
      if (v < 0.6) return 1;
      if (v > 0.9) return 0.9;
      const p = (v - 0.6) / 0.3;
      return 1 - 0.1 * p;
    }
    if (isLast && listProgress) return 1;

    // Default: [0.2, 0.5, 0.8] -> [0.9, 1, 0.9]
    if (v < 0.2) return 0.9;
    if (v > 0.8) return 0.9;
    if (v < 0.5) {
      // 0.2->0.5 map 0.9->1
      const p = (v - 0.2) / 0.3;
      return 0.9 + 0.1 * p;
    } else {
      // 0.5->0.8 map 1->0.9
      const p = (v - 0.5) / 0.3;
      return 1 - 0.1 * p;
    }
  });

  const blurValue = useTransform(progressToUse, (v) => {
    if (isFirst) {
      // [0.6, 0.9] -> [0, 6]
      if (v < 0.6) return 0;
      if (v > 0.9) return 6;
      return ((v - 0.6) / 0.3) * 6;
    }
    if (isLast && listProgress) return 0;

    // Default
    return (1 - getVisibility(v)) * 6;
  });

  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  // Detect active
  useEffect(() => {
    // For isFirst, range [0.4, 0.6] covers the visible time
    // Standard items [0.3, 0.7] covers center
    const unsubscribe = progressToUse.on("change", (v) => {
      // Broadened range slightly to catch edge cases
      if (v > 0.35 && v < 0.65) {
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [progressToUse, index, setActiveIndex]);

  const content = (
    <motion.div
      className={styles.sloganContent}
      style={{ opacity, rotateY, scale, filter, perspective: 1000 }}
    >
      <span className={styles.sloganIndex}>
        ({String(index + 1).padStart(2, "0")})
      </span>

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
                  : "clamp(5rem, 13vw, 12rem)", // Larger than "Your" (4rem)
          }}
        >
          {currentTitleObj.text}
        </h2>
      </div>

      <p className={styles.sloganDesc}>{desc}</p>
    </motion.div>
  );

  // Render Wrapper if First
  if (isFirst) {
    return (
      <div
        ref={(el) => {
          wrapperRef.current = el;
          if (itemRef) itemRef(el);
        }}
        className={styles.identityTrack}
      >
        <div className={`${styles.sloganItem} ${styles.stickyFirst}`}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={(el) => {
        ref.current = el;
        if (itemRef) itemRef(el);
      }}
      className={styles.sloganItem}
    >
      {content}
    </div>
  );
}
