"use client";

import { Inter, Libre_Caslon_Text, Noto_Serif_TC, Amiri } from "next/font/google";
import dynamic from "next/dynamic";
import { useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { COASTAL_LOCATIONS } from "@/app/pantai-timor/data";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { AlmanacSection, VillageRhythmsSection } from "./FeatureSections";
import { CAROUSEL_IMAGES, LOCAL_AUTOPLAY_DURATION_MS } from "./constants";
import { GeographySection } from "./GeographySection";
import { HeroSection } from "./HeroSection";
import { LocalArchiveSection } from "./LocalArchiveSection";
import { PantaiFooter, QuoteSection } from "./QuoteFooter";
import { PantaiLightbox } from "./PantaiLightbox";
import { PantaiNav } from "./PantaiNav";

const HyogenCursor = dynamic(() => import("@/components/showcase/HyogenCursor"), { ssr: false });

const LOCAL_TRAVEL_START = 0.08;
const LOCAL_TRAVEL_END = 0.82;
const LOCAL_TRAVEL_DISTANCE = LOCAL_TRAVEL_END - LOCAL_TRAVEL_START;
const LOCAL_RECENTER_DURATION_SECONDS = 0.95;
const LOCAL_RECENTER_IDLE_MS = 260;
const LOCAL_RECENTER_RELEASE_MS = 1120;

function getLocalArchiveTargetX() {
  const viewportWidth = window.innerWidth;
  return viewportWidth < 768 ? viewportWidth / 2 : viewportWidth * 0.64;
}

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

const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

type ResettableMotionValue = {
  set: (value: number) => void;
  jump?: (value: number) => void;
};

export default function PantaiTimorPage() {
  const shouldReduceMotion = useReducedMotion();
  const { lenis } = useLenis();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [hasExitedLocalSection, setHasExitedLocalSection] = useState(false);
  const [hasLocalAutoplayPosition, setHasLocalAutoplayPosition] = useState(false);
  const [isLocalAutoplaying, setIsLocalAutoplaying] = useState(false);
  const [localSnapIndex, setLocalSnapIndex] = useState(0);
  const almanacRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasExitedLocalSectionRef = useRef(false);
  const isRecenteringRef = useRef(false);
  const localSectionRef = useRef<HTMLElement>(null);
  const localAutoplayProgress = useMotionValue(0);
  const recenterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLightboxOpen = activeImageIndex !== null;
  const fonts = { 
    serif: libreCaslon.className, 
    sans: inter.className,
    chinese: notoSerifTC.className,
    arabic: amiri.className
  };

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
      setCarouselWidth(maxX);
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

  useEffect(() => {
    if (shouldReduceMotion || hasLocalAutoplayPosition || isLocalAutoplaying || isLightboxOpen) return;

    const clearRecenterTimeout = () => {
      if (!recenterTimeoutRef.current) return;
      clearTimeout(recenterTimeoutRef.current);
      recenterTimeoutRef.current = null;
    };

    const recenterToNearestItem = () => {
      recenterTimeoutRef.current = null;
      if (isRecenteringRef.current || hasExitedLocalSectionRef.current) return;

      const section = localSectionRef.current;
      const carousel = carouselRef.current;
      if (!section || !carousel || carouselWidth <= 0) return;

      const progress = localScrollProgress.get();
      if (progress < LOCAL_TRAVEL_START || progress > LOCAL_TRAVEL_END) return;

      const targetX = getLocalArchiveTargetX();
      const transform = getComputedStyle(carousel).transform;
      const currentX = transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
      const items = Array.from(carousel.children) as HTMLElement[];
      const nearestItem = items.reduce<{ item: HTMLElement | null; distance: number }>(
        (nearest, item) => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const distance = Math.abs(itemCenter - targetX);
          return distance < nearest.distance ? { item, distance } : nearest;
        },
        { item: null, distance: Number.POSITIVE_INFINITY }
      ).item;

      if (!nearestItem) return;

      const itemRect = nearestItem.getBoundingClientRect();
      const untransformedItemCenter = itemRect.left + itemRect.width / 2 - currentX;
      const targetCarouselX = Math.min(0, Math.max(-carouselWidth, targetX - untransformedItemCenter));
      const targetTravel = Math.min(1, Math.max(0, -targetCarouselX / carouselWidth));
      const targetProgress = LOCAL_TRAVEL_START + targetTravel * LOCAL_TRAVEL_DISTANCE;
      if (Math.abs(targetCarouselX - currentX) < 8) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const targetScroll = sectionTop + targetProgress * scrollableDistance;

      isRecenteringRef.current = true;

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: LOCAL_RECENTER_DURATION_SECONDS,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }

      window.setTimeout(() => {
        isRecenteringRef.current = false;
      }, LOCAL_RECENTER_RELEASE_MS);
    };

    const queueRecenter = () => {
      if (isRecenteringRef.current || hasExitedLocalSectionRef.current) return;
      const progress = localScrollProgress.get();
      if (progress < LOCAL_TRAVEL_START || progress > LOCAL_TRAVEL_END) {
        clearRecenterTimeout();
        return;
      }

      clearRecenterTimeout();
      recenterTimeoutRef.current = setTimeout(recenterToNearestItem, LOCAL_RECENTER_IDLE_MS);
    };

    const unsubscribe = lenis?.on("scroll", queueRecenter);
    window.addEventListener("scroll", queueRecenter, { passive: true });
    window.addEventListener("wheel", queueRecenter, { passive: true });
    window.addEventListener("touchend", queueRecenter, { passive: true });

    return () => {
      clearRecenterTimeout();
      unsubscribe?.();
      window.removeEventListener("scroll", queueRecenter);
      window.removeEventListener("wheel", queueRecenter);
      window.removeEventListener("touchend", queueRecenter);
    };
  }, [
    carouselWidth,
    hasLocalAutoplayPosition,
    isLightboxOpen,
    isLocalAutoplaying,
    lenis,
    localScrollProgress,
    shouldReduceMotion,
  ]);

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

  const heroY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroImageScale = useTransform(scrollY, [0, 1000], [1, 2.5]);
  const heroImageOpacityFade = useTransform(scrollY, [800, 1200], [1, 0]);
  const heroImageYClamp = useTransform(scrollY, [0, 1200], [0, 1200]);

  useEffect(() => {
    return localScrollProgress.on("change", (progress) => {
      if (hasLocalAutoplayPosition) return;

      if (hasExitedLocalSectionRef.current || progress <= LOCAL_TRAVEL_START) {
        setLocalSnapIndex(0);
        return;
      }

      const normalizedProgress = Math.max(0, Math.min(1, (progress - LOCAL_TRAVEL_START) / LOCAL_TRAVEL_DISTANCE));
      const nextIndex = Math.round(normalizedProgress * (CAROUSEL_IMAGES.length - 1));
      setLocalSnapIndex(nextIndex);
    });
  }, [hasLocalAutoplayPosition, localScrollProgress]);

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

  const carouselTravelProgress = useTransform(
    localScrollProgress,
    [0, LOCAL_TRAVEL_START, LOCAL_TRAVEL_END, 1],
    shouldReduceMotion ? [0, 0, 0, 0] : [0, 0, 1, 1]
  );

  const carouselX = useTransform([carouselTravelProgress, localScrollProgress, localAutoplayProgress], ([travelProgress, progress, autoplay]) => {
    const rawProgress = Number(progress);
    const autoTravel = Number(autoplay);
    if (hasExitedLocalSection || rawProgress <= LOCAL_TRAVEL_START) return 0;
    if (hasLocalAutoplayPosition) return -autoTravel * carouselWidth;
    return -Number(travelProgress) * carouselWidth;
  });
  const sectionOpacity = useTransform(localScrollProgress, [0, 0.05, 0.84, 0.94, 1], [0.88, 1, 1, 0.18, 0]);
  const carouselOpacity = useTransform(localScrollProgress, [0, 0.06, 0.82, 0.9, 1], [0.15, 1, 1, 0, 0]);
  const activeImage = activeImageIndex === null ? null : CAROUSEL_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((location) => location.image === activeImage.src) ?? null : null;

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
      />
    </main>
  );
}
