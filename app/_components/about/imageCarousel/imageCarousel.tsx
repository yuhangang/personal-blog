import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CarouselContainer,
  CarouselImage,
  Indicator,
  Indicators,
  NextButton,
  PlaceholderSlide,
  PrevButton,
  Slide,
  SlideContainer,
} from "./imageCarousel.style";
import { ImageCarouselEntry } from "./imageCarousel.param";
import Image from "next/image";
import Link from "next/link";

const ImageCarousel = ({ slides }: { slides: ImageCarouselEntry[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkVisibilityAndScroll = () => {
      if (!carouselRef.current) return;

      // Check if carousel is in view
      const rect = carouselRef.current.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      // Prevent autoplay if not fully visible or page is not in focus
      if (!isVisible || document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // Start or continue autoplay
      if (isAutoPlaying && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
      }
    };

    // Add event listeners
    document.addEventListener("visibilitychange", checkVisibilityAndScroll);
    window.addEventListener("scroll", checkVisibilityAndScroll);

    // Initial check
    checkVisibilityAndScroll();

    // Cleanup
    return () => {
      document.removeEventListener(
        "visibilitychange",
        checkVisibilityAndScroll
      );
      window.removeEventListener("scroll", checkVisibilityAndScroll);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <CarouselContainer
      ref={carouselRef}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <SlideContainer>
        {slides.map((_, index) => (
          <Slide key={index} $isActive={index === currentIndex}>
            <Link href={slides[index].image}>
              <Image
                src={slides[index].image}
                alt={slides[index].title}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 20%"
              />
            </Link>
          </Slide>
        ))}
      </SlideContainer>
      <PrevButton onClick={goToPrev} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </PrevButton>
      <NextButton onClick={goToNext} aria-label="Next slide">
        <ChevronRight size={24} />
      </NextButton>

      <Indicators>
        {slides.map((_, index) => (
          <Indicator
            key={index}
            $isActive={index === currentIndex}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};

export default ImageCarousel;
