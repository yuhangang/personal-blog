"use client";

import { useRef, useEffect } from "react";
import { MotionValue, useScroll, useTransform, motion } from "framer-motion";
import styles from "./SloganScroll.module.scss";

interface Props {
  title: string;
  desc: string;
  index: number;
  setActiveIndex: (i: number) => void;
}

export default function SloganItem({
  title,
  desc,
  index,
  setActiveIndex,
  isLast,
  listProgress,
  totalCount,
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
  // For the last item, we can't rely on itemProgress because it stays sticky (static viewport pos).
  // So we use listProgress (parent scroll) to drive the fade out at the very end.
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
  // The list scroll progress goes 0 -> 1.
  // The buffer (100vh) represents the last portion of the total height.
  // Total Height approx = (TotalCount * 100vh) + 100vh (Buffer).
  // Buffer starts at: TotalCount / (TotalCount + 1).
  const bufferStart = totalCount ? totalCount / (totalCount + 1) : 0.9;

  // Opacity:
  // If Normal: use standard getVisibility curve.
  // If Last: Mix standard entry curve (0->0.5) with Sticky Exit curve (Buffer->1).
  const opacity = useTransform(progressToUse, (v) => {
    if (isLast && listProgress) {
      // Sticky Phase: If we are in the buffer zone, fade out.
      if (v >= bufferStart) {
        // Map [bufferStart, 1] -> [1, 0]
        const fadeProgress = (v - bufferStart) / (1 - bufferStart);
        return 1 - fadeProgress;
      }
      // Entry Phase: standard visibility logic (roughly)
      // Since listProgress is 0..1 globally, mapping it to item logic is hard.
      // Better: Use itemProgress for ENTRY, switch to listProgress for EXIT?
      // Actually, itemProgress works fine until it sticks.
      // So use itemProgress value, UNLESS listProgress > bufferStart?
      // Problem: itemProgress freezes.

      // Simplify: Just return 1 if not in buffer?
      // Sticky item enters at bottom, scrolls to center relative to viewport.
      // Once centered (sticky), it is fully visible.
      // So we just need to handle the FADE OUT.
      return 1;
    }

    // Normal Item Behavior
    const val = getVisibility(v);
    return val; // Allow fully transparent (0.0) instead of floor at 0.1
  });

  // Blur / Transform / Scale
  // For sticky item, we might want to disable these effects or keep them static
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

  // If Last: Render Motion Div as Root to apply opacity to WHOLE item (BG + Text)
  // Else: Render standard Div as root, Motion Div as content
  if (isLast) {
    return (
      <motion.div
        ref={ref}
        className={`${styles.sloganItem} ${styles.stickyItem}`}
        style={{
          opacity,
          // Enforce sticky behavior inline to rule out CSS class issues
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div className={styles.sloganContent}>
          <span className={styles.sloganIndex}>
            ({String(index + 1).padStart(2, "0")})
          </span>
          <h2 className={styles.sloganTitle}>{title}</h2>
          <p className={styles.sloganDesc}>{desc}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={styles.sloganItem}>
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
