"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

export const Memory = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const filterValue = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.6, 0.7, 1],
    [
      "grayscale(100%) blur(8px) brightness(0.4)",
      "grayscale(100%) blur(2px) brightness(0.7)",
      "grayscale(0%) blur(0px) brightness(1)",
      "grayscale(0%) blur(0px) brightness(1)",
      "grayscale(100%) blur(2px) brightness(0.7)",
      "grayscale(100%) blur(8px) brightness(0.4)"
    ]
  );

  const titleColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.6, 0.7, 1],
    ["#e3e1da", "#e3e1da", "#ff4d00", "#ff4d00", "#e3e1da", "#e3e1da"]
  );

  const titleFilter = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.6, 0.7, 1],
    [
      "blur(8px) brightness(0.3)",
      "blur(2px) brightness(0.7)",
      "blur(0px) brightness(1)",
      "blur(0px) brightness(1)",
      "blur(2px) brightness(0.7)",
      "blur(8px) brightness(0.3)"
    ]
  );

  const titleGlow = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.6, 0.7, 1],
    [
      "0px 0px 0px rgba(255, 77, 0, 0)",
      "0px 0px 0px rgba(255, 77, 0, 0)",
      "0px 0px 30px rgba(255, 77, 0, 0.4)",
      "0px 0px 30px rgba(255, 77, 0, 0.4)",
      "0px 0px 0px rgba(255, 77, 0, 0)",
      "0px 0px 0px rgba(255, 77, 0, 0)"
    ]
  );

  return (
    <PantaiSection 
      ref={containerRef}
      id="memory" 
      className={`${pantaiLayout.sectionY} ${pantaiLayout.gutters} bg-transparent`}
    >
      <PantaiFrame>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative aspect-square overflow-hidden border border-[#e3e1da]/10 group rounded-sm md:rounded-2xl"
          >
            <motion.div 
              className="absolute inset-0 w-full h-full"
              style={{ filter: filterValue }}
            >
              <Image
                src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00679.JPG"
                alt="A Fragmented Memory"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                sizes="(min-width: 1024px) 45vw, calc(100vw - 48px)"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#10110F]/40 to-transparent pointer-events-none" />
          </motion.div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="font-sans !mb-0 !text-[0.7rem] md:!text-[0.85rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]/40"
            >
              {PANTAI_TIMOR_COPY.memory.label}
            </motion.h3>

            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ color: titleColor, textShadow: titleGlow, filter: titleFilter }}
              className={`${cormorant.className} !mt-8 md:!mt-12 !mb-0 !text-[clamp(2.5rem,8vw,4rem)] !leading-[1.1] text-balance font-semibold`}
            >
              {PANTAI_TIMOR_COPY.memory.title}
            </motion.h4>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="!mb-0 !mt-8 md:!mt-10 !text-[0.95rem] md:!text-[1.1rem] !leading-[1.9] !text-[#e3e1da]/60 text-pretty font-medium"
            >
              {PANTAI_TIMOR_COPY.memory.content}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
              className="!mt-12 md:!mt-16 w-24 h-px bg-[#e3e1da]/20"
            />
          </div>
        </div>
      </PantaiFrame>
    </PantaiSection>
  );
};
