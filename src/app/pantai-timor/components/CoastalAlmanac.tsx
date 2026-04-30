"use client";

import { motion } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import React from "react";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

interface CoastalAlmanacProps {
  almanacRef: React.RefObject<HTMLElement | null>;
}

export const CoastalAlmanac = ({ almanacRef }: CoastalAlmanacProps) => {
  return (
    <section id="almanac" ref={almanacRef} className="relative w-full !pb-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
      <div className="max-w-screen-2xl w-full flex flex-col items-center">
        <div 
          className="relative w-full aspect-[3/4] md:aspect-[18/9] overflow-hidden border border-[#e3e1da]/10 group rounded-2xl md:rounded-[2.5rem]"
        >
          <div className="absolute inset-0 w-full">
            <Image 
              src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg" 
              alt="Fishing Boat" 
              fill 
              className="object-cover object-right md:object-center" 
              sizes="(min-width: 768px) 90vw, calc(100vw - 48px)" 
            />
          </div>
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 flex flex-col items-center justify-center p-6 md:p-12">
            <div className="max-w-[48rem] w-full flex flex-col items-center text-center">
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="font-sans !mb-0 !text-[0.8rem] md:!text-[1rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]"
              >
                THE COASTAL ALMANAC
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className={`${libreCaslon.className} !mb-0 !mt-8 md:!mt-12 !text-[1.5rem] md:!text-[2.5rem] !leading-[1.3] !text-[#e3e1da] text-balance drop-shadow-xl`}
              >
                Documenting the ebb and flow of a timeless horizon. Every frame is a testament to the persistent dialogue between the shore and the sea.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="!mt-12 md:!mt-16 flex items-center gap-10 text-[#e3e1da]/50"
              >
                <button className="hover:text-[#e3e1da] transition-colors !p-2" aria-label="Mail"><Mail className="w-5 h-5" /></button>
                <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
                <button className="hover:text-[#e3e1da] transition-colors !p-2" aria-label="Phone"><Phone className="w-5 h-5" /></button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
