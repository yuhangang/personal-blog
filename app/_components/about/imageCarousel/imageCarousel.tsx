"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import styles from "./imageCarousel.module.scss";

interface Slide {
  image: string;
  title: string;
  description: string;
  location?: {
    description: string;
    mapsLink: string;
  };
}

const ImageCarousel: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev" | "initial">(
    "initial"
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize slides to prevent unnecessary re-renders
  const memoizedSlides = useMemo(() => slides, [slides]);

  // Advance slide with optimized logic
  const advanceSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % memoizedSlides.length);
  }, [currentIndex, memoizedSlides.length]);

  // Setup auto-play interval with cleanup
  useEffect(() => {
    intervalRef.current = setInterval(advanceSlide, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [advanceSlide]);

  // Navigation handlers with interval reset
  const navigate = useCallback(
    (newIndex: number, navDirection: "next" | "prev") => {
      setPrevIndex(currentIndex);
      setDirection(navDirection);
      setCurrentIndex(newIndex);

      // Reset interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(advanceSlide, 5000);
      }
    },
    [currentIndex, advanceSlide]
  );

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % memoizedSlides.length;
    navigate(nextIndex, "next");
  };

  const goToPrev = () => {
    const prevIndex =
      (currentIndex - 1 + memoizedSlides.length) % memoizedSlides.length;
    navigate(prevIndex, "prev");
  };

  const goToSlide = (index: number) => {
    const navDirection = index > currentIndex ? "next" : "prev";
    navigate(index, navDirection);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.slideContainer}>
        {[currentIndex, prevIndex].map((slideIndex, stackIndex) => {
          if (slideIndex === null) return null;

          const isActive = slideIndex === currentIndex;
          const slideDirection =
            stackIndex === 0 && !isActive ? direction : "initial";

          return (
            <div
              key={`${slideIndex}`}
              className={`${styles.slideWrapper} ${
                isActive
                  ? styles.slideWrapperActive
                  : styles.slideWrapperInactive
              }`}
            >
              <Image
                src={memoizedSlides[slideIndex].image}
                alt={`${memoizedSlides[slideIndex].title}, ${memoizedSlides[slideIndex].description}`}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 15%"
                quality={100}
                placeholder={"blur"}
                blurDataURL={memoizedSlides[slideIndex].image}
              />
              {memoizedSlides[slideIndex].location && (
                <div className={styles.locationContainer}>
                  <Link href={memoizedSlides[slideIndex].location!.mapsLink}>
                    <div className={styles.locationChip}>
                      <MapPin size={20} style={{ marginRight: "8px" }} />
                      {memoizedSlides[slideIndex].location!.description}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className={styles.navigationButton}
        style={{ left: "8px" }}
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className={styles.navigationButton}
        style={{ right: "8px" }}
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className={styles.scrollDownIndicator}>
        <ChevronDown size={36} />
      </div>
      <div className={styles.bottomIndicatorsContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.bottomIndicator} ${
              index === currentIndex
                ? styles.bottomIndicatorActive
                : styles.bottomIndicatorInactive
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
