"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, LayoutGrid, Maximize } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Libre_Caslon_Text } from "next/font/google";
import { FEATURED_IMAGES, COASTAL_LOCATIONS, PANTAI_TIMOR_COPY } from "../config";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ptTrack } from "@/utils/ga-events";
import { InfiniteGrid } from "./InfinityGrid";
import styles from "../pantai-timor.module.scss";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const lightboxFrameVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction === 0 ? 0 : direction > 0 ? 72 : -72,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction === 0 ? 0 : direction > 0 ? -72 : 72,
  }),
};

interface LightboxProps {
  activeImageIndex: number | null;
  setActiveImageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const Lightbox = ({ 
  activeImageIndex, 
  setActiveImageIndex, 
  isGridView,
  setIsGridView
}: LightboxProps) => {
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const prevIndexRef = useRef<number | null>(null);
  const scrollLockYRef = useRef(0);
  const [transitionDirection, setTransitionDirection] = useState(0);

  useEffect(() => {
    if (activeImageIndex !== null && prevIndexRef.current === null) {
      // Opening lightbox
      ptTrack.lightboxOpen(activeImageIndex, FEATURED_IMAGES[activeImageIndex].src);
    } else if (activeImageIndex === null && prevIndexRef.current !== null) {
      // Closing lightbox
      ptTrack.lightboxClose();
    } else if (
      activeImageIndex !== null &&
      prevIndexRef.current !== null &&
      activeImageIndex !== prevIndexRef.current
    ) {
      // Changing image
      ptTrack.lightboxImageChange(prevIndexRef.current, activeImageIndex, FEATURED_IMAGES[activeImageIndex].src);
    }
    prevIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex !== null) {
      ptTrack.lightboxToggleGrid(isGridView);
    }
  }, [isGridView, activeImageIndex]);

  useLayoutEffect(() => {
    const previousIndex = prevIndexRef.current;
    if (previousIndex === null || activeImageIndex === null) {
      setTransitionDirection(0);
    } else {
      setTransitionDirection(activeImageIndex > previousIndex ? 1 : -1);
    }
    prevIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex === null) return;

    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalLeft = body.style.left;
    const originalRight = body.style.right;
    const originalWidth = body.style.width;

    scrollLockYRef.current = window.scrollY;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollLockYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.left = originalLeft;
      body.style.right = originalRight;
      body.style.width = originalWidth;
      window.scrollTo(0, scrollLockYRef.current);
    };
  }, [activeImageIndex]);
  
  if (!portalRoot) return null;

  const activeImage = activeImageIndex === null ? null : FEATURED_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((loc) => loc.image === activeImage.src) : null;

  return createPortal(
    <AnimatePresence>
      {activeImageIndex !== null && activeImage && (
        <motion.div 
          initial={false} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`${styles["lightbox-container"]} ${isGridView ? styles["grid-mode"] : styles["image-mode"]}`}
          onClick={() => setActiveImageIndex(null)}
        >
          <div className={styles["lightbox-backdrop"]} />
          <div className={styles["lightbox-glow"]} />
          
          <div className={styles["lightbox-controls"]}>
            <button 
              type="button"
               aria-label={isGridView ? PANTAI_TIMOR_COPY.lightbox.aria.closeGrid : PANTAI_TIMOR_COPY.lightbox.aria.openGrid}
              onClick={(e) => {
                e.stopPropagation();
                setIsGridView(!isGridView);
              }}
              className={styles["lightbox-btn"]}
            >
              <div className={styles["lightbox-btn-icon"]}>
                {isGridView ? (
                  <Maximize className={styles["lightbox-control-icon"]} />
                ) : (
                  <LayoutGrid className={styles["lightbox-control-icon"]} />
                )}
              </div>
            </button>
            <button 
              type="button"
               aria-label={PANTAI_TIMOR_COPY.lightbox.aria.closeLightbox}
              onClick={() => setActiveImageIndex(null)}
              className={styles["lightbox-btn"]}
            >
              <X className={styles["lightbox-btn-icon"]} />
            </button>
          </div>

          <button 
            type="button"
             aria-label={PANTAI_TIMOR_COPY.lightbox.aria.prevPhoto}
            disabled={activeImageIndex === 0 || isGridView}
            onClick={(e) => {
              e.stopPropagation();
              if (activeImageIndex > 0) setActiveImageIndex(activeImageIndex - 1);
            }}
            className={`${styles["lightbox-nav-btn"]} ${styles.prev} ${(activeImageIndex === 0 || isGridView) ? styles.disabled : ''}`}
          >
            <ChevronLeft className={styles["lightbox-nav-icon"]} />
          </button>

          <button 
            type="button"
             aria-label={PANTAI_TIMOR_COPY.lightbox.aria.nextPhoto}
            disabled={activeImageIndex === FEATURED_IMAGES.length - 1 || isGridView}
            onClick={(e) => {
              e.stopPropagation();
              if (activeImageIndex < FEATURED_IMAGES.length - 1) setActiveImageIndex(activeImageIndex + 1);
            }}
            className={`${styles["lightbox-nav-btn"]} ${styles.next} ${(activeImageIndex === FEATURED_IMAGES.length - 1 || isGridView) ? styles.disabled : ''}`}
          >
            <ChevronRight className={styles["lightbox-nav-icon"]} />
          </button>

          <AnimatePresence mode="wait">
            {isGridView ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`${styles["lightbox-grid-view"]} ${styles["no-scrollbar"]}`}
                data-lenis-prevent
                onClick={(e) => e.stopPropagation()}
              >
                <InfiniteGrid
                  setActiveImageIndex={setActiveImageIndex}
                  setIsGridView={setIsGridView}
                  activeImageIndex={activeImageIndex}
                />
              </motion.div>
            ) : (
              <div className={styles["image-viewer-container"]}>
                <AnimatePresence mode="wait" custom={transitionDirection}>
                  <motion.div
                    key={activeImageIndex}
                    custom={transitionDirection}
                    variants={lightboxFrameVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className={styles["image-frame"]}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.08}
                      dragMomentum={false}
                      onDragEnd={(_, info) => {
                        const threshold = 110;
                        const velocityThreshold = 550;

                        if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                          setActiveImageIndex((prev) =>
                            prev !== null && prev < FEATURED_IMAGES.length - 1 ? prev + 1 : prev
                          );
                        } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                          setActiveImageIndex((prev) =>
                            prev !== null && prev > 0 ? prev - 1 : prev
                          );
                        }
                      }}
                      className={styles["draggable-image-wrapper"]}
                    >
                      <Image
                        src={activeImage.src}
                        alt={activeImage.alt}
                        fill
                        className={styles["lightbox-image"]}
                        priority
                        sizes="95vw"
                        draggable={false}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Fixed UI elements - stay consistent while images scroll */}
                <div className={styles["lightbox-info"]}>
                  <div className={styles["info-gradient"]} />
                  
                  <AnimatePresence mode="wait">
                    <motion.aside
                      key={activeImageIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={styles["info-content"]}
                    >
                      <p className={styles["info-counter"]}>
                        {String(activeImageIndex + 1).padStart(2, "0")} / {String(FEATURED_IMAGES.length).padStart(2, "0")}
                      </p>
                      <h4 className={`${libreCaslon.className} ${styles["info-title"]}`}>
                        {activeLocation?.name || activeImage.alt}
                      </h4>
                       <p className={styles["info-description"]}>
                        {activeLocation?.description || PANTAI_TIMOR_COPY.lightbox.defaultDescription}
                      </p>
                    </motion.aside>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
