"use client";

import { motion, MotionValue } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import React from "react";
import { PANTAI_TIMOR_COPY } from "../config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface HeroProps {
  heroRef: React.RefObject<HTMLElement | null>;
  heroOpacity: MotionValue<number>;
  heroImageY: MotionValue<number>;
  heroImageScale: MotionValue<number>;
  heroImageOpacity: MotionValue<number>;
  heroContainerWidth: MotionValue<string>;
  heroContainerHeight: MotionValue<string>;
  heroContainerRadius: MotionValue<number>;
  spacerRef: React.RefObject<HTMLDivElement | null>;
  onVideoReady?: () => void;
}

export const Hero = ({ 
  heroRef, 
  heroOpacity, 
  heroImageY, 
  heroImageScale, 
  heroImageOpacity, 
  heroContainerWidth, 
  heroContainerHeight, 
  heroContainerRadius,
  spacerRef,
  onVideoReady
}: HeroProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Fallback: If video takes too long, just show the page anyway
    const timer = setTimeout(() => {
      onVideoReady?.();
    }, 5000);

    // Check if video is already ready (e.g. cached)
    if (videoRef.current && videoRef.current.readyState >= 3) {
      onVideoReady?.();
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [onVideoReady]);

  return (
    <section 
      ref={heroRef}
      className="sticky top-0 w-full h-[100svh] min-h-[680px] overflow-hidden z-0"
    >
      <motion.div 
        style={{ 
          opacity: heroOpacity,
          paddingTop: 'calc(140px + env(safe-area-inset-top, 0px))'
        }}
        className="absolute inset-0 flex flex-col items-center justify-center !px-4"
      >
        <div 
          style={{ top: 'calc(50% + env(safe-area-inset-top, 0px) / 2)' }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1500px] h-[700px] opacity-40 mix-blend-screen select-none pointer-events-none flex items-center justify-center"
        >
           <motion.div 
             style={{ 
               y: heroImageY, 
               scale: heroImageScale, 
               opacity: heroImageOpacity,
               width: heroContainerWidth,
               height: heroContainerHeight,
               borderRadius: heroContainerRadius
             }} 
             className="relative overflow-hidden"
           >
              <video 
                ref={videoRef}
                src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/cover.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                onCanPlay={onVideoReady}
                className="w-full h-full object-cover"
              />
           </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div ref={spacerRef} className="invisible pointer-events-none">
            <h1 className={`${cormorant.className} !text-[clamp(2.1rem,13vw,11rem)] !leading-none !tracking-tight font-normal`}>{PANTAI_TIMOR_COPY.hero.title}</h1>
          </div>
        </div>

        {/* Scroll Indicator */}
         <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
          <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#e3e1da]/30">
            {PANTAI_TIMOR_COPY.hero.scroll}
          </span>
          <div className="h-12 w-[1px] bg-[#e3e1da]/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1/2 bg-[#e3e1da]/60 animate-[pantaiScrollDown_2.5s_ease-in-out_infinite]" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
