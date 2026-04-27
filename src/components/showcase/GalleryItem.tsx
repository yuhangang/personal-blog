"use client";

import { motion } from "framer-motion";
import { useRef, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface GalleryItemProps {
  id: string;
  number: string;
  title: string;
  category: string;
  image: string;
  index: number;
}

function GalleryItemComponent({
  id,
  number,
  title,
  category,
  image,
  index,
}: GalleryItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={containerRef}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      className={cn(
        "project-card group relative flex h-full w-[26.3vw] flex-col border-r border-black/10 transition-colors hover:bg-neutral-100 will-change-transform",
        index === 0 && "border-l"
      )}
    >
      {/* Top Section: Title & Info */}
      <div className="flex flex-col p-10 pt-24">
        <motion.span 
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-black/30"
        >
          {category}
        </motion.span>
        <motion.h2 
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-6 font-serif text-[1.9vw] font-medium leading-none tracking-tight text-black"
        >
          {title}
        </motion.h2>
      </div>

      {/* Middle Section: Image with Curtain Reveal */}
      <div className="relative mt-auto flex-1 overflow-hidden px-10">
        <motion.div
          variants={{
            initial: { clipPath: "inset(100% 0% 0% 0%)" },
            animate: { clipPath: "inset(0% 0% 0% 0%)" }
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative aspect-[3/4] w-full overflow-hidden"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="26vw"
            priority={index < 2}
            className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Bottom Section: Large Number */}
      <div className="mt-auto p-10 pt-0">
        <motion.div
          variants={{
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex items-baseline"
        >
          <span className="font-serif text-[13.8vw] font-medium leading-[0.8] tracking-[-0.05em] text-black">
            {number}
          </span>
          <span className="mb-4 ml-2 font-serif text-[1.5vw] italic text-black/20">
            ,
          </span>
        </motion.div>
      </div>

      {/* Background Separation Line */}
      <div className="absolute right-0 top-0 h-full w-[1px] bg-black/5" />
    </motion.div>
  );
}

const GalleryItem = memo(GalleryItemComponent);
export default GalleryItem;
