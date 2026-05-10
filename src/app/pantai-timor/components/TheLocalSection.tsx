"use client";

import { ptTrack } from "@/utils/ga-events";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import React from "react";
import { FEATURED_IMAGES, PANTAI_TIMOR_COPY, getThumbnailUrl } from "../config";
import styles from "../pantai-timor.module.scss";
import { PantaiFrame, pantaiLayout } from "./LayoutPrimitives";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface CarouselItemProps {
  item: (typeof FEATURED_IMAGES)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ item, index, isActive, onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        data-index={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
        onClick={() => {
          ptTrack.carouselClickImage(index, item.src);
          onClick();
        }}
        className={`${styles["carousel-item"]} ${item.isPortrait ? styles.portrait : styles.landscape} ${isActive ? styles.active : styles.inactive}`}
      >
        <div className={styles["carousel-image-container"]}>
          <motion.div 
            className={styles["carousel-image-wrapper"]}
          >
            <Image
              src={getThumbnailUrl(item.src)}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 40vw, 85vw"
              priority={index < 3}
              unoptimized={true}
              className={styles["carousel-image"]}
            />
          </motion.div>
        </div>
        
        {/* Archival Overlay */}
        <div className={styles["carousel-border"]} />
        
        {/* Caption (Hyogen style) */}
        <div className={styles["carousel-caption"]}>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isActive ? "0%" : "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles["carousel-caption-text"]}>
              {String(index + 1).padStart(2, "0")} — Archive
            </span>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

interface TheLocalSectionProps {
  localSectionRef: React.RefObject<HTMLElement | null>;
  setActiveImageIndex: (index: number) => void;
  setIsGridView: (isGrid: boolean) => void;
}

export const TheLocalSection = ({
  localSectionRef,
  setActiveImageIndex,
  setIsGridView,
}: TheLocalSectionProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  
  const total = FEATURED_IMAGES.length;
  const [translateX, setTranslateX] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: localSectionRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  // Preload images for the local section
  React.useEffect(() => {
    const preloadImages = () => {
      // Preload thumbnails for smooth horizontal scrolling
      FEATURED_IMAGES.forEach((item) => {
        const img = new window.Image();
        img.src = getThumbnailUrl(item.src);
      });
    };

    // Use requestIdleCallback if available, otherwise just timeout
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => preloadImages());
    } else {
      setTimeout(preloadImages, 1000);
    }
  }, []);

  React.useEffect(() => {
    if (!scrollRef.current) return;

    const updateTranslateX = () => {
      if (scrollRef.current) {
        const width = scrollRef.current.scrollWidth;
        const containerWidth = window.innerWidth;
        setTranslateX(width - containerWidth);
      }
    };

    const observer = new ResizeObserver(() => {
      updateTranslateX();
    });

    observer.observe(scrollRef.current);
    // Also handle window resize as a fallback and for containerWidth
    window.addEventListener("resize", updateTranslateX);
    
    // Initial call
    updateTranslateX();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTranslateX);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -translateX]);
  
  // Track active index based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const idx = Math.min(
      Math.floor(latest * total),
      total - 1
    );
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  return (
    <section
      id="archive"
      ref={localSectionRef as React.RefObject<HTMLElement>}
      className={styles["local-section"]}
    >
      <div className={styles["local-sticky-container"]}>
        <div className={styles["carousel-viewport"]}>
          <motion.div
            ref={scrollRef}
            id="pantai-timor-scroller"
            style={{ x }}
            className={`${styles["carousel-track"]} ${styles["no-scrollbar"]} ${pantaiLayout.contentGutters}`}
          >
            {FEATURED_IMAGES.map((item, idx) => (
              <CarouselItem
                key={idx}
                item={item}
                index={idx}
                isActive={idx === activeIdx}
                onClick={() => setActiveImageIndex(idx)}
              />
            ))}
          </motion.div>
        </div>

        <div className={styles["local-overlay-container"]}>
          <div className={styles["local-gradient-overlay"]} />
          <PantaiFrame variant="narrow" withGutters>
            <div className={styles["local-content-wrapper"]}>
            <div className={styles["local-content-grid"]}>
              <div className={styles["local-text-column"]}>
                <h3 className={`${cormorant.className} ${styles["local-title"]}`}>
                  <motion.span
                    initial={{ opacity: 0, y: 40, rotate: -1 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {PANTAI_TIMOR_COPY.localSection.title}
                  </motion.span>
                </h3>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={styles["local-description"]}
                >
                  {PANTAI_TIMOR_COPY.localSection.content}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={styles["local-cta-column"]}
              >
                <motion.button
                  onClick={() => {
                    ptTrack.carouselViewArchive();
                    setActiveImageIndex(0);
                    setIsGridView(true);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ x: 1 }}
                  className={styles["archive-btn"]}
                >
                  <span className={styles["btn-icon-circle"]}>
                    <span className={styles["btn-arrow"]}>
                      ↗
                    </span>
                  </span>
                  <span>{PANTAI_TIMOR_COPY.localSection.cta}</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
          </PantaiFrame>
        </div>
        </div>
    </section>
  );
};
