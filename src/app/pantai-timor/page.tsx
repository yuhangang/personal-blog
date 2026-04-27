"use client";

import { Libre_Caslon_Text, Inter } from "next/font/google";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Mail, Phone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type WheelEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { COASTAL_LOCATIONS } from "./data";

const CAROUSEL_IMAGES = [
  { src: "/images/pantai-timor/DSC00052.jpg", alt: "Coastal Water Ripples" },
  { src: "/images/pantai-timor/DSC00068.jpg", alt: "Sunset at the beach" },
  { src: "/images/pantai-timor/DSC00234.jpg", alt: "Island Peaks", isSpecial: true },
  { src: "/images/pantai-timor/DSC00465.JPG", alt: "Tree Focus" },
  { src: "/images/pantai-timor/DSC00516.JPG", alt: "Boat Detail" },
  { src: "/images/pantai-timor/DSC00552.JPG", alt: "Tree Focus 2" },
  { src: "/images/pantai-timor/DSC00587.JPG", alt: "Coastal Water Ripples 2" },
  { src: "/images/pantai-timor/DSC00590.JPG", alt: "Sand and Sea" },
  { src: "/images/pantai-timor/DSC00608.JPG", alt: "Horizon" },
  { src: "/images/pantai-timor/DSC00638.JPG", alt: "Nature" },
  { src: "/images/pantai-timor/DSC00649.JPG", alt: "Waves" },
  { src: "/images/pantai-timor/DSC00679.JPG", alt: "Boat" },
  { src: "/images/pantai-timor/DSC00710.JPG", alt: "Coast" },
  { src: "/images/pantai-timor/DSC00743.JPG", alt: "Fishing" },
  { src: "/images/pantai-timor/DSC00756_2.JPG", alt: "Life" },
  { src: "/images/pantai-timor/DSC00788.JPG", alt: "View" },
  { src: "/images/pantai-timor/DSC00809.JPG", alt: "Sky" },
  { src: "/images/pantai-timor/DSC00845.JPG", alt: "Ocean" },
  { src: "/images/pantai-timor/DSC00932.JPG", alt: "Beach" },
  { src: "/images/pantai-timor/DSC07654.jpg", alt: "Sunset" },
  { src: "/images/pantai-timor/DSC07665_1.jpg", alt: "Light" },
];

const HyogenCursor = dynamic(() => import("@/components/showcase/HyogenCursor"), { ssr: false });
const CoastalMap = dynamic(() => import("@/components/showcase/CoastalMap"), { ssr: false });

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

