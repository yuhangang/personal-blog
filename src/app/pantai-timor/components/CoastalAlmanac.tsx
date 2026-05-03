"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React, { useRef } from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

interface CoastalAlmanacProps {
  almanacRef: React.RefObject<HTMLElement | null>;
}

const Word = ({ children, progress, range, index }: { children: React.ReactNode, progress: MotionValue<number>, range: [number, number], index: number }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  // Wavy pattern: vertical offset that follows a sine wave staggered by word index
  const y = useTransform(progress, range, [24 + Math.sin(index * 0.4) * 12, 0]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
  
  return (
    <motion.span 
      style={{ 
        opacity, 
        y, 
        filter: blur,
      }} 
      className="relative inline-block"
    >
      {children}
    </motion.span>
  );
};

const Ripple = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-30">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [0.5, 1.5], 
            opacity: [0, 0.5, 0] 
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 3.3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 border-[0.5px] border-[#e3e1da]/40 rounded-full"
          style={{ 
            width: '150%', 
            height: '150%', 
            left: '-25%', 
            top: '-25%',
            filter: 'blur(20px)'
          }}
        />
      ))}
    </div>
  );
};

export const CoastalAlmanac = ({ almanacRef }: CoastalAlmanacProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"]
  });

  const words = PANTAI_TIMOR_COPY.almanac.content.split(/\s+/);

  return (
    <PantaiSection id="almanac" ref={almanacRef} className={`!pb-32 md:!py-48 ${pantaiLayout.gutters} bg-transparent`}>
      <PantaiFrame className="flex flex-col items-center">
        <div 
          className="relative w-full aspect-[3/4] md:aspect-[18/9] overflow-hidden border border-[#e3e1da]/10 group rounded-2xl md:rounded-[2.5rem]"
        >
          <div className="absolute inset-0 w-full scale-110 group-hover:scale-100 transition-transform duration-[3s] ease-out">
            <Image 
              src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg" 
              alt="Fishing Boat" 
              fill 
              className="object-cover object-right md:object-center" 
              sizes="(min-width: 768px) 90vw, calc(100vw - 48px)" 
            />
          </div>

          <Ripple />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 flex flex-col items-center justify-center p-6 md:p-12">
            <div className="max-w-[54rem] w-full flex flex-col items-center text-center">
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="font-sans !mb-0 !text-[0.8rem] md:!text-[1rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]"
              >
                {PANTAI_TIMOR_COPY.almanac.label}
              </motion.h3>
              
              <div 
                ref={containerRef}
                className={`${libreCaslon.className} !mb-0 !mt-8 md:!mt-12 !text-[1.5rem] md:!text-[2.8rem] !leading-[1.3] !text-[#e3e1da] flex flex-wrap justify-center gap-x-[0.35em] gap-y-[0.15em]`}
              >
                {words.map((word, i) => {
                  // Staggered range to create a wave-like progression
                  const wordCount = words.length;
                  const start = i / wordCount;
                  const end = start + 0.15; // Slightly longer overlap for smoother wavy reveal
                  return (
                    <Word key={i} progress={scrollYProgress} range={[start, Math.min(end, 1)]} index={i}>
                      {word}
                    </Word>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </PantaiFrame>
    </PantaiSection>
  );
};
