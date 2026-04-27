"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export type LayoutType = "full" | "diptych" | "cluster" | "triptych";

export interface PhotobookSpreadProps {
  layout: LayoutType;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  pageNumber: string;
  title?: string;
  description?: string;
  className?: string;
  fontSerif?: string;
}

export default function PhotobookSpread({
  layout,
  images,
  pageNumber,
  title,
  description,
  className,
  fontSerif,
}: PhotobookSpreadProps) {
  return (
    <div
      className={cn(
        "relative flex h-full shrink-0 transition-colors hover:bg-neutral-50 px-12 md:px-24 py-32 md:py-48",
        layout === "full" && "w-[100vw]",
        layout === "diptych" && "w-[150vw]",
        layout === "triptych" && "w-[180vw]",
        layout === "cluster" && "w-[160vw]",
        className
      )}
    >
      {/* Page Numbering & Editorial Info */}
      <div className="absolute bottom-10 left-12 md:left-24 flex items-baseline gap-4 pointer-events-none">
        <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.3em] text-black/20">
          Page
        </span>
        <span className={cn("text-[2.5vw] leading-none tracking-tighter text-black/10", fontSerif)}>
          {pageNumber}
        </span>
      </div>

      <div className="flex h-full w-full items-center justify-center">
        {/* LAYOUT: FULL (Single wide or centered) */}
        {layout === "full" && images[0] && (
          <div className="relative w-full max-w-7xl px-12 py-12">
            {title && (
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={cn("mb-12 text-[4vw] font-medium leading-none text-black", fontSerif)}
              >
                {title}
              </motion.h3>
            )}
            <motion.div
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/9] w-full overflow-hidden shadow-2xl"
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                className="object-cover transition-transform duration-[4s] hover:scale-105"
              />
            </motion.div>
          </div>
        )}

        {/* LAYOUT: DIPTYCH (Two images side by side) */}
        {layout === "diptych" && images.length >= 2 && (
          <div className="flex w-full items-center justify-center gap-12 md:gap-24">
            {images.slice(0, 2).map((img, i) => (
              <motion.div
                key={i}
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[3/4] w-[45vw] overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-[4s] hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* LAYOUT: TRIPTYCH (Three thin vertical images) */}
        {layout === "triptych" && images.length >= 3 && (
          <div className="flex w-full items-center justify-center gap-6 md:gap-12">
            {images.slice(0, 3).map((img, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 1.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[2/3] w-[40vw] overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-[4s] hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* LAYOUT: CLUSTER (Mixed sizes) */}
        {layout === "cluster" && images.length >= 3 && (
          <div className="relative h-full w-full max-w-[90vw]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="absolute left-[5%] top-[10%] z-10 aspect-[3/4] w-[25vw] overflow-hidden shadow-xl"
            >
              <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="relative mx-auto aspect-[16/10] w-[50vw] overflow-hidden"
            >
              <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="absolute bottom-[10%] right-[5%] aspect-[1/1] w-[20vw] overflow-hidden shadow-xl"
            >
              <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
