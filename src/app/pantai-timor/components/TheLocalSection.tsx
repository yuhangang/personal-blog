"use client";

import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { ptTrack } from "@/utils/ga-events";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React from "react";
import { FEATURED_IMAGES, getThumbnailUrl } from "../config";
import styles from "../pantai-timor.module.scss";
import { pantaiLayout } from "./LayoutPrimitives";

interface CarouselItemProps {
  item: (typeof FEATURED_IMAGES)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
  onKeyboardFocus: (item: HTMLElement) => void;
}

const CarouselItem = React.forwardRef<HTMLButtonElement, CarouselItemProps>(
  ({ item, index, isActive, onClick, onKeyboardFocus }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        data-index={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
        onClick={() => {
          ptTrack.carouselClickImage(index, item.src);
          onClick();
        }}
        onFocus={(event) => {
          // Mouse clicks focus the button too; only keyboard focus moves the page.
          if (event.currentTarget.matches(":focus-visible")) onKeyboardFocus(event.currentTarget);
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
      </motion.button>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

interface TheLocalSectionProps {
  localSectionRef: React.RefObject<HTMLElement | null>;
  setActiveImageIndex: (index: number) => void;
}

export const TheLocalSection = ({
  localSectionRef,
  setActiveImageIndex,
}: TheLocalSectionProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const { lenis } = useLenis();

  const total = FEATURED_IMAGES.length;

  // The strip is moved by vertical scroll, so bringing a photo into view means
  // scrolling the page to the point where that photo sits in the centre.
  const scrollToItem = (item: HTMLElement) => {
    const section = localSectionRef.current;
    if (!section || translateX <= 0) return;

    const travel = section.offsetHeight - window.innerHeight;
    if (travel <= 0) return;

    // offsetLeft ignores the strip's transform: it is the photo's resting place.
    const centreOffset = item.offsetLeft + item.offsetWidth / 2 - window.innerWidth / 2;
    const progress = Math.min(1, Math.max(0, centreOffset / translateX));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const top = sectionTop + progress * travel;

    if (lenis) {
      lenis.scrollTo(top);
    } else {
      window.scrollTo({ top });
    }
  };
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
                onKeyboardFocus={scrollToItem}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
