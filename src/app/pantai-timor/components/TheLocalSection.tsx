"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import React from "react";
import { FEATURED_IMAGES, PANTAI_TIMOR_COPY } from "../config";
import { ptTrack } from "@/utils/ga-events";
import { PantaiFrame, pantaiLayout } from "./LayoutPrimitives";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface CarouselItemProps {
  item: (typeof FEATURED_IMAGES)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ item, index, isActive, onClick }, ref) => {
    // Parallax effect removed to fix default zoom issue
    
    return (
      <motion.div
        ref={ref}
        data-index={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
        onClick={() => {
          ptTrack.carouselClickImage(index, item.src);
          onClick();
        }}
        className={`carousel-item relative h-[35vh] md:h-[60vh] flex shrink-0 bg-[#161715] overflow-hidden group cursor-pointer transition-all duration-700 ${
          item.isPortrait ? "aspect-[2/3]" : "aspect-[3/2]"
        } ${
          isActive 
            ? "opacity-100 scale-100" 
            : "opacity-40 scale-100 grayscale-[0.2]"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            style={{ height: "100%", top: "0%" }}
            className="relative w-full h-full"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 40vw, 85vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
            />
          </motion.div>
        </div>
        
        {/* Archival Overlay */}
        <div className="absolute inset-0 border border-[#e3e1da]/10 group-hover:border-[#e3e1da]/30 transition-colors duration-500" />
        
        {/* Caption (Hyogen style) */}
        <div className="absolute bottom-6 left-6 z-20 overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isActive ? "0%" : "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#e3e1da]/70">
              {String(index + 1).padStart(2, "0")} — Archive
            </span>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

interface TheLocalSectionProps {
  localSectionRef: React.RefObject<HTMLElement | null>;
  setActiveImageIndex: (index: number) => void;
  setIsGridView: (isGrid: boolean) => void;
}

export const TheLocalSection = ({
  localSectionRef,
  setActiveImageIndex,
  setIsGridView,
}: TheLocalSectionProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  
  const total = FEATURED_IMAGES.length;
  const [translateX, setTranslateX] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: localSectionRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  React.useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        const width = scrollRef.current.scrollWidth;
        const containerWidth = window.innerWidth;
        // Adjust for padding/gutters if necessary
        setTranslateX(width - containerWidth);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -translateX]);
  
  // Track active index based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const idx = Math.min(
      Math.floor(latest * total),
      total - 1
    );
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  return (
    <section
      id="archive"
      ref={localSectionRef as React.RefObject<HTMLElement>}
      className="relative w-full h-[400vh] bg-[#10110F] z-10"
    >
      <div className="sticky top-[calc(72px+env(safe-area-inset-top,0px))] md:top-[calc(80px+env(safe-area-inset-top,0px))] h-[calc(100dvh-72px-env(safe-area-inset-top,0px))] md:h-[calc(100dvh-80px-env(safe-area-inset-top,0px))] w-full flex flex-col justify-between py-8 md:py-16 overflow-hidden">
        <div className="relative w-full overflow-visible flex items-center h-[35vh] md:h-[60vh]">
          <motion.div
            ref={scrollRef}
            style={{ x }}
            className={`flex gap-10 md:gap-16 items-center pantai-no-scrollbar ${pantaiLayout.contentGutters}`}
          >
            {FEATURED_IMAGES.map((item, idx) => (
              <CarouselItem
                key={idx}
                item={item}
                index={idx}
                isActive={idx === activeIdx}
                onClick={() => setActiveImageIndex(idx)}
              />
            ))}
          </motion.div>
        </div>

        <PantaiFrame variant="narrow" withGutters className="relative z-20">
          <div className="mx-auto flex w-full justify-center !px-4 !pt-8 md:!px-6 md:!pt-10">
            <div className="grid w-full max-w-[64rem] grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[minmax(0,36rem)_minmax(16rem,18rem)] lg:justify-center lg:items-start lg:gap-x-16">
              <div className="min-w-0">
                <h3 className={`${cormorant.className} !m-0`}>
                  <motion.span
                    initial={{ opacity: 0, y: 40, rotate: -1 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block max-w-[10ch] text-balance text-[clamp(2.8rem,8vw,4.8rem)] leading-[0.88] tracking-tight text-[#e3e1da] italic font-light opacity-70 md:text-[clamp(4.8rem,6.6vw,6.8rem)]"
                  >
                    {PANTAI_TIMOR_COPY.localSection.title}
                  </motion.span>
                </h3>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="!mb-0 !mt-5 max-w-[36rem] text-left text-[0.92rem] leading-[1.9] text-[#e3e1da]/42 text-pretty md:!mt-7 md:text-[1rem]"
                >
                  {PANTAI_TIMOR_COPY.localSection.content}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-start lg:justify-end lg:pt-6"
              >
                <motion.button
                  onClick={() => {
                    ptTrack.carouselViewArchive();
                    setActiveImageIndex(0);
                    setIsGridView(true);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ x: 1 }}
                  className="group inline-flex min-h-[3rem] items-center gap-4 whitespace-nowrap border-b border-[#e3e1da]/18 !pb-3 font-sans text-[0.68rem] uppercase tracking-[0.34em] text-[#e3e1da]/78 transition-all duration-500 hover:border-[#e3e1da]/45 hover:text-[#e3e1da] md:min-h-[3.25rem]"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e1da]/16 bg-[#e3e1da]/[0.045] text-[#e3e1da]/82 transition-all duration-500 group-hover:border-[#e3e1da]/36 group-hover:bg-[#e3e1da]/[0.08] group-hover:text-[#e3e1da]">
                    <span className="text-[0.95rem] leading-none transition-transform duration-500 group-hover:translate-x-[2px]">
                      ↗
                    </span>
                  </span>
                  <span>{PANTAI_TIMOR_COPY.localSection.cta}</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </PantaiFrame>

     
      </div>
    </section>
  );
};
