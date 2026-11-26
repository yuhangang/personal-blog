"use client";

import {
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { STORY_PLATES } from "./story";

import { Navbar } from "./components/Navbar";
import { AnimatedTitle } from "./components/AnimatedTitle";
import { LoadingScreen } from "./components/LoadingScreen";
import { Lightbox } from "./components/Lightbox";
import { EditorialBook } from "./components/EditorialBook";
import styles from "./pantai-timor.module.scss";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function PantaiTimorRedesign() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const spacerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const didMeasureInitialHeroAnchorRef = useRef(false);
  const [anchors, setAnchors] = useState({
    start: { top: 0, left: 0 },
    end: { top: 0, left: 0 },
    isSet: false,
  });

  // Normalized 0 → 1 progress across the inline Cover (Hero) sticky dwell on
  // desktop, or horizontal swipe away from the Cover on mobile.
  const heroProgressMV = useMotionValue(0);

  const handleVideoReady = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useLayoutEffect(() => {
    const updatePos = () => {
      const currentVh = window.innerHeight;
      const vw = window.innerWidth;
      const isMob = vw < 768;
      const shouldMeasureHeroAnchor =
        window.scrollY <= 4 || !didMeasureInitialHeroAnchorRef.current;
      setIsMobile(isMob);
      const startRect = shouldMeasureHeroAnchor
        ? spacerRef.current?.getBoundingClientRect()
        : null;
      const endRect = navRef.current?.getBoundingClientRect();

      if (startRect && startRect.width > 0) {
        didMeasureInitialHeroAnchorRef.current = true;
      }

      setAnchors((prev) => ({
        start:
          startRect && startRect.width > 0
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
    const timer = setTimeout(updatePos, 80);
    return () => {
      window.removeEventListener("resize", updatePos);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") {
        setIsGridView(false);
        setActiveImageIndex(null);
      }
      // On the contact sheet, arrows belong to the page of thumbnails.
      if (isGridView) return;
      if (e.key === "ArrowLeft")
        setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      if (e.key === "ArrowRight")
        setActiveImageIndex((prev) =>
          prev !== null && prev < STORY_PLATES.length - 1 ? prev + 1 : prev
        );
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, isGridView]);

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

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    heroProgressMV.set(0);

    const syncFrame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      heroProgressMV.set(0);
    });

    const resetScrollBeforeUnload = () => {
      window.scrollTo(0, 0);
      heroProgressMV.set(0);
    };

    window.addEventListener("beforeunload", resetScrollBeforeUnload);
    return () => {
      window.cancelAnimationFrame(syncFrame);
      window.removeEventListener("beforeunload", resetScrollBeforeUnload);
    };
  }, [heroProgressMV]);

  // Title flight & horizontal parallax drift driven by the inline Cover's 0 → 1 progress
  const navBgOpacity = useTransform(heroProgressMV, [0.75, 1], [0, 1]);
  const titleScale = useTransform(heroProgressMV, [0, 0.88], [1, isMobile ? 0.58 : 0.18]);
  const titleLetterSpacing = useTransform(heroProgressMV, [0, 0.88], ["-0.02em", "0.35em"]);
  const titleX = useTransform(heroProgressMV, [0, 0.44, 0.88], ["-50%", "-55%", "-50%"]);
  const titleY = useTransform(heroProgressMV, [0, 0.88], ["-50%", "-50%"]);
  const titleLeft = useTransform(heroProgressMV, [0, 0.88], [anchors.start.left, anchors.end.left]);
  const titleTop = useTransform(heroProgressMV, [0, 0.88], [anchors.start.top, anchors.end.top]);
  const secondaryHeroOpacity = useTransform(heroProgressMV, [0, 0.42], [1, 0]);
  const secondaryDriftPx = useTransform(heroProgressMV, [0, 0.42], [0, -72]);
  const secondaryTitleX = useMotionTemplate`calc(-50% + ${secondaryDriftPx}px)`;

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
  const navTitleOpacity = useTransform(heroProgressMV, [0.55, 0.88], [0, 1]);

  const titleOpacity = useTransform([entryOpacity, navTitleOpacity], ([entry, nav]: number[]) =>
    entry * (1 - nav)
  );
  const secondaryTitleOpacity = useTransform(
    [secondaryHeroOpacity, titleOpacity],
    ([secondary, title]: number[]) => secondary * title
  );
  const finalTitleY = useMotionTemplate`calc(${titleY} + ${entryY}px)`;
  const finalTitleBlur = useTransform(entryBlur, (b: number) =>
    b <= 0.1 ? "none" : `blur(${b}px)`
  );

  return (
    <>
      <AnimatePresence>{!isLoaded && <LoadingScreen key="loading" />}</AnimatePresence>

      <main
        className={`${inter.className} ${styles.main}`}
        style={
          {
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          } as React.CSSProperties
        }
      >
        <Navbar
          navBgOpacity={navBgOpacity}
          navTitleOpacity={navTitleOpacity}
          navRef={navRef}
        />

        {/* Single unified horizontal gallery starting with the Hero cover inline
            alongside CoastalAlmanac, ParallaxZoom, the four chapters, and Epilogue. */}
        <EditorialBook
          onOpenPlate={setActiveImageIndex}
          isLightboxOpen={activeImageIndex !== null}
          heroProgressMV={heroProgressMV}
          spacerRef={spacerRef}
          onVideoReady={handleVideoReady}
        />

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
          secondaryTitleX={secondaryTitleX}
        />
      )}
    </>
  );
}
