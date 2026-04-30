"use client";

import { useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Inter } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState, type WheelEvent as ReactWheelEvent } from "react";
import { CAROUSEL_IMAGES } from "./data";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";

// Import extracted components
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AnimatedTitle } from "./components/AnimatedTitle";

import { VillageRhythms } from "./components/VillageRhythms";
import { CoastalGeography } from "./components/CoastalGeography";
import { HistoryCulture } from "./components/HistoryCulture";
import { QuoteSection } from "./components/QuoteSection";
import { Footer } from "./components/Footer";
import { Lightbox } from "./components/Lightbox";
import { TheLocalSection } from "./components/TheLocalSection";

type ResettableMotionValue = {
  set: (value: number) => void;
  jump?: (value: number) => void;
};

const LOCAL_TRAVEL_START = 0.01;
const LOCAL_TRAVEL_END = 0.99;
const LOCAL_BACK_SKIP_OFFSET = 2;

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

function getLocalArchiveTargetX() {
  return window.innerWidth / 2;
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function PantaiTimorRedesign() {
  const shouldReduceMotion = useReducedMotion();
  const { lenis } = useLenis();
  const localSectionRef = useRef<HTMLElement>(null);
  const localScrollProgress = useMotionValue(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasScrolledPastLocalRef = useRef(false);
  const isSkippingLocalBackRef = useRef(false);
  const lastLocalScrollYRef = useRef(0);

  const heroRef = useRef<HTMLElement>(null);
  const lastOverlayWheelAt = useRef(0);
  const spacerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState({
    start: { top: 0, left: 0 },
    end: { top: 0, left: 0 },
    isSet: false
  });

  useLayoutEffect(() => {
    const updatePos = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isMob = vw < 768;
      setIsMobile(isMob);
      const startRect = spacerRef.current?.getBoundingClientRect();
      const endRect = navRef.current?.getBoundingClientRect();

      if (startRect && endRect) {
        setAnchors({
          start: { 
            top: startRect.top + startRect.height / 2, 
            left: startRect.left + startRect.width / 2 
          },
          end: { 
            top: endRect.top + endRect.height / 2, 
            left: endRect.left + endRect.width / 2 
          },
          isSet: true
        });
      } else {
        setAnchors(prev => ({
          ...prev,
          start: { top: vh * 0.48 + 50, left: vw / 2 },
          end: { top: isMob ? 36 : 40, left: vw / 2 }
        }));
      }
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    const timer = setTimeout(updatePos, 50);
    return () => {
      window.removeEventListener("resize", updatePos);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowLeft") setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      if (e.key === "ArrowRight") setActiveImageIndex((prev) => (prev !== null && prev < CAROUSEL_IMAGES.length - 1 ? prev + 1 : prev));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);




  useEffect(() => {
    document.body.style.backgroundColor = "#10110F";
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "visible";
    document.documentElement.classList.add("pantai-timor-scroll");
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.overflow = originalOverflow;
      document.documentElement.classList.remove("pantai-timor-scroll");
    };
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [carouselPaddings, setCarouselPaddings] = useState({ left: 0, right: 0 });

  useEffect(() => {
    let frame = 0;

    const getLocalScrollMetrics = () => {
      const section = localSectionRef.current;
      if (!section) return null;

      const top = section.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      return { top, distance, bottom: top + distance };
    };

    interface LenisScrollEvent {
      scroll: number;
      velocity: number;
      progress: number;
      direction: number;
      type?: string;
    }

    const handleLenisScroll = (e: LenisScrollEvent) => {
      frame = 0;
      const metrics = getLocalScrollMetrics();
      if (!metrics) return;

      const currentScrollY = e.scroll;
      const scrollDelta = currentScrollY - lastLocalScrollYRef.current;
      lastLocalScrollYRef.current = currentScrollY;

      const isManual = e.type === 'wheel' || e.type === 'touch' || e.type === 'key';
      const progress = clampProgress((currentScrollY - metrics.top) / metrics.distance);

      // 1. Always update horizontal progress to ensure smooth transforms
      localScrollProgress.set(progress);

      // 2. Track boundary states
      if (currentScrollY < metrics.top - 100) {
        hasScrolledPastLocalRef.current = false;
      } else if (currentScrollY > metrics.bottom + 100) {
        hasScrolledPastLocalRef.current = true;
      }

      // 3. Manual "Skip Back" Jump Logic
      // Only trigger if:
      // - Manual scroll
      // - We are moving UP (scrollDelta < 0)
      // - We just entered the section from the bottom
      if (isManual && scrollDelta < 0 && 
          currentScrollY < metrics.bottom && 
          currentScrollY > metrics.bottom - 100 && 
          hasScrolledPastLocalRef.current) {
        
        if (!isSkippingLocalBackRef.current) {
          const targetScrollY = Math.max(0, metrics.top - LOCAL_BACK_SKIP_OFFSET);

          isSkippingLocalBackRef.current = true;
          hasScrolledPastLocalRef.current = false;
          lastLocalScrollYRef.current = targetScrollY;

          if (lenis) {
            lenis.scrollTo(targetScrollY, { immediate: true, force: true });
          }

          window.requestAnimationFrame(() => {
            isSkippingLocalBackRef.current = false;
          });
          localScrollProgress.set(0);
        }
      }
      
    };

    if (lenis) {
      lastLocalScrollYRef.current = lenis.scroll;
      lenis.on('scroll', handleLenisScroll);
    } else {
      window.addEventListener("scroll", () => {
        const metrics = getLocalScrollMetrics();
        if (metrics) localScrollProgress.set(clampProgress((window.scrollY - metrics.top) / metrics.distance));
      }, { passive: true });
    }

    const handleResize = () => {
      const metrics = getLocalScrollMetrics();
      if (metrics) localScrollProgress.set(clampProgress((window.scrollY - metrics.top) / metrics.distance));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (lenis) lenis.off('scroll', handleLenisScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [lenis, localScrollProgress]);

  useLayoutEffect(() => {
    const updatePaddings = () => {
      if (!carouselRef.current) return;
      const targetX = getLocalArchiveTargetX();
      
      const carousel = carouselRef.current;
      const parent = carousel.parentElement;
      if (!parent) return;

      const prevL = carousel.style.paddingLeft;
      const prevR = carousel.style.paddingRight;
      carousel.style.paddingLeft = "0px";
      carousel.style.paddingRight = "0px";

      const rect = carousel.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const firstItem = carousel.children[0] as HTMLElement;
      const lastItem = carousel.children[carousel.children.length - 1] as HTMLElement;
      
      const firstItemWidth = firstItem ? firstItem.offsetWidth : 0;
      const lastItemWidth = lastItem ? lastItem.offsetWidth : 0;
      
      const neededLeft = targetX - rect.left - firstItemWidth / 2;
      const neededRight = parentRect.width - (targetX - rect.left) - lastItemWidth / 2;
      
      setCarouselPaddings({
        left: Math.max(0, neededLeft),
        right: Math.max(0, neededRight)
      });

      carousel.style.paddingLeft = prevL;
      carousel.style.paddingRight = prevR;
    };

    updatePaddings();
    window.addEventListener("resize", updatePaddings);
    const timer = setTimeout(updatePaddings, 150);
    
    return () => {
      window.removeEventListener("resize", updatePaddings);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current && carouselRef.current.parentElement) {
        const parentW = carouselRef.current.parentElement.clientWidth;
        const childW = carouselRef.current.scrollWidth;
        setCarouselWidth(Math.max(0, childW - parentW));
      }
    };
    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    if (carouselRef.current) {
      ro.observe(carouselRef.current);
    }

    window.addEventListener("resize", updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);



  const stickyScroll = Math.max(1, anchors.start.top - anchors.end.top);
  const { scrollY } = useScroll();

  useLayoutEffect(() => {
    const resetMotionValue = (value: ResettableMotionValue) => {
      if (typeof value.jump === "function") {
        value.jump(0);
        return;
      }
      value.set(0);
    };

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    resetMotionValue(scrollY);

    const syncFrame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      resetMotionValue(scrollY);
    });

    const resetScrollBeforeUnload = () => {
      window.scrollTo(0, 0);
      resetMotionValue(scrollY);
    };

    window.addEventListener("beforeunload", resetScrollBeforeUnload);
    return () => {
      window.cancelAnimationFrame(syncFrame);
      window.removeEventListener("beforeunload", resetScrollBeforeUnload);
    };
  }, [scrollY]);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const heroContainerWidth = useTransform(heroScrollProgress, [0, 1], ["var(--hero-width)", "100vw"]);
  const heroContainerHeight = useTransform(heroScrollProgress, [0, 1], ["var(--hero-height)", "100vh"]);
  const heroContainerRadius = useTransform(heroScrollProgress, [0, 1], [40, 0]);
  const secondaryHeroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroImageScale = useTransform(scrollY, [0, 1000], [1, 2.5]);
  const heroImageY = useTransform(scrollY, [0, 1000], [0, 160]);
  const heroImageOpacity = useTransform(scrollY, [650, 1050], [1, 0]);

  const carouselTravelProgress = useTransform(
    localScrollProgress,
    [0, LOCAL_TRAVEL_START, LOCAL_TRAVEL_END, 1],
    shouldReduceMotion ? [0, 0, 0, 0] : [0, 0, 1, 1]
  );
  const carouselX = useTransform([carouselTravelProgress, localScrollProgress], ([p, progress]) => {
    const travel = Number(p);
    const rawProgress = Number(progress);

    if (rawProgress <= LOCAL_TRAVEL_START) return 0;
    return -travel * carouselWidth;
  });
  const sectionOpacity = useTransform(localScrollProgress, () => 1);
  const carouselOpacity = useTransform(
    localScrollProgress,
    [0, 0.05, 1],
    [0.6, 1, 1]
  );

  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 24]);
  const navBorderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  const titleScale = useTransform(scrollY, [0, stickyScroll], [1, isMobile ? 0.58 : 0.18]);
  const titleLetterSpacing = useTransform(scrollY, [0, stickyScroll], ["-0.02em", "0.35em"]);
  const titleX = useTransform(scrollY, [0, stickyScroll], ["-50%", "-50%"]);
  const titleY = useTransform(scrollY, [0, stickyScroll], ["-50%", "-50%"]);
  const titleLeft = useTransform(scrollY, [0, stickyScroll], [anchors.start.left, anchors.end.left]);
  const titleTop = useTransform(scrollY, [0, stickyScroll], [anchors.start.top, anchors.end.top]);
  
  const titleOpacityBase = useTransform(scrollY, [0, 10], [1, 1]); 
  const entryProgress = useSpring(0, { stiffness: 45, damping: 20 });
  
  useEffect(() => {
    if (anchors.isSet) {
      const timer = setTimeout(() => entryProgress.set(1), 200);
      return () => clearTimeout(timer);
    }
  }, [anchors.isSet, entryProgress]);

  const entryY = useTransform(entryProgress, [0, 1], [50, 0]);
  const entryOpacity = useTransform(entryProgress, [0, 1], [0, 1]);
  const entryBlur = useTransform(entryProgress, [0, 1], [12, 0]);

  const titleOpacity = useTransform([titleOpacityBase, entryOpacity], ([o, eo]: number[]) => o * eo);
  const secondaryTitleOpacity = useTransform([secondaryHeroOpacity, entryOpacity], ([so, eo]: number[]) => so * eo);
  const finalTitleY = useMotionTemplate`calc(${titleY} + ${entryY}px)`;
  const finalTitleBlur = useTransform(entryBlur, (b: number) => `blur(${b}px)`);

  const handleOverlayWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const wheelDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(wheelDelta) < 24) return;

    const now = window.performance.now();
    if (now - lastOverlayWheelAt.current < 520) return;
    lastOverlayWheelAt.current = now;

    setActiveImageIndex((currentIndex: number | null) => {
      if (currentIndex === null) return currentIndex;
      const nextIndex = wheelDelta > 0 ? currentIndex + 1 : currentIndex - 1;
      return Math.max(0, Math.min(CAROUSEL_IMAGES.length - 1, nextIndex));
    });
  };

  return (
    <main 
      className={`${inter.className} relative min-h-screen bg-[#10110F] text-[#e3e1da] selection:bg-[#e3e1da] selection:text-[#10110F]`}
      style={{ 
        "--nav-px": "1rem", 
        "--nav-py": "0.75rem" 
      } as React.CSSProperties}
    >
      <style>{`
        :root {
          --hero-width: 92vw;
          --hero-height: 120vw;
        }
        @media (min-width: 768px) {
          :root {
            --hero-width: 60vw;
            --hero-height: 40vw;
          }
          main { 
            --nav-px: 2.5rem !important; 
            --nav-py: 1.25rem !important; 
          }
        }
      `}</style>

      <Navbar 
        navBgOpacity={navBgOpacity}
        navBlur={navBlur}
        navBorderOpacity={navBorderOpacity}
        navRef={navRef}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <Hero 
        heroRef={heroRef}
        heroOpacity={heroOpacity}
        heroImageY={heroImageY}
        heroImageScale={heroImageScale}
        heroImageOpacity={heroImageOpacity}
        heroContainerWidth={heroContainerWidth}
        heroContainerHeight={heroContainerHeight}
        heroContainerRadius={heroContainerRadius}
        spacerRef={spacerRef}
      />

      <AnimatedTitle 
        titleScale={titleScale}
        titleX={titleX}
        finalTitleY={finalTitleY}
        titleLeft={titleLeft}
        titleTop={titleTop}
        titleOpacity={titleOpacity}
        finalTitleBlur={finalTitleBlur}
        titleLetterSpacing={titleLetterSpacing}
        secondaryHeroOpacity={secondaryTitleOpacity}
      />



     

      <HistoryCulture />
       <VillageRhythms />

        <TheLocalSection 
        localSectionRef={localSectionRef}
        sectionOpacity={sectionOpacity}
        carouselRef={carouselRef}
        carouselX={carouselX}
        carouselOpacity={carouselOpacity}
        carouselPaddings={carouselPaddings}
        localScrollProgress={localScrollProgress}
        setActiveImageIndex={setActiveImageIndex}
        setIsGridView={setIsGridView}
      />


      <CoastalGeography onImageClick={(index) => setActiveImageIndex(index)} />

    
      <QuoteSection />

      <Footer />

      <Lightbox 
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        handleOverlayWheel={handleOverlayWheel}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
      />
    </main>
  );
}
