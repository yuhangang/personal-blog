"use client";

import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import styles from "./SloganScroll.module.scss";

interface Props {
  activeIndex: number;
  totalCount: number;
  itemRefs: React.RefObject<(HTMLDivElement | null)[]>;
  sectionRef: React.RefObject<HTMLElement>;
}

export default function SloganControls({
  activeIndex,
  totalCount,
  itemRefs,
  sectionRef,
}: Props) {
  const { lenis } = useLenis();

  const scrollToItem = (index: number) => {
    if (!lenis || !itemRefs.current) return;
    const target = itemRefs.current[index];
    if (target) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 0.8,
        easing: (t) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToItem(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < totalCount - 1) {
      scrollToItem(activeIndex + 1);
    }
  };

  const handleSkip = () => {
    if (!lenis || !sectionRef.current) return;
    const sectionBottom =
      sectionRef.current.offsetTop + sectionRef.current.offsetHeight;
    lenis.scrollTo(sectionBottom, {
      duration: 1.2,
      easing: (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    });
  };

  return (
    <div className={styles.controlsWrapper}>
      {/* Progress Dots */}
      <div className={styles.progressDots}>
        {Array.from({ length: totalCount }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => scrollToItem(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className={styles.navArrows}>
        <button
          className={styles.navArrow}
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          className={styles.navArrow}
          onClick={handleNext}
          disabled={activeIndex === totalCount - 1}
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* Skip Button */}
      <button className={styles.skipButton} onClick={handleSkip}>
        Skip Section
      </button>
    </div>
  );
}
