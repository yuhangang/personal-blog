"use client";

import { AnimatePresence, motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Mail, Phone, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Inter, Libre_Caslon_Text, Noto_Serif_TC, Amiri, Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type WheelEvent } from "react";
import { createPortal } from "react-dom";
import { COASTAL_LOCATIONS } from "./data";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import type { CoastalMapProps } from "@/components/showcase/CoastalMap";

type ResettableMotionValue = {
  set: (value: number) => void;
  jump?: (value: number) => void;
};

const CAROUSEL_IMAGES = [
  {
    "src": "/images/pantai-timor/78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "alt": "Coastal photography 78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC00032.jpg",
    "alt": "Coastal photography DSC00032.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC00052.jpg",
    "alt": "Coastal photography DSC00052.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC00068.jpg",
    "alt": "Coastal photography DSC00068.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC00234.jpg",
    "alt": "Coastal photography DSC00234.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC00465.JPG",
    "alt": "Coastal photography DSC00465.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00516.JPG",
    "alt": "Coastal photography DSC00516.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00552.JPG",
    "alt": "Coastal photography DSC00552.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00587.JPG",
    "alt": "Coastal photography DSC00587.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00590.JPG",
    "alt": "Coastal photography DSC00590.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00608.JPG",
    "alt": "Coastal photography DSC00608.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00631.JPG",
    "alt": "Coastal photography DSC00631.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00638.JPG",
    "alt": "Coastal photography DSC00638.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00645.JPG",
    "alt": "Coastal photography DSC00645.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00649.JPG",
    "alt": "Coastal photography DSC00649.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00679.JPG",
    "alt": "Coastal photography DSC00679.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00710.JPG",
    "alt": "Coastal photography DSC00710.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00743.JPG",
    "alt": "Coastal photography DSC00743.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00756_2.JPG",
    "alt": "Coastal photography DSC00756_2.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00788.JPG",
    "alt": "Coastal photography DSC00788.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00799.JPG",
    "alt": "Coastal photography DSC00799.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00809.JPG",
    "alt": "Coastal photography DSC00809.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00845.JPG",
    "alt": "Coastal photography DSC00845.JPG",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC00854.JPG",
    "alt": "Coastal photography DSC00854.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC00932.JPG",
    "alt": "Coastal photography DSC00932.JPG"
  },
  {
    "src": "/images/pantai-timor/DSC07654.jpg",
    "alt": "Coastal photography DSC07654.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC07665_1.jpg",
    "alt": "Coastal photography DSC07665_1.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC07670_1.jpg",
    "alt": "Coastal photography DSC07670_1.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC07671.jpg",
    "alt": "Coastal photography DSC07671.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC07705.jpg",
    "alt": "Coastal photography DSC07705.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC07763_1.jpg",
    "alt": "Coastal photography DSC07763_1.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC07799_1.jpg",
    "alt": "Coastal photography DSC07799_1.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC07802.jpg",
    "alt": "Coastal photography DSC07802.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC07995.jpg",
    "alt": "Coastal photography DSC07995.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC08003_1.jpg",
    "alt": "Coastal photography DSC08003_1.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC08014.jpg",
    "alt": "Coastal photography DSC08014.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC08133_1.jpg",
    "alt": "Coastal photography DSC08133_1.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC08162.jpg",
    "alt": "Coastal photography DSC08162.jpg",
    "isPortrait": true
  },
  {
    "src": "/images/pantai-timor/DSC08235.jpg",
    "alt": "Coastal photography DSC08235.jpg"
  },
  {
    "src": "/images/pantai-timor/DSC09897.jpg",
    "alt": "Coastal photography DSC09897.jpg",
    "isPortrait": true
  }
];

const CoastalMap = dynamic<CoastalMapProps>(() => import("@/components/showcase/CoastalMap"), { ssr: false });

const LOCAL_TRAVEL_START = 0.1;
const LOCAL_TRAVEL_END = 0.86;
const LOCAL_TRAVEL_DISTANCE = LOCAL_TRAVEL_END - LOCAL_TRAVEL_START;
const LOCAL_RECENTER_DURATION_SECONDS = 1.8;
const LOCAL_RECENTER_IDLE_MS = 260;
const LOCAL_RECENTER_RELEASE_MS = 2200;

function getLocalArchiveTargetX() {
  const viewportWidth = window.innerWidth;
  return viewportWidth < 768 ? viewportWidth / 2 : viewportWidth * 0.64;
}

