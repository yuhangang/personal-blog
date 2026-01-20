"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import styles from "./ServiceIntro.module.scss";

export default function ServiceIntro() {
  const sectionRef = useRef<HTMLElement>(null!);

  // Track scroll progress of the entire section relative to viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Calculate Opacity: Fade in near center, fade out near exits
  // 0.2 -> 0.4 (Fade In) | 0.4 -> 0.6 (Hold) | 0.6 -> 0.8 (Fade Out)
  const opacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [0, 1, 1, 0],
  );

  // Parallax Y: Move content slightly slower than scroll (or counter-move)
  // Mapping scroll progress to a vertical shift
  // Reduced range to prevent content from shifting out of the viewport
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.stickyWrapper}>
        <motion.div style={{ opacity, y }} className={styles.content}>
          <p className={styles.label}>Web Development Services</p>
          <h2 className={styles.headline}>
            Crafting Digital
            <br />
            <span className={styles.accent}>Experiences</span>
          </h2>
          <p className={styles.description}>
            Custom websites • Mobile App Development • Web applications •
            E-commerce solutions
          </p>
          <p className={styles.subText}>
            From concept to code, I build immersive, high-performance web
            solutions tailored to your unique identity. Let&apos;s turn your
            vision into a digital reality.
          </p>

          <Link href="#projects" className={styles.ctaButton}>
            See Selected Works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
