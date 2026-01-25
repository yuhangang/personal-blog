"use client";

import { useRef, useEffect } from "react";
import { MotionValue, useScroll, useTransform, motion } from "framer-motion";
import styles from "./SloganScroll.module.scss";

interface Props {
  title: string;
  desc: string;
  index: number;
  setActiveIndex: (i: number) => void;
  itemRef?: (el: HTMLDivElement | null) => void;
}

export default function SloganItem({
  title,
  desc,
  index,
  setActiveIndex,
  isLast,
  listProgress,
  totalCount,
  itemRef,
}: Props & {
  isLast?: boolean;
  listProgress?: MotionValue<number>;
  totalCount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

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
    <div
      ref={(el) => {
        ref.current = el;
        if (itemRef) itemRef(el);
      }}
      className={styles.sloganItem}
    >
      <motion.div
        className={styles.sloganContent}
        style={{ opacity, rotateY, scale, filter, perspective: 1000 }}
      >
        <span className={styles.sloganIndex}>
          ({String(index + 1).padStart(2, "0")})
        </span>

        <h2 className={styles.sloganTitle}>{title}</h2>

        <p className={styles.sloganDesc}>{desc}</p>
      </motion.div>
    </div>
  );
}
