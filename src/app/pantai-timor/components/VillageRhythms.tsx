"use client";

import { motion } from "framer-motion";
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

export const VillageRhythms = () => {
  return (
    <PantaiSection id="village" className={`${pantaiLayout.sectionY} ${pantaiLayout.gutters} bg-[#10110F]`}>
      <PantaiFrame>
        <div className="relative w-full aspect-[4/5] md:aspect-[16/8] overflow-hidden border border-[#e3e1da]/10 group">
          {/* Split Image Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
            <div className="relative h-full w-full overflow-hidden">
              <Image 
                src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00645.JPG" 
                alt="Village Life" 
                fill 
                className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" 
                sizes="(min-width: 768px) 50vw, 100vw" 
              />
            </div>
            <div className="relative h-full w-full overflow-hidden border-t md:border-t-0 md:border-l border-[#e3e1da]/10">
              <Image 
                src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00788.JPG" 
                alt="Coastal House" 
                fill 
                className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" 
                sizes="(min-width: 768px) 50vw, 100vw" 
              />
            </div>
          </div>
          
          {/* Unified Overlay Content */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 md:p-16 text-center">
            <div className="max-w-[48rem] flex flex-col items-center">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="font-sans !mb-0 !text-[0.7rem] md:!text-[0.85rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]"
              >
                {PANTAI_TIMOR_COPY.villageRhythms.label}
              </motion.h3>
              
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`${cormorant.className} !mt-8 md:!mt-12 !mb-0 !text-[clamp(2.5rem,8vw,4rem)] !leading-[1.1] !text-[#e3e1da] text-balance font-semibold`}
              >
                {PANTAI_TIMOR_COPY.villageRhythms.title}
              </motion.h4>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className="!mb-0 !mt-8 md:!mt-10 !text-[0.95rem] md:!text-[1.1rem] !leading-[1.8] !text-[#e3e1da]/80 text-pretty font-medium"
              >
                {PANTAI_TIMOR_COPY.villageRhythms.content}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
                className="!mt-12 md:!mt-16 flex items-center gap-10 text-[#e3e1da]/40"
              >
                <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
                <div className="w-2 h-2 rounded-full border border-[#e3e1da]/30" />
                <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
              </motion.div>
            </div>
          </div>
        </div>
      </PantaiFrame>
    </PantaiSection>
  );
};
