"use client";

import { ArrowDown } from "lucide-react";
import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { PantaiTimorFontClasses } from "./types";

interface HeroSectionProps {
  fonts: PantaiTimorFontClasses;
  heroImageOpacityFade: MotionValue<number>;
  heroImageScale: MotionValue<number>;
  heroImageYClamp: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  heroY: MotionValue<number>;
}

export function HeroSection({
  fonts,
  heroImageOpacityFade,
  heroImageScale,
  heroImageYClamp,
  heroOpacity,
  heroY,
}: HeroSectionProps) {
  return (
    <section className="relative w-full h-[100svh] min-h-[720px] overflow-hidden flex flex-col items-center justify-center !px-4 !pt-32 !pb-40">
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1500px] h-[700px] opacity-40 mix-blend-screen select-none pointer-events-none flex items-center justify-center">
        <motion.div
          style={{ y: heroImageYClamp, scale: heroImageScale, opacity: heroImageOpacityFade }}
          className="relative w-[400px] h-[500px] md:w-[800px] md:h-[600px] lg:w-[1000px] lg:h-[550px] rounded-[100px] overflow-hidden"
        >
          <Image
            src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00552.JPG"
            alt="Tree Hero"
            fill
            className="object-cover"
            priority
            loading="eager"
            sizes="(min-width: 1024px) 1000px, (min-width: 768px) 800px, 400px"
          />
        </motion.div>
      </div>

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex w-full max-w-[1400px] flex-col items-center">
        <div className="flex items-center gap-10 md:gap-14 text-[#e3e1da]/40 mb-20 md:mb-32">
          <span className={`${fonts.chinese} text-4xl md:text-6xl tracking-[0.2em] md:tracking-[0.4em] ml-[0.2em] md:ml-[0.4em]`}>東海岸</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e3e1da]/20" />
          <span className={`${fonts.arabic} text-4xl md:text-6xl`} dir="rtl">ڤنتاي تيمور</span>
        </div>
        <h1 className={`${fonts.serif} !mb-0 !text-[clamp(4.25rem,18vw,11rem)] !leading-[0.9] !tracking-normal text-center !text-[#f2f0ea] text-balance`}>
          PANTAI TIMOR
        </h1>
        <p className="!mb-0 !mt-10 max-w-[22rem] text-center font-sans !text-[0.55rem] font-bold uppercase !leading-[2.35] !tracking-[0.3em] !text-[#e3e1da]/50 md:!mt-16 md:max-w-none md:!text-[0.65rem] md:!tracking-[0.5em]">
          A PHOTOGRAPHIC JOURNEY TO THE EASTERN ENCLAVE
        </p>
      </motion.div>

      <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#e3e1da]/30">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#e3e1da]/40"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-[-1vh] md:bottom-[-3vh] w-full !px-4 text-center pointer-events-none select-none z-0">
        <motion.h2 style={{ y: heroY }} className="font-sans !mb-0 !text-[clamp(3.4rem,14vw,13rem)] uppercase !tracking-normal !text-[#e3e1da]/[0.02] !leading-none whitespace-nowrap">
          PANTAI TIMOR
        </motion.h2>
      </div>
    </section>
  );
}
