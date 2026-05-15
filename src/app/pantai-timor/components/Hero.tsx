"use client";

import { motion, MotionValue } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import React from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface HeroProps {
  heroRef: React.RefObject<HTMLElement | null>;
  heroOpacity: MotionValue<number>;
  heroImageY: MotionValue<number>;
  heroImageScale: MotionValue<number>;
  heroImageOpacity: MotionValue<number>;
  heroContainerWidth: MotionValue<string>;
  heroContainerHeight: MotionValue<string>;
  heroContainerRadius: MotionValue<number>;
  spacerRef: React.RefObject<HTMLDivElement | null>;
  onVideoReady?: () => void;
}

export const Hero = ({ 
  heroRef, 
  heroOpacity, 
  heroImageY, 
  heroImageScale, 
  heroImageOpacity, 
  heroContainerWidth, 
  heroContainerHeight, 
  heroContainerRadius,
  spacerRef,
  onVideoReady
}: HeroProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Fallback: If video takes too long, just show the page anyway
    const timer = setTimeout(() => {
      onVideoReady?.();
    }, 5000);

    // Check if video is already ready (e.g. cached)
    if (videoRef.current && videoRef.current.readyState >= 3) {
      onVideoReady?.();
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [onVideoReady]);

  return (
    <section 
      ref={heroRef}
      className={styles.hero}
    >
      <motion.div 
        style={{ 
          opacity: heroOpacity,
          paddingTop: 'calc(140px + env(safe-area-inset-top, 0px))'
        }}
        className={styles["hero-content"]}
      >
        <div 
          style={{ top: 'calc(50% + env(safe-area-inset-top, 0px) / 2)' }}
          className={styles["hero-video-wrapper"]}
        >
           <motion.div 
             style={{ 
               y: heroImageY, 
               scale: heroImageScale, 
               opacity: heroImageOpacity,
               width: heroContainerWidth,
               height: heroContainerHeight,
               borderRadius: heroContainerRadius
             }} 
             className={styles["hero-video-container"]}
           >
              <video 
                ref={videoRef}
                src="https://cdn.yuhangang.com/pantai-timor/cover.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                onCanPlay={onVideoReady}
                className={styles["hero-video"]}
              />
           </motion.div>
        </div>

        <div className={styles["hero-title-wrapper"]}>
          <div ref={spacerRef} className={styles["hero-spacer"]}>
            <h1 className={`${cormorant.className} ${styles["hero-title"]}`}>{PANTAI_TIMOR_COPY.hero.title}</h1>
          </div>
        </div>

        {/* Scroll Indicator */}
         <motion.div style={{ opacity: heroOpacity }} className={styles["scroll-indicator"]}>
          <span className={styles["scroll-text"]}>
            {PANTAI_TIMOR_COPY.hero.scroll}
          </span>
          <div className={styles["scroll-line"]}>
             <div className={styles["scroll-line-animated"]} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