export default function PantaiTimorRedesign() {
  const shouldReduceMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasExitedLocalSection, setHasExitedLocalSection] = useState(false);
  const lastOverlayWheelAt = useRef(0);
  const hasExitedLocalSectionRef = useRef(false);
  const isLightboxOpen = activeImageIndex !== null;

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

  useEffect(() => {
    setIsMounted(true);
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
        setCarouselWidth(childW - parentW);
      }
    };
    updateWidth();
    
    // Use ResizeObserver to reliably catch image load width changes
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

  const almanacRef = useRef<HTMLElement>(null);
  const { scrollYProgress: almanacScrollProgress } = useScroll({
    target: almanacRef,
    offset: ["start end", "end start"]
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

  const carouselTravelProgress = useTransform(
    localScrollProgress,
    [0, 0.1, 0.86, 1],
    shouldReduceMotion ? [0, 0, 0, 0] : [0, 0, 1, 1]
  );
  const carouselSpring = useSpring(carouselTravelProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
    restDelta: 0.001,
  });
  const carouselX = useTransform([carouselSpring, localScrollProgress], ([p, progress]) => {
    const travel = Number(p);
    const rawProgress = Number(progress);
    if (hasExitedLocalSection || rawProgress <= 0.1) return 0;
    return -travel * carouselWidth;
  });
  const sectionOpacity = useTransform(localScrollProgress, [0, 0.06, 0.86, 0.96, 1], [0.88, 1, 1, 0.2, 0]);
  const carouselOpacity = useTransform(
    localScrollProgress,
    [0, 0.08, 0.84, 0.94, 1],
    [0.15, 1, 1, 0, 0]
  );
  const activeImage = activeImageIndex === null ? null : CAROUSEL_IMAGES[activeImageIndex];
  const activeLocation = activeImage ? COASTAL_LOCATIONS.find((loc) => loc.image === activeImage.src) : null;
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

  return (
    <main className={`${inter.className} relative min-h-screen bg-[#10110F] text-[#e3e1da] selection:bg-[#e3e1da] selection:text-[#10110F]`}>
      <HyogenCursor />
      
      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 grid grid-cols-[1fr_auto] items-center gap-6 !px-4 !py-7 md:grid-cols-[1fr_auto_1fr] md:!px-10 md:!py-10">
        <div className="min-w-0">
          <span className="font-sans text-[0.72rem] font-black uppercase tracking-[0.28em] text-[#e3e1da] md:text-[0.78rem] md:tracking-[0.35em] whitespace-nowrap">
            PANTAI TIMOR
          </span>
        </div>
        
        <div className="hidden md:flex justify-center gap-10 lg:gap-16 items-center">
          {["GALLERY", "ARCHIVE", "OUR MANIFESTO", "ABOUT"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className={`font-sans text-[0.68rem] font-bold uppercase tracking-[0.25em] transition-colors whitespace-nowrap pb-1 ${item === "GALLERY" ? "text-[#e3e1da] border-b border-[#e3e1da]/50" : "text-[#e3e1da]/50 hover:text-[#e3e1da]"}`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="border border-[#e3e1da]/20 !px-6 !py-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#e3e1da] hover:bg-[#e3e1da] hover:text-[#10110F] transition-all md:!px-8 md:text-[0.72rem] md:tracking-[0.2em]">
            CONTACT
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[100svh] min-h-[680px] flex flex-col items-center justify-center !px-4 !pt-24">
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1500px] h-[700px] opacity-40 mix-blend-screen select-none pointer-events-none flex items-center justify-center">
           <motion.div style={{ y: scrollY, scale: heroImageScale }} className="relative w-[400px] h-[500px] md:w-[800px] md:h-[600px] lg:w-[1000px] lg:h-[550px] rounded-[100px] overflow-hidden">
              <Image src="/images/pantai-timor/DSC00552.JPG" alt="Tree Hero" fill className="object-cover" priority loading="eager" sizes="(min-width: 1024px) 1000px, (min-width: 768px) 800px, 400px" />
           </motion.div>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex w-full max-w-[1400px] flex-col items-center !mt-[-8vh]">
          <div className={`${libreCaslon.className} flex items-center gap-10 md:gap-14 text-[#e3e1da]/40 mb-8 md:mb-12`}>
             <span className="text-xl md:text-2xl tracking-[0.4em] md:tracking-[0.8em] ml-[0.4em] md:ml-[0.8em]">東海岸</span>
             <span className="w-1.5 h-1.5 rounded-full bg-[#e3e1da]/20"></span>
             <span className="text-xl md:text-2xl" dir="rtl">ڤنتاي تيمور</span>
          </div>
          <h1 className={`${libreCaslon.className} !mb-0 !text-[clamp(4.25rem,18vw,11rem)] !leading-[0.86] !tracking-normal text-center !text-[#f2f0ea] text-balance`}>
            PANTAI TIMOR
          </h1>
          <p className="!mb-0 !mt-8 max-w-[22rem] text-center font-sans !text-[0.55rem] font-bold uppercase !leading-[2.35] !tracking-[0.3em] !text-[#e3e1da]/50 md:!mt-12 md:max-w-none md:!text-[0.65rem] md:!tracking-[0.5em]">
            A SEAFOOD JOURNEY TO THE EASTERN ENCLAVE
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
          <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#e3e1da]/30">
            SCROLL
          </span>
          <div className="h-20 w-[1px] bg-[#e3e1da]/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1/2 bg-[#e3e1da]/60 animate-[scrollDown_2.5s_ease-in-out_infinite]" />
          </div>
        </motion.div>

        {/* Large faded hero text */}
        <div className="absolute bottom-[-1vh] md:bottom-[-3vh] w-full !px-4 text-center pointer-events-none select-none z-0">
           <motion.h2 style={{ y: heroY }} className="font-sans !mb-0 !text-[clamp(3.4rem,14vw,13rem)] font-black uppercase !tracking-normal !text-[#e3e1da]/[0.02] !leading-none whitespace-nowrap">
             PANTAI TIMOR
           </motion.h2>
        </div>
      </section>

      {/* The Coastal Almanac Section */}
      <section ref={almanacRef} className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
        <div className="max-w-screen-2xl w-full flex flex-col items-center">
          <div className="relative w-full aspect-[16/9] md:aspect-[18/9] overflow-hidden border border-[#e3e1da]/10 group rounded-sm md:rounded-2xl">
            <motion.div 
              style={{ y: almanacImageY }} 
              className="absolute inset-x-0 -top-[30%] -bottom-[30%] w-full"
            >
              <Image 
                src="/images/pantai-timor/DSC07763_1.jpg" 
                alt="Fishing Boat" 
                fill 
                className="object-cover transition-transform duration-[2s] ease-out" 
                sizes="(min-width: 768px) 90vw, calc(100vw - 48px)" 
              />
            </motion.div>
            
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
          </div>
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
                  className={`${libreCaslon.className} !mt-8 md:!mt-12 !mb-0 !text-[2.2rem] md:!text-[4rem] !leading-[1.1] !text-[#e3e1da] text-balance`}
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
      <section className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-[#10110F]">
        <div className="max-w-[1700px] w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center max-w-[32rem] mb-20 md:mb-32">
            <h3 className="font-sans !mb-0 !text-[0.65rem] font-black uppercase !tracking-[0.34em] !text-[#e3e1da] md:!tracking-[0.4em]">
              COASTAL GEOGRAPHY
            </h3>
            <h4 className={`${libreCaslon.className} !mt-10 !mb-0 !text-[2rem] md:!text-[3rem] !leading-[1.1] !text-[#e3e1da] text-balance`}>
              The Eastern Enclave
            </h4>
            <p className="!mb-0 !mt-8 !text-[0.85rem] md:!text-[0.95rem] !leading-[2] !text-[#e3e1da]/50 text-pretty">
              Spanning the length of the peninsula&apos;s eastern edge, our journey explores the unique character of each settlement, from the northern gates of Bachok to the ancient rocks of Dungun.
            </p>
          </div>
          
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[400px] overflow-hidden border border-[#e3e1da]/10 bg-[#161715]">
            <CoastalMap onImageClick={(src) => {
              const index = CAROUSEL_IMAGES.findIndex(img => img.src === src);
              if (index !== -1) setActiveImageIndex(index);
            }} />
          </div>
        </div>
      </section>

      {/* The Local Section (Horizontal Scroll) */}
      <section ref={localSectionRef} className="relative w-full h-[800svh] md:h-[1000svh] bg-[#10110F] z-10">
        <motion.div style={{ opacity: hasExitedLocalSection ? 1 : sectionOpacity }} className="sticky top-0 h-[100svh] w-full flex items-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#10110F] to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#10110F] to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-full md:w-[62%] bg-gradient-to-r from-[#10110F] via-[#10110F]/90 to-transparent z-20 pointer-events-none" />

          <div className="relative w-full h-full max-w-[1700px] !mx-auto !px-4 md:!px-10 lg:!px-16 flex items-center">
            
            {/* Title & Text (Always on top with shadow) */}
            <div className="relative z-30 flex w-[calc(100vw-3rem)] max-w-[28rem] flex-col justify-center shrink-0 pointer-events-none">
              <div className="pointer-events-auto">
                <h2 className="font-sans !text-xs font-black uppercase !tracking-[0.34em] !text-[#e3e1da] !mb-10 md:!tracking-[0.4em] drop-shadow-2xl">
                  THE LOCAL
                </h2>
                <h3 className={`${libreCaslon.className} !text-[clamp(3.25rem,10vw,4.5rem)] md:!text-[4.5rem] !leading-[1.05] !tracking-normal !text-[#e3e1da] !mb-10 text-balance drop-shadow-2xl`}>
                  The Living<br />Artifact
                </h3>
                <p className="max-w-full md:max-w-[26rem] !text-sm md:!text-base !leading-[2] !text-[#e3e1da] !mb-14 text-pretty drop-shadow-lg">
                  Our collection spans decades of coastal memories. We preserve not just the images, but the atmosphere of the Timor coast, treating each photographic practice with a sense of urgency.
                </p>
                <button className="self-start font-sans text-left text-xs font-bold uppercase leading-relaxed tracking-[0.18em] text-[#e3e1da] hover:text-[#e3e1da]/60 transition-colors flex items-center gap-3 md:tracking-[0.2em] drop-shadow-md">
                  EXPLORE THE COLLECTION <span className="text-base font-light">+</span>
                </button>
              </div>
            </div>

            {/* Horizontal Carousel (Scrolling behind/under the title) */}
            <div className="absolute inset-0 z-10 flex items-center">
		              <motion.div 
		                ref={carouselRef}
		                style={{ x: carouselX, opacity: hasExitedLocalSection ? 1 : carouselOpacity }} 
		                className="flex gap-10 md:gap-28 h-[58svh] md:h-[74svh] items-center will-change-transform !pl-[24rem] sm:!pl-[30rem] md:!pl-[42rem] w-max pr-[20vw]"
		              >
                {CAROUSEL_IMAGES.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImageIndex(idx)}
                    className="relative h-full flex shrink-0 bg-[#161715] overflow-hidden border border-[#e3e1da]/10 group cursor-pointer"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-auto max-w-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    
                    {item.isSpecial && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#10110F] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-12 left-0 w-full flex flex-col items-center text-center px-6">
                           <h4 className={`${libreCaslon.className} !mb-0 !text-2xl md:!text-3xl uppercase !tracking-widest !text-[#e3e1da]`}>
                             ISLAND PEAKS
                           </h4>
                           <p className="!mb-0 !mt-3 font-sans !text-[0.55rem] font-bold uppercase !tracking-[0.3em] !text-[#e3e1da]/40">
                             SAFFT MARK
                           </p>
                        </div>
                      </>
                    )}
                  </div>
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
      {isMounted && createPortal(
      <AnimatePresence>
        {activeImageIndex !== null && activeImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex h-[100svh] w-full items-center justify-center overflow-hidden bg-[#10110F]/92 backdrop-blur-[26px]"
            onClick={() => setActiveImageIndex(null)}
            onWheelCapture={handleOverlayWheel}
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(227,225,218,0.08),transparent_38%),linear-gradient(180deg,rgba(16,17,15,0.45),rgba(16,17,15,0.95))]" />
            <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-4 border-b border-[#e3e1da]/10 bg-[#10110F]/68 !px-4 !py-4 backdrop-blur-xl md:!px-8" onClick={(e) => e.stopPropagation()}>
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
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e3e1da]/16 bg-[#e3e1da]/5 text-[#e3e1da] transition-colors duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50"
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
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full w-full items-center justify-center pointer-events-none !px-4 !pb-28 !pt-24 md:!px-28 md:!pb-14 md:!pt-28"
            >
              <div className="grid w-full max-w-[92rem] grid-cols-1 items-end gap-7 pointer-events-auto lg:grid-cols-[minmax(0,1fr)_20rem]" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex min-h-0 w-full items-center justify-center border border-[#e3e1da]/10 bg-[#151612]/60 !p-2 shadow-[0_34px_110px_rgba(0,0,0,0.62)]">
                  <img 
                    src={activeImage.src} 
                    alt={activeImage.alt}
                    className="max-h-[58svh] w-auto max-w-full object-contain md:max-h-[74svh]"
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
      document.body
      )}
    </main>
  );
}
