"use client";

import { Inter, Libre_Caslon_Text } from "next/font/google";
import dynamic from "next/dynamic";
import { useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type WheelEvent } from "react";
import { COASTAL_LOCATIONS } from "@/app/pantai-timor/data";
import { AlmanacSection, VillageRhythmsSection } from "./FeatureSections";
import { CAROUSEL_IMAGES, LOCAL_AUTOPLAY_DURATION_MS } from "./constants";
import { GeographySection } from "./GeographySection";
import { HeroSection } from "./HeroSection";
import { LocalArchiveSection } from "./LocalArchiveSection";
import { PantaiFooter, QuoteSection } from "./QuoteFooter";
import { PantaiLightbox } from "./PantaiLightbox";
import { PantaiNav } from "./PantaiNav";

const HyogenCursor = dynamic(() => import("@/components/showcase/HyogenCursor"), { ssr: false });

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function PantaiTimorPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [carouselSnapOffsets, setCarouselSnapOffsets] = useState<number[]>([]);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [hasExitedLocalSection, setHasExitedLocalSection] = useState(false);
  const [hasLocalAutoplayPosition, setHasLocalAutoplayPosition] = useState(false);
  const [isLocalAutoplaying, setIsLocalAutoplaying] = useState(false);
  const [localSnapIndex, setLocalSnapIndex] = useState(0);
  const almanacRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasExitedLocalSectionRef = useRef(false);
  const lastOverlayWheelAt = useRef(0);
  const localSectionRef = useRef<HTMLElement>(null);
  const localAutoplayProgress = useMotionValue(0);
  const localSnapX = useMotionValue(0);
  const isLightboxOpen = activeImageIndex !== null;
  const fonts = { serif: libreCaslon.className, sans: inter.className };

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const resetScrollBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", resetScrollBeforeUnload);
    return () => window.removeEventListener("beforeunload", resetScrollBeforeUnload);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (event.key === "Escape") setActiveImageIndex(null);
      if (event.key === "ArrowLeft") setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      if (event.key === "ArrowRight") setActiveImageIndex((prev) => (prev !== null && prev < CAROUSEL_IMAGES.length - 1 ? prev + 1 : prev));
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

  useEffect(() => {
    if (!isLightboxOpen) return;

    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const originalBodyOverflow = bodyStyle.overflow;
    const originalBodyOverscrollBehavior = bodyStyle.overscrollBehavior;
    const originalBodyTouchAction = bodyStyle.touchAction;
    const originalHtmlOverflow = htmlStyle.overflow;
    const originalHtmlOverscrollBehavior = htmlStyle.overscrollBehavior;
    const originalHtmlTouchAction = htmlStyle.touchAction;

    htmlStyle.overflow = "hidden";
    htmlStyle.overscrollBehavior = "none";
    htmlStyle.touchAction = "none";
    bodyStyle.overflow = "hidden";
    bodyStyle.overscrollBehavior = "none";
    bodyStyle.touchAction = "none";

    return () => {
      bodyStyle.overflow = originalBodyOverflow;
      bodyStyle.overscrollBehavior = originalBodyOverscrollBehavior;
      bodyStyle.touchAction = originalBodyTouchAction;
      htmlStyle.overflow = originalHtmlOverflow;
      htmlStyle.overscrollBehavior = originalHtmlOverscrollBehavior;
      htmlStyle.touchAction = originalHtmlTouchAction;
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    let frame = 0;

    const updateLocalSectionExit = () => {
      frame = 0;
      const section = localSectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionIsFullyAboveViewport = rect.bottom <= 0;
      const sectionIsFullyBelowViewport = rect.top >= window.innerHeight;
      const shouldReset = sectionIsFullyAboveViewport || (hasExitedLocalSectionRef.current && !sectionIsFullyBelowViewport);

      if (shouldReset === hasExitedLocalSectionRef.current) return;
      hasExitedLocalSectionRef.current = shouldReset;
      setHasExitedLocalSection(shouldReset);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateLocalSectionExit);
    };

    updateLocalSectionExit();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (!carouselRef.current?.parentElement) return;

      const parentWidth = carouselRef.current.parentElement.clientWidth;
      const childWidth = carouselRef.current.scrollWidth;
      const maxX = Math.max(0, childWidth - parentWidth);
      const children = Array.from(carouselRef.current.children) as HTMLElement[];
      const firstOffset = children[0]?.offsetLeft ?? 0;
      const snapOffsets = children.map((child, index) => {
        if (index === children.length - 1) return maxX;
        return Math.max(0, Math.min(maxX, child.offsetLeft - firstOffset));
      });

      setCarouselWidth(maxX);
      setCarouselSnapOffsets(snapOffsets);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (carouselRef.current) resizeObserver.observe(carouselRef.current);

    window.addEventListener("resize", updateWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const { scrollYProgress: localScrollProgress } = useScroll({
    target: localSectionRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: almanacScrollProgress } = useScroll({
    target: almanacRef,
    offset: ["start end", "end start"],
  });

  const almanacImageY = useTransform(
    almanacScrollProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-20%", "20%"]
  );

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroImageScale = useTransform(scrollY, [0, 1000], [1, 2.5]);
  const heroImageOpacityFade = useTransform(scrollY, [800, 1200], [1, 0]);
  const heroImageYClamp = useTransform(scrollY, [0, 1200], [0, 1200]);

  const carouselSpring = useSpring(localSnapX, {
    stiffness: 120,
    damping: 32,
    mass: 0.45,
    restDelta: 0.5,
  });

  useEffect(() => {
    return localScrollProgress.on("change", (progress) => {
      if (hasLocalAutoplayPosition) return;

      if (hasExitedLocalSectionRef.current || progress <= 0.08 || carouselSnapOffsets.length === 0) {
        setLocalSnapIndex(0);
        return;
      }

      const normalizedProgress = Math.max(0, Math.min(1, (progress - 0.08) / 0.74));
      const nextIndex = Math.round(normalizedProgress * (CAROUSEL_IMAGES.length - 1));
      setLocalSnapIndex(nextIndex);
    });
  }, [carouselSnapOffsets.length, hasLocalAutoplayPosition, localScrollProgress]);

  useEffect(() => {
    if (hasExitedLocalSection) {
      localSnapX.set(0);
      queueMicrotask(() => setLocalSnapIndex(0));
      return;
    }

    localSnapX.set(-(carouselSnapOffsets[localSnapIndex] ?? 0));
  }, [carouselSnapOffsets, hasExitedLocalSection, localSnapIndex, localSnapX]);

  useEffect(() => {
    if (!hasExitedLocalSection) return;

    localAutoplayProgress.set(0);
    queueMicrotask(() => {
      setIsLocalAutoplaying(false);
      setHasLocalAutoplayPosition(false);
    });
  }, [hasExitedLocalSection, localAutoplayProgress]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    queueMicrotask(() => setIsLocalAutoplaying(false));
  }, [isLightboxOpen]);

  useAnimationFrame((_, delta) => {
    if (!isLocalAutoplaying || isLightboxOpen || shouldReduceMotion) return;

    const nextProgress = Math.min(1, localAutoplayProgress.get() + delta / LOCAL_AUTOPLAY_DURATION_MS);
    localAutoplayProgress.set(nextProgress);
    setLocalSnapIndex(Math.round(nextProgress * (CAROUSEL_IMAGES.length - 1)));

    if (nextProgress >= 1) {
      setIsLocalAutoplaying(false);
    }
  });

  const carouselX = useTransform([carouselSpring, localScrollProgress, localAutoplayProgress], ([snapX, progress, autoplay]) => {
    const rawProgress = Number(progress);
    const autoTravel = Number(autoplay);
    if (hasExitedLocalSection || rawProgress <= 0.08) return 0;
    if (hasLocalAutoplayPosition) return -autoTravel * carouselWidth;
    return Number(snapX);
  });
  const sectionOpacity = useTransform(localScrollProgress, [0, 0.05, 0.84, 0.94, 1], [0.88, 1, 1, 0.18, 0]);
  const carouselOpacity = useTransform(localScrollProgress, [0, 0.06, 0.82, 0.9, 1], [0.15, 1, 1, 0, 0]);
  const activeImage = activeImageIndex === null ? null : CAROUSEL_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((location) => location.image === activeImage.src) ?? null : null;

  const handleOverlayWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const wheelDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(wheelDelta) < 24) return;

    const now = window.performance.now();
    if (now - lastOverlayWheelAt.current < 520) return;
    lastOverlayWheelAt.current = now;

    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      const nextIndex = wheelDelta > 0 ? currentIndex + 1 : currentIndex - 1;
      return Math.max(0, Math.min(CAROUSEL_IMAGES.length - 1, nextIndex));
    });
  };

  const handleToggleLocalAutoplay = () => {
    if (shouldReduceMotion) return;

    setIsLocalAutoplaying((isPlaying) => {
      if (!isPlaying) {
        const currentProgress = hasExitedLocalSection ? 0 : localSnapIndex / Math.max(1, CAROUSEL_IMAGES.length - 1);
        localAutoplayProgress.set(currentProgress >= 0.98 ? 0 : currentProgress);
        setHasLocalAutoplayPosition(true);
      }

      return !isPlaying;
    });
  };

  return (
    <main className={`${fonts.sans} relative min-h-screen bg-[#10110F] text-[#e3e1da] selection:bg-[#e3e1da] selection:text-[#10110F]`}>
      <HyogenCursor />
      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      <PantaiNav />
      <HeroSection
        fonts={fonts}
        heroImageOpacityFade={heroImageOpacityFade}
        heroImageScale={heroImageScale}
        heroImageYClamp={heroImageYClamp}
        heroOpacity={heroOpacity}
        heroY={heroY}
      />
      <AlmanacSection almanacImageY={almanacImageY} almanacRef={almanacRef} fonts={fonts} />
      <VillageRhythmsSection fonts={fonts} />
      <GeographySection fonts={fonts} onImageClick={setActiveImageIndex} />
      <LocalArchiveSection
        carouselRef={carouselRef}
        carouselX={carouselX}
        carouselOpacity={carouselOpacity}
        fonts={fonts}
        hasExitedLocalSection={hasExitedLocalSection}
        isLocalAutoplaying={isLocalAutoplaying}
        localSectionRef={localSectionRef}
        localSnapIndex={localSnapIndex}
        onImageClick={setActiveImageIndex}
        onToggleAutoplay={handleToggleLocalAutoplay}
        sectionOpacity={sectionOpacity}
        shouldReduceMotion={Boolean(shouldReduceMotion)}
      />
      <QuoteSection fonts={fonts} />
      <PantaiFooter fonts={fonts} />
      <PantaiLightbox
        activeImage={activeImage}
        activeImageIndex={activeImageIndex}
        activeLocation={activeLocation}
        fonts={fonts}
        onClose={() => setActiveImageIndex(null)}
        onNavigate={setActiveImageIndex}
        onOverlayWheel={handleOverlayWheel}
      />
    </main>
  );
}
