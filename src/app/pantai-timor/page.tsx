"use client";

import { AnimatePresence, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { Inter } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FEATURED_IMAGES } from "./config";

// Import extracted components
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AnimatedTitle } from "./components/AnimatedTitle";
import { LoadingScreen } from "./components/LoadingScreen";
import { RouteStyles } from "./components/RouteStyles";

import { VillageRhythms } from "./components/VillageRhythms";
import { CoastalGeography } from "./components/CoastalGeography";
import { HistoryCulture } from "./components/HistoryCulture";
import { QuoteSection } from "./components/QuoteSection";
import { Footer } from "./components/Footer";
import { Lightbox } from "./components/Lightbox";
import { TheLocalSection } from "./components/TheLocalSection";
import { CoastalAlmanac } from "./components/CoastalAlmanac";
import { Memory } from "./components/Memory";

type ResettableMotionValue = {
  set: (value: number) => void;
  jump?: (value: number) => void;
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function PantaiTimorRedesign() {
  const [vh, setVh] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const localSectionRef = useRef<HTMLElement>(null);

  const heroRef = useRef<HTMLElement>(null);
  const almanacRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const didMeasureInitialHeroAnchorRef = useRef(false);
  const [anchors, setAnchors] = useState({
    start: { top: 0, left: 0 },
    end: { top: 0, left: 0 },
    isSet: false
  });

  useLayoutEffect(() => {
    const updatePos = () => {
      const currentVh = window.innerHeight;
      const vw = window.innerWidth;
      const isMob = vw < 768;
      const shouldMeasureHeroAnchor = window.scrollY <= 4 || !didMeasureInitialHeroAnchorRef.current;
      setVh(currentVh);
      setIsMobile(isMob);
      const startRect = shouldMeasureHeroAnchor ? spacerRef.current?.getBoundingClientRect() : null;
      const endRect = navRef.current?.getBoundingClientRect();

      if (startRect) {
        didMeasureInitialHeroAnchorRef.current = true;
      }

      setAnchors((prev) => ({
        start: startRect
          ? {
              top: startRect.top + startRect.height / 2,
              left: startRect.left + startRect.width / 2,
            }
          : prev.isSet
            ? prev.start
            : { top: currentVh * 0.48 + 50, left: vw / 2 },
        end: endRect
          ? {
              top: endRect.top + endRect.height / 2,
              left: endRect.left + endRect.width / 2,
            }
          : prev.isSet
            ? prev.end
            : { top: isMob ? 36 : 40, left: vw / 2 },
        isSet: true,
      }));
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
      if (e.key === "ArrowRight") setActiveImageIndex((prev) => (prev !== null && prev < FEATURED_IMAGES.length - 1 ? prev + 1 : prev));
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


  const navBgOpacity = useTransform(scrollY, [vh, vh + 1], [0, 1]);
  const navBlur = useTransform(scrollY, [vh, vh + 1], [0, 24]);
  const navBorderOpacity = useTransform(scrollY, [vh, vh + 1], [0, 0.1]);

  const titleScale = useTransform(scrollY, [0, stickyScroll], [1, isMobile ? 0.58 : 0.18]);
  const titleLetterSpacing = useTransform(scrollY, [0, stickyScroll], ["-0.02em", "0.35em"]);
  const titleX = useTransform(scrollY, [0, stickyScroll], ["-50%", "-50%"]);
  const titleY = useTransform(scrollY, [0, stickyScroll], ["-50%", "-50%"]);
  const titleLeft = useTransform(scrollY, [0, stickyScroll], [anchors.start.left, anchors.end.left]);
  const titleTop = useTransform(scrollY, [0, stickyScroll], [anchors.start.top, anchors.end.top]);
  
  const entryProgress = useSpring(0, { stiffness: 45, damping: 20 });
  
  useEffect(() => {
    if (anchors.isSet && isLoaded) {
      const timer = setTimeout(() => entryProgress.set(1), 200);
      return () => clearTimeout(timer);
    }
  }, [anchors.isSet, isLoaded, entryProgress]);

  const entryY = useTransform(entryProgress, [0, 1], [50, 0]);
  const entryOpacity = useTransform(entryProgress, [0, 1], [0, 1]);
  const entryBlur = useTransform(entryProgress, [0, 1], [12, 0]);
  const navTitleOpacity = useTransform(
    scrollY,
    [stickyScroll * 0.58, stickyScroll * 0.92],
    [0, 1]
  );

  const titleOpacity = useTransform([entryOpacity, navTitleOpacity], ([entry, nav]: number[]) => entry * (1 - nav));
  const secondaryTitleOpacity = useTransform([secondaryHeroOpacity, titleOpacity], ([secondary, title]: number[]) => secondary * title);
  const finalTitleY = useMotionTemplate`calc(${titleY} + ${entryY}px)`;
  const finalTitleBlur = useTransform(entryBlur, (b: number) => b <= 0.1 ? "none" : `blur(${b}px)`);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <main 
        className={`${inter.className} relative min-h-screen bg-[#10110F] text-[#e3e1da] selection:bg-[#e3e1da] selection:text-[#10110F]`}
        style={{ 
          "--nav-px": "1rem", 
          "--nav-py": "0.75rem",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1s ease-in-out"
        } as React.CSSProperties}
      >
      <RouteStyles />

      <Navbar 
        navBgOpacity={navBgOpacity}
        navBlur={navBlur}
        navBorderOpacity={navBorderOpacity}
        navTitleOpacity={navTitleOpacity}
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
        onVideoReady={() => setIsLoaded(true)}
      />

      <CoastalAlmanac almanacRef={almanacRef} />
      <HistoryCulture />
      <VillageRhythms />
      <Memory />

      <TheLocalSection 
        localSectionRef={localSectionRef}
        setActiveImageIndex={setActiveImageIndex}
        setIsGridView={setIsGridView}
      />

      <CoastalGeography onImageClick={(index) => setActiveImageIndex(index)} />
      <QuoteSection />
      <Footer />

      <Lightbox 
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
      />
      </main>
      
      {isLoaded && (
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
      )}
    </>
);
}
