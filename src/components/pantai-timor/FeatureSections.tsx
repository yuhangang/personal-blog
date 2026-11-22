"use client";

import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { RefObject } from "react";

interface AlmanacSectionProps {
  almanacImageY: MotionValue<string>;
  almanacRef: RefObject<HTMLElement | null>;
}

export function AlmanacSection({ almanacImageY, almanacRef }: AlmanacSectionProps) {
  return (
    <section ref={almanacRef} className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
      <div className="max-w-screen-2xl w-full flex flex-col items-center">
        <div className="relative w-full aspect-[3/2] overflow-hidden border border-[#e3e1da]/10 group rounded-sm md:rounded-2xl">
          <motion.div style={{ y: almanacImageY }} className="absolute inset-x-0 -top-[30%] -bottom-[30%] w-full">
            <Image
              src="https://cdn.yuhangang.com/pantai-timor/DSC07763_1.jpg"
              alt="Fishing Boat"
              fill
              className="object-cover transition-transform duration-[2s] ease-out"
              sizes="(min-width: 768px) 90vw, calc(100vw - 48px)"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function VillageRhythmsSection() {
  return (
    <section className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-[#10110F]">
      <div className="max-w-screen-2xl w-full">
        <div className="relative w-full aspect-[4/5] md:aspect-[16/8] overflow-hidden border border-[#e3e1da]/10 group">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
            <div className="relative h-full w-full overflow-hidden">
              <Image src="https://cdn.yuhangang.com/pantai-timor/DSC00645.JPG" alt="Village Life" fill className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="relative h-full w-full overflow-hidden border-t md:border-t-0 md:border-l border-[#e3e1da]/10">
              <Image src="https://cdn.yuhangang.com/pantai-timor/DSC00788.JPG" alt="Coastal House" fill className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MemorySection() {
  return (
    <section className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
      <div className="max-w-screen-2xl w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full max-w-[min(88vw,74vh)] aspect-[4/5] md:aspect-square overflow-hidden border border-[#e3e1da]/10 group rounded-sm md:rounded-2xl"
        >
          <Image
            src="https://cdn.yuhangang.com/pantai-timor/DSC00679.JPG"
            alt="A Fragmented Memory"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 74vh, calc(100vw - 48px)"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#10110F]/25 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