interface CarouselItemProps {
  item: typeof CAROUSEL_IMAGES[0];
  index: number;
  localScrollProgress: MotionValue<number>;
  onClick: () => void;
}

const CarouselItem = ({ item, index, localScrollProgress, onClick }: CarouselItemProps) => {
  const centerProgress = LOCAL_TRAVEL_START + (index / (CAROUSEL_IMAGES.length - 1)) * LOCAL_TRAVEL_DISTANCE;
  const itemProgressRange = [
    Math.max(0, centerProgress - 0.12),
    centerProgress,
    Math.min(1, centerProgress + 0.12),
  ];
  
  const scale = useTransform(localScrollProgress, 
    itemProgressRange, 
    [0.92, 1.05, 0.92]
  );
  const opacity = useTransform(localScrollProgress, 
    itemProgressRange, 
    [0.5, 1, 0.5]
  );

  return (
    <motion.div 
      onClick={onClick}
      style={{ scale, opacity }}
      className={`relative h-full ${item.isPortrait ? "aspect-[2/3]" : "aspect-square md:aspect-[3/2]"} flex shrink-0 bg-[#161715] overflow-hidden border border-[#e3e1da]/10 group cursor-pointer`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 60vw, 80vw"
        className="object-cover md:object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </motion.div>
  );
};

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
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

export default function PantaiTimorRedesign() {
  const shouldReduceMotion = useReducedMotion();
  const { lenis } = useLenis();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [hasExitedLocalSection, setHasExitedLocalSection] = useState(false);
  const lastOverlayWheelAt = useRef(0);
  const hasExitedLocalSectionRef = useRef(false);
  const isRecenteringRef = useRef(false);
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const recenterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        // Fallback for first frame/SSR
        setAnchors(prev => ({
          ...prev,
          start: { top: vh * 0.42, left: vw / 2 },
          end: { top: vw < 768 ? 36 : 60, left: vw / 2 }
        }));
      }
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    const timer = setTimeout(updatePos, 150);
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
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [menuOpen]);

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



  const localSectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

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

  const { scrollYProgress: localScrollProgress } = useScroll({
    target: localSectionRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    if (shouldReduceMotion) return;

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
          easing: (t) => 1 - Math.pow(1 - t, 5),
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
  }, [carouselWidth, lenis, localScrollProgress, shouldReduceMotion]);

  const almanacRef = useRef<HTMLElement>(null);


  const { scrollYProgress: almanacEntryProgress } = useScroll({
    target: almanacRef,
    offset: ["start end", "start start"]
  });
  const almanacRadius = useTransform(almanacEntryProgress, [0, 1], [48, 0]);

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
  const heroContainerWidth = useTransform(heroScrollProgress, [0, 1], [isMobile ? "80vw" : "60vw", "100vw"]);
  const heroContainerHeight = useTransform(heroContainerWidth, (w: string) => {
    if (isMobile) {
      if (w.endsWith("vw")) return `calc(${w} * 1.4)`; // Approx 2:3 portrait
      return "110vw";
    }
    // 3:2 landscape for desktop
    if (w.endsWith("vw")) {
      const val = parseFloat(w);
      if (val >= 98) return "100vh"; // Snap to full screen height at end
      return `calc(${w} / 1.5)`;
    }
    return "60vh";
  });
  const heroContainerRadius = useTransform(heroScrollProgress, [0, 1], [40, 0]);
  const secondaryHeroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroImageScale = useTransform(scrollY, [0, 1000], [1, 2.5]);
  const heroImageY = useTransform(scrollY, [0, 1000], [0, 420]);
  const heroImageOpacity = useTransform(scrollY, [650, 1050], [1, 0]);

  const carouselTravelProgress = useTransform(
    localScrollProgress,
    [0, LOCAL_TRAVEL_START, LOCAL_TRAVEL_END, 1],
    shouldReduceMotion ? [0, 0, 0, 0] : [0, 0, 1, 1]
  );
  const carouselX = useTransform([carouselTravelProgress, localScrollProgress], ([p, progress]) => {
    const travel = Number(p);
    const rawProgress = Number(progress);
    if (hasExitedLocalSection || rawProgress <= LOCAL_TRAVEL_START) return 0;
    return -travel * carouselWidth;
  });
  const sectionOpacity = useTransform(localScrollProgress, [0, 0.06, 0.86, 0.96, 1], [0.88, 1, 1, 0.2, 0]);
  const carouselOpacity = useTransform(
    localScrollProgress,
    [0, 0.08, 0.84, 0.94, 1],
    [0.15, 1, 1, 0, 0]
  );

  // Scroll-driven Navbar Animation (Using raw scrollY for instant response/no flicker)
  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 24]);
  const navBorderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  // Title Transforms
  const titleScale = useTransform(scrollY, [0, stickyScroll], [1, isMobile ? 0.58 : 0.18]);
  const titleLetterSpacing = useTransform(scrollY, [0, stickyScroll], ["-0.02em", "0.35em"]);
  
  // Landing positions (Transition between anchors)
  const titleX = useTransform(scrollY, [0, stickyScroll], ["-50%", "-50%"]);
  const titleY = useTransform(scrollY, [0, stickyScroll], ["-50%", "-50%"]); // Keep centered on anchor
  const titleLeft = useTransform(scrollY, [0, stickyScroll], [anchors.start.left, anchors.end.left]);
  const titleTop = useTransform(scrollY, [0, stickyScroll], [anchors.start.top, anchors.end.top]);
  
  const titleOpacityBase = useTransform(scrollY, [0, 10], [1, 1]); 
  
  // Initial entry animation
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
  const finalTitleY = useMotionTemplate`calc(${titleY} + ${entryY}px)`;
  const finalTitleBlur = useTransform(entryBlur, (b: number) => `blur(${b}px)`);

  const activeImage = activeImageIndex === null ? null : CAROUSEL_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((loc) => loc.image === activeImage.src) : null;
  const handleOverlayWheel = (event: WheelEvent<HTMLDivElement>) => {
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
        @media (min-width: 768px) {
          main { 
            --nav-px: 2.5rem !important; 
            --nav-py: 1.25rem !important; 
          }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* Navigation */}
      <motion.nav 
        initial={false}
        style={{ 
          backgroundColor: useTransform(navBgOpacity, [0, 1], ["rgba(16, 17, 15, 0)", "rgba(16, 17, 15, 0)"]),
          backdropFilter: useTransform(navBlur, (v) => `blur(${v}px)`),
          borderBottom: useTransform(navBorderOpacity, (v) => `1px solid rgba(227, 225, 218, ${v})`)
        }}
        className="fixed top-0 left-0 w-full z-[60] grid grid-cols-3 items-center !px-4 h-[72px] md:h-20 md:grid-cols-[1fr_auto_1fr] md:!px-10 bg-transparent transition-none"
      >
        <div className="flex items-center gap-6 md:gap-10">
          <div className="hidden md:flex gap-8 lg:gap-12 items-center">
            {["GALLERY", "ARCHIVE", "OUR MANIFESTO", "ABOUT"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`font-sans text-[0.6rem] lg:text-[0.65rem] font-bold uppercase tracking-[0.25em] transition-colors whitespace-nowrap pb-1 ${item === "GALLERY" ? "text-[#e3e1da] border-b border-[#e3e1da]/50" : "text-[#e3e1da]/50 hover:text-[#e3e1da]"}`}
              >
                {item}
              </a>
            ))}
          </div>
          {/* Mobile Home/Logo Link - Removed on mobile as requested */}
          <div className="hidden md:flex items-center">
             <Link href="/" className="font-sans text-[0.7rem] font-black uppercase tracking-[0.3em] text-[#e3e1da]">
                N
             </Link>
          </div>
          <div className="md:hidden" /> {/* Empty spacer for grid alignment */}
        </div>
        
        {/* Spacer for center alignment of the animated title - Fixed dimensions to prevent shift */}
        <div ref={navRef} className="flex items-center justify-center pointer-events-none min-w-0 md:min-w-[20rem]">
           <span className={`${cormorant.className} text-[1.85rem] md:text-[2rem] leading-none invisible font-normal tracking-tight`}>PANTAI TIMOR</span>
        </div>

        <div className="flex justify-end items-center">
          <button 
            className="hidden md:flex border border-[#e3e1da]/20 !px-8 !py-3 font-sans text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#e3e1da] hover:bg-[#e3e1da] hover:text-[#10110F] transition-all"
          >
            CONTACT
          </button>
          <button 
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center justify-center text-[#e3e1da] group"
            aria-label="Open menu"
          >
            <div className="flex flex-col gap-2 items-end">
              <div className="w-7 h-[1px] bg-[#e3e1da]/90" />
              <div className="w-5 h-[1px] bg-[#e3e1da]/90" />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#10110F] !p-6 md:hidden overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute -bottom-10 -right-20 pointer-events-none opacity-[0.03] select-none">
               <h2 className={`${cormorant.className} text-[25rem] leading-none whitespace-nowrap`}>PANTAI</h2>
            </div>
            
            {/* Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(43,65,71,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex items-center justify-between !mb-12 relative z-10 grid grid-cols-3 w-full">
              <div /> {/* Left spacer */}
              <div className="flex justify-center">
                <span className={`${cormorant.className} text-[1.85rem] leading-none text-[#f2f0ea] whitespace-nowrap tracking-tight`}>PANTAI TIMOR</span>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center text-[#e3e1da] group"
                  aria-label="Close menu"
                >
                  <div className="relative w-7 h-7 flex items-center justify-center">
                     <div className="absolute w-7 h-[1px] bg-[#e3e1da] rotate-45" />
                     <div className="absolute w-7 h-[1px] bg-[#e3e1da] -rotate-45" />
                  </div>
                </button>
              </div>
            </div>
            
            <nav className="flex flex-col gap-10 !pl-4 relative z-10">
              {["GALLERY", "ARCHIVE", "OUR MANIFESTO", "ABOUT", "CONTACT"].map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  key={item}
                  className="flex items-start gap-4 group cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    // Add smooth scroll behavior if needed
                  }}
                >
                  <span className="font-sans text-[0.6rem] font-bold text-[#e3e1da]/30 pt-4">0{idx + 1}</span>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`${cormorant.className} text-[3rem] font-light uppercase tracking-[0.05em] text-[#e3e1da] group-hover:text-[#e3e1da]/60 transition-colors leading-tight`}
                  >
                    {item}
                  </a>
                </motion.div>
              ))}
            </nav>
            
            <div className="!mt-auto !pb-12" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Sticky Expansion Transition */}
      <section 
        ref={heroRef}
        className="sticky top-0 w-full h-[100svh] min-h-[680px] overflow-hidden z-0"
      >
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center !px-4 !pt-24"
        >
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1500px] h-[700px] opacity-40 mix-blend-screen select-none pointer-events-none flex items-center justify-center">
           <motion.div 
             style={{ 
               y: heroImageY, 
               scale: heroImageScale, 
               opacity: heroImageOpacity,
               width: heroContainerWidth,
               height: heroContainerHeight,
               borderRadius: heroContainerRadius
             }} 
             className="relative overflow-hidden"
           >
              <Image src="/images/pantai-timor/DSC00552.JPG" alt="Tree Hero" fill className="object-cover" priority loading="eager" sizes="(min-width: 1024px) 1000px, (min-width: 768px) 800px, 85vw" />
           </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div ref={spacerRef} className="invisible pointer-events-none">
            <h1 className={`${cormorant.className} !text-[clamp(2.1rem,13vw,11rem)] !leading-none !tracking-tight font-normal`}>PANTAI TIMOR</h1>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
          <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#e3e1da]/30">
            SCROLL
          </span>
          <div className="h-20 w-[1px] bg-[#e3e1da]/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1/2 bg-[#e3e1da]/60 animate-[scrollDown_2.5s_ease-in-out_infinite]" />
          </div>
        </motion.div>
        </motion.div>
      </section>

      {/* The animated title layer (Separate from fading background) */}
      <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden h-[100svh]">
        <motion.h1 
          style={{ 
            scale: titleScale,
            x: titleX,
            y: finalTitleY,
            left: titleLeft,
            top: titleTop,
            opacity: titleOpacity,
            filter: finalTitleBlur,
            letterSpacing: titleLetterSpacing,
            position: "fixed",
            transformOrigin: "center center"
          }}
          className={`${cormorant.className} !mb-0 !text-[clamp(2.1rem,13vw,11rem)] !leading-none !tracking-tight text-center !text-[#f2f0ea] whitespace-nowrap font-normal`}
        >
          PANTAI TIMOR
        </motion.h1>

        <motion.div 
          style={{ 
            x: titleX,
            y: useTransform(finalTitleY, (y: string) => `calc(${y} - clamp(3.8rem, 12vw, 10rem))`),
            left: titleLeft,
            top: titleTop,
            scale: titleScale,
            opacity: secondaryHeroOpacity,
            filter: finalTitleBlur,
            position: "fixed",
            transformOrigin: "center center"
          }}
          className="flex items-center gap-8 md:gap-14 text-[#e3e1da]/40 pointer-events-none whitespace-nowrap w-full justify-center"
        >
           <span className={`${notoSerifTC.className} text-3xl md:text-6xl tracking-[0.2em] md:tracking-[0.4em] ml-[0.2em] md:ml-[0.4em]`}>東海岸</span>
           <span className="w-1.5 h-1.5 rounded-full bg-[#e3e1da]/20"></span>
           <span className={`${amiri.className} text-3xl md:text-6xl`} dir="rtl">ڤنتاي تيمور</span>
        </motion.div>

        <motion.p 
          style={{ 
            x: titleX,
            y: useTransform(finalTitleY, (y: string) => `calc(${y} + clamp(4.5rem, 14vw, 11.5rem))`),
            left: titleLeft,
            top: titleTop,
            scale: titleScale,
            opacity: secondaryHeroOpacity,
            filter: finalTitleBlur,
            position: "fixed",
            transformOrigin: "center center"
          }}
          className="!mb-0 max-w-[18rem] text-center font-sans !text-[0.92rem] font-bold uppercase !leading-[1.5] !tracking-[0.1em] !text-[#e3e1da]/50 pointer-events-none md:max-w-none md:!text-[1.5rem] md:!tracking-[0.25em] text-balance w-full"
        >
          A PHOTOGRAPHIC JOURNEY<br />TO THE EASTERN ENCLAVE
        </motion.p>
      </div>



      {/* The Coastal Almanac Section - Slides over Hero */}
      <section ref={almanacRef} className="relative w-full !pb-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
        <div className="max-w-screen-2xl w-full flex flex-col items-center">
          <motion.div 
            style={{ borderRadius: almanacRadius }}
            className="relative w-full aspect-[3/4] md:aspect-[18/9] overflow-hidden border border-[#e3e1da]/10 group md:rounded-2xl"
          >
            <div className="absolute inset-0 w-full">
              <Image 
                src="/images/pantai-timor/DSC07763_1.jpg" 
                alt="Fishing Boat" 
                fill 
                className="object-cover object-right md:object-center" 
                sizes="(min-width: 768px) 90vw, calc(100vw - 48px)" 
              />
            </div>
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 flex flex-col items-center justify-center p-6 md:p-12">
              <div className="max-w-[48rem] w-full flex flex-col items-center text-center">
                <motion.h3 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="font-sans !mb-0 !text-[0.8rem] md:!text-[1rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]"
                >
                  THE COASTAL ALMANAC
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`${libreCaslon.className} !mb-0 !mt-8 md:!mt-12 !text-[1.5rem] md:!text-[2.5rem] !leading-[1.3] !text-[#e3e1da] text-balance drop-shadow-xl`}
                >
                  Documenting the ebb and flow of a timeless horizon. Every frame is a testament to the persistent dialogue between the shore and the sea.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="!mt-12 md:!mt-16 flex items-center gap-10 text-[#e3e1da]/50"
                >
                  <button className="hover:text-[#e3e1da] transition-colors !p-2" aria-label="Mail"><Mail className="w-5 h-5" /></button>
                  <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
                  <button className="hover:text-[#e3e1da] transition-colors !p-2" aria-label="Phone"><Phone className="w-5 h-5" /></button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Village Rhythms Section */}
      <section className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-[#10110F]">
        <div className="max-w-screen-2xl w-full">
          <div className="relative w-full aspect-[4/5] md:aspect-[16/8] overflow-hidden border border-[#e3e1da]/10 group">
            {/* Split Image Background */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
              <div className="relative h-full w-full overflow-hidden">
                <Image 
                  src="/images/pantai-timor/DSC00645.JPG" 
                  alt="Village Life" 
                  fill 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" 
                  sizes="(min-width: 768px) 50vw, 100vw" 
                />
              </div>
              <div className="relative h-full w-full overflow-hidden border-t md:border-t-0 md:border-l border-[#e3e1da]/10">
                <Image 
                  src="/images/pantai-timor/DSC00788.JPG" 
                  alt="Coastal House" 
                  fill 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" 
                  sizes="(min-width: 768px) 50vw, 100vw" 
                />
              </div>
            </div>
            
            {/* Unified Overlay Content */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 md:p-16 text-center">
              <div className="max-w-[48rem] flex flex-col items-center">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="font-sans !mb-0 !text-[0.7rem] md:!text-[0.85rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]"
                >
                  VILLAGE RHYTHMS
                </motion.h3>
                
                <motion.h4 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`${cormorant.className} !mt-8 md:!mt-12 !mb-0 !text-[clamp(2.5rem,8vw,4rem)] !leading-[1.1] !text-[#e3e1da] text-balance font-semibold`}
                >
                  Portraits of the Tide
                </motion.h4>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="!mb-0 !mt-8 md:!mt-10 !text-[0.95rem] md:!text-[1.1rem] !leading-[1.8] !text-[#e3e1da]/80 text-pretty font-medium"
                >
                  The pulse of the coast is best felt through its people and the spaces they inhabit. Vibrant colors stand in defiance of the salty winds, creating a vivid tapestry of daily life.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="!mt-12 md:!mt-16 flex items-center gap-10 text-[#e3e1da]/40"
                >
                  <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
                  <div className="w-2 h-2 rounded-full border border-[#e3e1da]/30" />
                  <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coastal Geography Section (Map) */}
      <section className="relative w-full !py-28 md:!py-44 !px-4 md:!px-8 flex flex-col items-center z-10 overflow-hidden bg-[#10110F]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0c0a] to-transparent" />
        <div className="max-w-[1700px] w-full">
          <div className="grid gap-10 !mb-14 md:!mb-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(21rem,0.52fr)] lg:items-end">
            <div>
              <h3 className="font-sans !mb-0 !text-[0.65rem] font-black uppercase !tracking-[0.34em] !text-[#e3e1da] md:!tracking-[0.4em]">
                COASTAL GEOGRAPHY
              </h3>
              <h4 className={`${cormorant.className} !mt-8 !mb-0 max-w-[42rem] !text-[clamp(2.8rem,10vw,4rem)] !leading-[1.02] !text-[#e3e1da] text-balance font-semibold`}>
                The Eastern Enclave
              </h4>
            </div>
            <p className="max-w-[31rem] !mb-0 !text-[0.85rem] md:!text-[0.95rem] !leading-[2] !text-[#e3e1da]/52 text-pretty lg:justify-self-end">
              Spanning the peninsula&apos;s eastern edge, this map traces islands, beaches, lakes, heritage sites, and rainforest thresholds from Bachok to the ancient rocks of Dungun.
            </p>
          </div>
          
          <div className="relative bg-[#171813] shadow-[0_40px_120px_rgba(0,0,0,0.46)]">
            <div className="relative w-full aspect-[4/5] min-h-[520px] overflow-hidden bg-[#161715] sm:aspect-[16/11] md:aspect-[21/9] md:min-h-[560px]">
              <CoastalMap onImageClick={(src) => {
                const index = CAROUSEL_IMAGES.findIndex(img => img.src === src);
                if (index !== -1) setActiveImageIndex(index);
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* The Local Section (Horizontal Scroll) */}
      <section ref={localSectionRef} className="relative w-full h-[1100svh] md:h-[1350svh] bg-[#10110F] z-10">
        <motion.div style={{ opacity: hasExitedLocalSection ? 1 : sectionOpacity }} className="sticky top-0 h-[100svh] w-full flex items-start overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#10110F] via-[#10110F]/80 to-transparent z-20 pointer-events-none md:h-32" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#10110F] to-transparent z-40 pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-[#10110F] via-[#10110F]/90 to-transparent z-20 pointer-events-none" />

          <div className="relative w-full h-full max-w-[1700px] !mx-auto !px-4 !pt-32 md:!pt-0 md:!px-10 lg:!px-16 flex flex-col items-start md:flex-row md:items-center">
            
            {/* Title & Text (Always on top with shadow behind) */}
            <div className="relative z-30 flex w-[calc(100vw-3rem)] max-w-[28rem] flex-col justify-start pt-44 pb-10 shrink-0 pointer-events-none md:justify-center md:pt-0">
              <div className="pointer-events-auto">
                <h2 className="font-sans !text-xs font-black uppercase !tracking-[0.34em] !text-[#e3e1da] !mb-10 md:!tracking-[0.4em] drop-shadow-2xl">
                  THE LOCAL
                </h2>
                <h3 className={`${cormorant.className} !text-[clamp(3.8rem,14vw,4.5rem)] md:!text-[4.5rem] !leading-[1.05] !tracking-normal !text-[#e3e1da] !mb-10 text-balance drop-shadow-2xl font-semibold`}>
                  The Living<br />Artifact
                </h3>
                <p className="max-w-full md:max-w-[26rem] !text-sm md:!text-base !leading-[2] !text-[#e3e1da] !mb-14 text-pretty drop-shadow-lg">
                  Our collection spans decades of coastal memories. We preserve not just the images, but the atmosphere of the Timor coast, treating each photographic practice with a sense of urgency.
                </p>
              </div>
            </div>

            {/* Horizontal Carousel (Centered in remaining bottom space) */}
            <div className="relative z-10 flex-1 w-full h-full flex items-center">
              <motion.div
                ref={carouselRef}
                id="pantai-timor-scroller"
                style={{ x: carouselX, opacity: hasExitedLocalSection ? 1 : carouselOpacity }}
                className="flex gap-10 md:gap-28 h-[38svh] min-h-[280px] max-h-[400px] md:h-[74svh] md:max-h-none items-center will-change-transform !pl-16 sm:!pl-[30rem] md:!pl-[42rem] w-max pr-[20vw]"
              >
                {CAROUSEL_IMAGES.map((item, idx) => (
                  <CarouselItem 
                    key={idx}
                    item={item}
                    index={idx}
                    localScrollProgress={localScrollProgress}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </motion.div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="relative w-full !py-48 md:!py-64 overflow-hidden flex items-center justify-center !px-4 bg-[#10110F]">
        {/* Wavy gradient background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
          
          <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 opacity-20">
             <div className="w-[200%] h-full flex items-center animate-[slideLeft_20s_linear_infinite]">
                 <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-1/2 h-full">
                     <path d="M0,100 C250,200 250,0 500,100 C750,200 750,0 1000,100 L1000,200 L0,200 Z" fill="rgba(255,255,255,0.02)" />
                 </svg>
                 <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-1/2 h-full">
                     <path d="M0,100 C250,200 250,0 500,100 C750,200 750,0 1000,100 L1000,200 L0,200 Z" fill="rgba(255,255,255,0.02)" />
                 </svg>
             </div>
          </div>
        </div>

        <style>{`
          @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <div className="relative z-10 max-w-6xl text-center flex flex-col items-center">
          <span className="text-[#e3e1da]/20 text-3xl md:text-5xl font-serif leading-none block !mb-10">&ldquo;</span>
          <blockquote className={`${libreCaslon.className} !text-[1.6rem] md:!text-[2.2rem] !leading-[1.55] !text-[#e3e1da] !mb-12 text-balance`}>
            Visual manifestations transcend the mere act of telling a story. It is the lifeblood of our culture in the making.
          </blockquote>
          <cite className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#e3e1da]/30 not-italic md:tracking-[0.25em]">
            — Unknown Coastal Author
          </cite>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#e3e1da]/10 !px-4 !py-20 md:!px-10 bg-[#10110F]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start lg:items-end gap-16 max-w-[1700px] !mx-auto">
          <div className="flex flex-col gap-12 md:gap-16">
            <h2 className={`${libreCaslon.className} !mb-0 !text-[clamp(3.25rem,12vw,5rem)] !leading-none !tracking-normal !text-[#e3e1da]`}>
              Pantai Timor
            </h2>
            <div className="flex max-w-[44rem] flex-wrap gap-x-8 gap-y-5 md:gap-x-16">
              {["collection", "library", "contact & locations", "careers"].map((link) => (
                <a key={link} href={`#${link.replace(/\s+/g, '-')}`} className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-left lg:text-right max-w-sm">
            <p className="!mb-0 font-sans !text-[10px] md:!text-xs font-medium uppercase !tracking-[0.18em] md:!tracking-widest !text-[#e3e1da]/30 !leading-relaxed lg:text-right">
              All rights reserved. Random studio and other entities.<br className="hidden md:block" />
              <span className="md:mt-1 block">© 2024 Random Studio.</span>
            </p>
          </div>
        </div>
      </footer>
      {/* Full-Screen Image Viewer (Lightbox) */}
      {portalRoot && createPortal(
      <AnimatePresence>
        {activeImageIndex !== null && activeImage && (
          <motion.div 
            initial={false} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex h-[100svh] w-full touch-none items-center justify-center overflow-hidden overscroll-none"
            onClick={() => setActiveImageIndex(null)}
            onWheelCapture={handleOverlayWheel}
          >
            <div className="absolute inset-0 pointer-events-none bg-[#151612]/38 backdrop-blur-[56px] backdrop-saturate-[180%]" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(227,225,218,0.12),transparent_60%)]" />
            <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-[#e3e1da]/12 bg-[#151612]/42 !px-4 !py-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[32px] backdrop-saturate-[180%] md:!px-8" onClick={(e) => e.stopPropagation()}>
              <div className="min-w-0">
                <p className="!mb-0 font-sans !text-[0.56rem] font-black uppercase !leading-none !tracking-[0.26em] !text-[#e3e1da]/42 md:!tracking-[0.34em]">
                  Pantai Timor Archive
                </p>
                <p className="!mb-0 !mt-2 truncate font-sans !text-[0.7rem] font-bold uppercase !leading-none !tracking-[0.2em] !text-[#e3e1da] md:!text-[0.78rem]">
                  {activeLocation?.name || activeImage.alt}
                </p>
              </div>
              <button 
                type="button"
                aria-label="Close photo viewer"
                onClick={() => setActiveImageIndex(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e3e1da]/16 bg-[#e3e1da]/8 text-[#e3e1da] backdrop-blur-xl transition-colors duration-200 hover:border-[#e3e1da]/32 hover:bg-[#e3e1da]/14 hover:text-[#e3e1da] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button 
              type="button"
              aria-label="Previous photo"
              disabled={activeImageIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (activeImageIndex > 0) setActiveImageIndex(activeImageIndex - 1);
              }}
              className={`absolute bottom-8 left-4 z-50 flex h-12 w-12 items-center justify-center border border-[#e3e1da]/14 bg-[#10110F]/72 text-[#e3e1da] backdrop-blur-xl transition-all duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:left-8 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 ${activeImageIndex === 0 ? 'opacity-25' : ''}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button 
              type="button"
              aria-label="Next photo"
              disabled={activeImageIndex === CAROUSEL_IMAGES.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                if (activeImageIndex < CAROUSEL_IMAGES.length - 1) setActiveImageIndex(activeImageIndex + 1);
              }}
              className={`absolute bottom-8 right-4 z-50 flex h-12 w-12 items-center justify-center border border-[#e3e1da]/14 bg-[#10110F]/72 text-[#e3e1da] backdrop-blur-xl transition-all duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 md:right-8 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 ${activeImageIndex === CAROUSEL_IMAGES.length - 1 ? 'opacity-25' : ''}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.div 
              key={activeImageIndex}
              initial={{ scale: 0.985, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.985, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full w-full transform-gpu items-center justify-center pointer-events-none !px-4 !pb-28 !pt-24 will-change-transform md:!px-28 md:!pb-14 md:!pt-28"
            >
              <div className="grid w-full max-w-[92rem] grid-cols-1 items-center gap-7 pointer-events-auto lg:grid-cols-[minmax(0,1fr)_20rem]" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex h-[40vh] w-full items-center justify-center border border-[#e3e1da]/10 bg-[#151612]/60 !p-2 shadow-[0_34px_110px_rgba(0,0,0,0.62)] sm:h-[55vh] lg:h-[72vh]">
                  <Image 
                    src={activeImage.src} 
                    alt={activeImage.alt}
                    fill
                    className="object-contain"
                    priority
                    sizes="90vw"
                  />
                </div>
                
                <motion.aside
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-l border-[#e3e1da]/12 !pl-5 text-left md:!pl-7"
                >
                  <p className="!mb-5 font-sans !text-[0.58rem] font-black uppercase !tracking-[0.28em] !text-[#e3e1da]/38">
                    {String(activeImageIndex + 1).padStart(2, "0")} / {String(CAROUSEL_IMAGES.length).padStart(2, "0")}
                  </p>
                  <h4 className={`${libreCaslon.className} !mb-0 !text-[2rem] !leading-[1.05] !tracking-normal !text-[#e3e1da] text-balance md:!text-[2.6rem]`}>
                    {activeLocation?.name || activeImage.alt}
                  </h4>
                  <p className="!mb-0 !mt-6 font-sans !text-[0.84rem] !leading-[2] !text-[#e3e1da]/52 text-pretty">
                    {activeLocation?.description || "A frame from the eastern coast archive."}
                  </p>
                </motion.aside>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      portalRoot
      )}
    </main>
  );
}
