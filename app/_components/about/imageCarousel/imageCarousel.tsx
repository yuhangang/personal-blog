import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import {
  CarouselContainer,
  Indicator,
  Indicators,
  NavigationButton,
  SlideContainer,
  SlideWrapper,
  BottomIndicator,
  BottomIndicatorsContainer,
  LocationChip,
  LocationContainer,
} from "./imageCarousel.style";

interface Slide {
  image: string;
  title: string;
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
    <CarouselContainer>
      <SlideContainer>
        {[currentIndex, prevIndex].map((slideIndex, stackIndex) => {
          if (slideIndex === null) return null;

          const isActive = slideIndex === currentIndex;
          const slideDirection =
            stackIndex === 0 && !isActive ? direction : "initial";

          return (
            <SlideWrapper
              key={`${slideIndex}`}
              $isActive={isActive}
              $direction={slideDirection}
            >
              <Image
                src={memoizedSlides[slideIndex].image}
                alt={memoizedSlides[slideIndex].title}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 15%"
                quality={100}
                priority={slideIndex < 2}
              />
              {memoizedSlides[slideIndex].location && (
                <LocationContainer>
                  <LocationChip>
                    <MapPin size={20} style={{ marginRight: "8px" }} />
                    {memoizedSlides[slideIndex].location!.description}
                  </LocationChip>
                </LocationContainer>
              )}
            </SlideWrapper>
          );
        })}
      </SlideContainer>

      <NavigationButton
        style={{ left: "8px" }}
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </NavigationButton>

      <NavigationButton
        style={{ right: "8px" }}
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </NavigationButton>

      <BottomIndicatorsContainer>
        {slides.map((slide, index) => (
          <BottomIndicator
            key={index}
            onClick={() => goToSlide(index)}
            $isActive={index === currentIndex}
          />
        ))}
      </BottomIndicatorsContainer>
    </CarouselContainer>
  );
};

export default ImageCarousel;
