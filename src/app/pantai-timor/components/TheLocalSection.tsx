"use client";

import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import React from "react";
import { CAROUSEL_IMAGES, COASTAL_LOCATIONS } from "../data";
import { ptTrack } from "@/utils/ga-events";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface CarouselItemProps {
  item: (typeof CAROUSEL_IMAGES)[0] & { originalIdx: number };
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ item, index, isActive, onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        data-index={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
        onClick={() => {
          ptTrack.carouselClickImage(index, item.src);
          onClick();
        }}
        className={`carousel-item relative w-[80vw] md:w-auto max-w-[380px] md:max-w-none h-auto md:h-full aspect-square ${
          item.isPortrait ? "md:aspect-[2/3]" : "md:aspect-[3/2]"
        } flex shrink-0 bg-[#161715] overflow-hidden border transition-all duration-500 group cursor-pointer ${
          isActive 
            ? "border-[#e3e1da]/40 opacity-100" 
            : "border-[#e3e1da]/10 opacity-30 grayscale-[0.1]"
        }`}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 50vw, 75vw"
          className="object-cover md:object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
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
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  const featuredImages = React.useMemo(
    () =>
      CAROUSEL_IMAGES.map((img, originalIdx) => ({
        ...img,
        originalIdx,
      })).filter((img) => {
        const loc = COASTAL_LOCATIONS.find((l) => l.image === img.src);
        return loc?.featured;
      }),
    []
  );

  const total = featuredImages.length;
  const desktopLeadImage = featuredImages[0];
  const desktopGalleryImages = featuredImages.slice(1, 3);

  // ── Scroll to a specific item, centering it ──
  const scrollToItem = React.useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, total - 1));
      const el = itemRefs.current[clamped];
      const container = scrollRef.current;
      if (!el || !container) return;

      const elRect = el.getBoundingClientRect();
      const offset =
        el.offsetLeft -
        container.offsetWidth / 2 +
        elRect.width / 2;

      container.scrollTo({ left: offset, behavior: "smooth" });
    },
    [total]
  );

  // ── Detect which item is closest to center on scroll ──
  const onScroll = React.useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const progress = scrollLeft / Math.max(1, scrollWidth - clientWidth);
    setScrollProgress(isNaN(progress) ? 0 : Math.min(1, progress));

    // Find item closest to the center of the viewport
    const center = scrollLeft + clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const itemCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(itemCenter - center);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setActiveIdx(closestIdx);
  }, []);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Prevent vertical page scroll when scrolling horizontally on the carousel
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  const goPrev = () => {
    if (activeIdx === 0) {
      scrollToItem(total - 1);
    } else {
      scrollToItem(activeIdx - 1);
    }
  };

  const goNext = () => {
    if (activeIdx === total - 1) {
      scrollToItem(0);
    } else {
      scrollToItem(activeIdx + 1);
    }
  };

  return (
    <section
      id="archive"
      ref={localSectionRef}
      className="relative w-full overflow-x-hidden bg-[#10110F] z-10 !pt-16 !pb-20 md:!pt-44 md:!pb-96 flex flex-col items-center"
    >
      <div className="w-full !px-6 md:!px-12">
        <div className="w-full max-w-[1700px] mx-auto">
          {/* ─── Header ─── */}
          <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16 !mb-8 md:!mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[42rem]"
            >
              <h3
                className={`${cormorant.className} !text-[clamp(3rem,10vw,5.5rem)] md:!text-[5.5rem] !leading-[0.95] !tracking-tight !text-[#e3e1da] !mb-10 text-balance font-semibold`}
              >
                The Living
                Artifact
              </h3>
              <p className="max-w-[60rem] !text-[0.9rem] md:!text-[1.05rem] !leading-[1.9] !text-[#e3e1da]/50 !mb-0 text-pretty">
                Our collection spans decades of coastal memories — preserving not
                just the images, but the atmosphere of the Timor coast.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-end"
            >
              <button
                onClick={() => {
                  ptTrack.carouselViewArchive();
                  setActiveImageIndex(0);
                  setIsGridView(true);
                }}
                className="group flex items-center gap-3 font-sans text-[0.75rem] md:text-[0.8rem] uppercase tracking-[0.15em] text-[#e3e1da]/50 transition-colors duration-300 hover:text-[#e3e1da]"
              >
                <span className="border-b border-[#e3e1da]/20 pb-1 group-hover:border-[#e3e1da]/50 transition-colors duration-300">
                  View Full Archive
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Carousel (Full Bleed) ─── */}
      <div className="relative w-full overflow-visible">
        <div
          ref={scrollRef}
          id="pantai-timor-scroller"
          className="flex gap-5 md:gap-8 h-[380px] md:h-[640px] items-center overflow-x-auto overflow-y-hidden no-scrollbar px-6 md:px-[calc((100vw-min(1700px,100vw-3rem))/2)]"
        >
          {featuredImages.map((item, idx) => (
            <CarouselItem
              key={idx}
              ref={(el) => { itemRefs.current[idx] = el; }}
              item={item}
              index={idx}
              isActive={idx === activeIdx}
              onClick={() => setActiveImageIndex(item.originalIdx)}
            />
          ))}
        </div>
      </div>

      <div className="w-full !px-6 md:!px-12">
        <div className="w-full max-w-[1700px] mx-auto">
          {/* ─── Progress Bar (Desktop) ─── */}
          <div className="hidden md:block w-full mt-14">
            <div className="h-[2px] w-full bg-[#e3e1da]/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#e3e1da]/60"
                style={{ scaleX: scrollProgress, transformOrigin: "left" }}
              />
            </div>
          </div>

          {/* ─── Navigation Controls ─── */}
          <div className="flex items-center justify-center gap-5 mt-8 md:mt-14">
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="grid place-items-center w-12 h-12 md:w-14 md:h-14 border border-[#e3e1da]/25 bg-[#e3e1da]/5 text-[#e3e1da] hover:bg-[#e3e1da]/15 hover:border-[#e3e1da]/40 active:scale-90 rounded-full transition-all duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Numeric Page Indicator */}
            <div className="flex items-center gap-6 min-w-[6rem] justify-center">
              <span className="font-sans text-[0.85rem] md:text-[0.95rem] font-bold tracking-[0.3em] text-[#e3e1da]">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <div className="w-10 h-px bg-[#e3e1da]/30" />
              <span className="font-sans text-[0.85rem] md:text-[0.95rem] font-bold tracking-[0.3em] text-[#e3e1da]/50">
                {String(total).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={goNext}
              aria-label="Next"
              className="grid place-items-center w-12 h-12 md:w-14 md:h-14 border border-[#e3e1da]/25 bg-[#e3e1da]/5 text-[#e3e1da] hover:bg-[#e3e1da]/15 hover:border-[#e3e1da]/40 active:scale-90 rounded-full transition-all duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        #pantai-timor-scroller {
          overscroll-behavior: none;
          touch-action: pan-x;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </section>
  );
};
