"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
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
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Curving & Focus Effect:
  // We use a wider "plateau" at the center [0.35, 0.65] where the item is fully clear.
  // Rotate can stay dynamic to keep "wheel" feel, but maybe wider peak.
  const rotateY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [10, 0, 10]);
  const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.9, 1, 0.9]);

  // Logarithmic visibility logic to increase "clear" area
  // Center is 0.5. We want a wide clear zone, then fast falloff.
  // Logic:
  // 1. Calculate distance from center (abs(v - 0.5))
  // 2. Define a "safe zone" (e.g., +/- 0.15 = 0.35 to 0.65) where op=1, blur=0
  // 3. Outside safe zone, use log to fall off.

  // Helper to calculate visibility factor (0 to 1)
  const getVisibility = (v: number) => {
    const dist = Math.abs(v - 0.5);
    const safeZone = 0.2; // Extended safe zone (was 0.15) for better focus retention

    if (dist <= safeZone) return 1;

    // Calculate how far we are outside the safe zone
    // Range: 0 to ~0.3 (since 0.5 - 0.2 = 0.3)
    const falloffDist = dist - safeZone;
    const maxFalloff = 0.5 - safeZone;

    // Normalize to 0-1
    const normalizedFalloff = falloffDist / maxFalloff;

    // Logarithmic-like decay curve
    // We want it to stay visible longer, then drop.
    // Using cos curve for smooth ease-in-out feel or a custom log-based curve
    // "use log to reduce blur" -> Interpret as: Blur stays low, then increases.
    // Visually, clarity should be: 1 -> 0
    // Try: 1 - log10(normalizedFalloff * 9 + 1)
    // If norm=0 -> log10(1)=0 -> 1.
    // If norm=1 -> log10(10)=1 -> 0.
    // This curve drops fast initially? No, log grows fast initially.
    // So 1 - log drops fast. That might increase blur quickly.

    // User wants to REDUCE blur.
    // Let's invert: Clarity = 1 - (normalizedFalloff ^ 2) (Concave down) -> stays 1 longer.
    // Let's Try: Clarity = 1 / (1 + normalizedFalloff * 5) ?

    // Let's use the explicit "log" request:
    // Blur = log(normalizedFalloff + 1). (Grows)
    // We want LOW blur.
    // Let's use a gentle exponential decay for visibility?

    // Let's trust a simple ease-in-out or just making the safeZone bigger + smooth transition.
    // But to satisfy "log":
    // blur = ln(normalizedFalloff * e + 1) scaled?

    // Let's go with a Gaussian-like bell curve for visibility, it feels most natural.
    // But specific "log":
    // let blur = Math.log(normalizedFalloff * 10 + 1) / Math.log(11);

    // Actually, let's keep the existing structure but tweak the curve to be "gentler"
    // using a log scale for the blur amount specifically.

    return Math.max(0, 1 - normalizedFalloff); // Linear base for now, handled in opacity/blur transforms
  };

  const opacity = useTransform(scrollYProgress, (v) => {
    const val = getVisibility(v);
    return 0.1 + val * 0.9;
  });

  const blurValue = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - 0.5);
    const safeZone = 0.2;

    if (dist <= safeZone) return 0;

    // Outside safe zone.
    const excess = dist - safeZone; // 0 to 0.3
    const maxExcess = 0.3;
    const ratio = excess / maxExcess; // 0 to 1

    // Logarithmic blur increase:
    // We want blur to increase SLOWLY at first (so text stays readable near center)
    // x^2 or x^3 grows slowly at first.
    // log(x) grows FAST at first.
    // Maybe user meant "Use Log" to mean "Don't lineary increase blur, make it flattened"?
    // OR "Use Log" as in "Logarithmic scale" (usually implies sensitivity to small changes).

    // Let's implement a curve that is gentle.
    // blur = log(ratio + 1) * factor
    // ratio 0 -> log(1)=0.
    // ratio 1 -> log(2)=0.69.
    // This is actually convex (bulges out), so it blurs INSTANTLY.

    // If we want "reduce blur", we want concave (stays low).
    // ratio^2 stands low.

    // BUT, let's look at the instruction: "use log to reduce the blur"
    // I will use a custom curve that feels "logarithmic" in the sense of sound/perception (db),
    // but inverted to prioritize clarity.

    // Let's simply reduce the max blur and use a smoother curve.
    // New logic:
    // blur = 4 * ratio^2 (Parabolic - very flat start)

    // If I MUST use log:
    // blur = 10 * log10(ratio + 1) -> This is fast blur.
    // Maybe they meant "Exponential decay of clarity" ~ "Logarithmic increase of blur"? NO.

    // I will assume "Log" was a loose term for "non-linear, gentle".
    // I'll use a power curve (ratio ^ 1.5) which is gentle.

    return Math.pow(ratio, 1.5) * 6; // Max 6px blur, growing slowly
  });

  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  // Detect active
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v > 0.3 && v < 0.7) {
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, index, setActiveIndex]);

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
