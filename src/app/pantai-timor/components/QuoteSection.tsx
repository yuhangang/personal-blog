"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React, { useRef } from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame } from "./LayoutPrimitives";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const Word = ({ children, progress, range, index }: { children: React.ReactNode, progress: any, range: [number, number], index: number }) => {
  // Reverse effect: fade OUT as scroll progress increases
  const opacity = useTransform(progress, range, [1, 0]);
  // Wavy dissolve: words sink and blur as they fade out
  const y = useTransform(progress, range, [0, 24 + Math.sin(index * 0.4) * 12]);
  const blur = useTransform(progress, range, ["blur(0px)", "blur(12px)"]);
  
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

export const QuoteSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Trigger as the section moves into the upper half of the viewport
    offset: ["start 0.4", "start 0"]
  });

  const words = PANTAI_TIMOR_COPY.quote.text.split(/\s+/);

  return (
    <section className="relative z-10 w-full min-h-[80vh] !py-48 md:!py-64 overflow-hidden flex items-center justify-center !px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01024.jpg"
          alt="Coastal sunset background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#10110F]/65" />
      </div>

      {/* Wavy gradient background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden z-1">
        <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      <PantaiFrame variant="narrow" className="relative z-10 text-center flex flex-col items-center">
        <span className="text-[#e3e1da]/40 text-3xl md:text-5xl font-serif leading-none block !mb-10">&ldquo;</span>
        
        <div 
          ref={containerRef}
          className={`${libreCaslon.className} !mb-12 !text-[1.8rem] md:!text-[2.6rem] !leading-[1.45] !text-[#e3e1da] font-medium tracking-tight flex flex-wrap justify-center gap-x-[0.35em] gap-y-[0.15em]`}
        >
          {words.map((word, i) => {
            const wordCount = words.length;
            // Progressive reveal: each word starts its transition slightly after the previous one
            const start = (i / wordCount) * 0.7; 
            const end = start + 0.3;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, Math.min(end, 1)]} index={i}>
                {word}
              </Word>
            );
          })}
        </div>

        <cite className="font-sans text-[0.6rem] md:text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#e3e1da]/50 not-italic">
          {PANTAI_TIMOR_COPY.quote.author}
        </cite>
      </PantaiFrame>
    </section>
  );
};
