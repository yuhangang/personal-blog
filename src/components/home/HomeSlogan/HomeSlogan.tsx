"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./HomeSlogan.module.scss";
import SloganVisuals from "@/components/create/SloganScroll/SloganVisuals";
import { SLOGAN_ITEMS } from "@/components/create/SloganScroll/sloganConfig";

export default function HomeSlogan() {
  const containerRef = useRef<HTMLElement>(null);
  const [titleIndex, setTitleIndex] = useState(0);

  // Identity Data (First Item)
  const identityItem = SLOGAN_ITEMS[0];
  const alternateTitles = useMemo(
    () => identityItem.alternateTitles || [],
    [identityItem],
  );

  // Cycle Titles
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % alternateTitles.length);
    }, 100);
    return () => clearInterval(interval);
  }, [alternateTitles]);

  const currentTitleObj = alternateTitles[titleIndex] || alternateTitles[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Subtle parallax for visuals
  const yVisuals = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.stickyContainer}>
        {/* Background Visuals - Single Active State */}
        <motion.div className={styles.visualWrapper} style={{ y: yVisuals }}>
          <SloganVisuals activeIndex={0} />
        </motion.div>

        <div className={styles.contentWrapper}>
          {/* Identity Slogan Display */}
          <div className={styles.identityWrapper}>
            <h2 className={styles.identityStatic}>Your</h2>

            <h2
              className={styles.identityDynamic}
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
                      : "clamp(5rem, 13vw, 12rem)", // Matched strict mobile sizing
              }}
            >
              {currentTitleObj.text}
            </h2>
          </div>

          {/* Service Brief */}
          <p className={styles.identityDesc}>{identityItem.desc}</p>

          <Link href="/create" className={styles.exploreButton}>
            Explore Creation
          </Link>
        </div>
      </div>
    </section>
  );
}
