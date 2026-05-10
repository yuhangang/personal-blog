"use client";

import { Mail, Phone } from "lucide-react";
import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { RefObject } from "react";
import type { PantaiTimorFontClasses } from "./types";

interface AlmanacSectionProps {
  almanacImageY: MotionValue<string>;
  almanacRef: RefObject<HTMLElement | null>;
  fonts: PantaiTimorFontClasses;
}

export function AlmanacSection({ almanacImageY, almanacRef, fonts }: AlmanacSectionProps) {
  return (
    <section ref={almanacRef} className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
      <div className="max-w-screen-2xl w-full flex flex-col items-center">
        <div className="relative w-full aspect-[3/2] overflow-hidden border border-[#e3e1da]/10 group rounded-sm md:rounded-2xl">
          <motion.div style={{ y: almanacImageY }} className="absolute inset-x-0 -top-[30%] -bottom-[30%] w-full">
            <Image
              src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg"
              alt="Fishing Boat"
              fill
              className="object-cover transition-transform duration-[2s] ease-out"
              sizes="(min-width: 768px) 90vw, calc(100vw - 48px)"
            />
          </motion.div>

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
                className={`${fonts.serif} !mb-0 !mt-8 md:!mt-12 !text-[1.5rem] md:!text-[2.5rem] !leading-[1.3] !text-[#e3e1da] text-balance drop-shadow-xl`}
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
}

export function VillageRhythmsSection({ fonts }: { fonts: PantaiTimorFontClasses }) {
  return (
    <section className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-[#10110F]">
      <div className="max-w-screen-2xl w-full">
        <div className="relative w-full aspect-[4/5] md:aspect-[16/8] overflow-hidden border border-[#e3e1da]/10 group">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
            <div className="relative h-full w-full overflow-hidden">
              <Image src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00645.JPG" alt="Village Life" fill className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="relative h-full w-full overflow-hidden border-t md:border-t-0 md:border-l border-[#e3e1da]/10">
              <Image src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00788.JPG" alt="Coastal House" fill className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 md:p-16 text-center">
            <div className="max-w-[48rem] flex flex-col items-center">
              <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className="font-sans !mb-0 !text-[0.7rem] md:!text-[0.85rem] font-black uppercase !tracking-[0.5em] !text-[#e3e1da]">
                VILLAGE RHYTHMS
              </motion.h3>

              <motion.h4 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} viewport={{ once: true }} className={`${fonts.serif} !mt-8 md:!mt-12 !mb-0 !text-[2.2rem] md:!text-[4rem] !leading-[1.1] !text-[#e3e1da] text-balance`}>
                Portraits of the Tide
              </motion.h4>

              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} viewport={{ once: true }} className="!mb-0 !mt-8 md:!mt-10 !text-[0.95rem] md:!text-[1.1rem] !leading-[1.8] !text-[#e3e1da]/80 text-pretty font-medium">
                The pulse of the coast is best felt through its people and the spaces they inhabit. Vibrant colors stand in defiance of the salty winds, creating a vivid tapestry of daily life.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} viewport={{ once: true }} className="!mt-12 md:!mt-16 flex items-center gap-10 text-[#e3e1da]/40">
                <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
                <div className="w-2 h-2 rounded-full border border-[#e3e1da]/30" />
                <div className="w-16 h-[1px] bg-[#e3e1da]/30" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MemorySection({ fonts }: { fonts: PantaiTimorFontClasses }) {
  return (
    <section className="relative w-full !py-32 md:!py-48 !px-4 md:!px-8 flex flex-col items-center z-10 bg-transparent">
      <div className="max-w-screen-2xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative aspect-[4/5] md:aspect-square overflow-hidden border border-[#e3e1da]/10 group rounded-sm md:rounded-2xl"
          >
            <Image
              src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00679.JPG"
              alt="A Fragmented Memory"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-out group-hover:scale-105"
              sizes="(min-width: 1024px) 45vw, calc(100vw - 48px)"
            />
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
              A FRAGMENTED MEMORY
            </motion.h3>

            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`${fonts.serif} !mt-8 md:!mt-12 !mb-0 !text-[2.2rem] md:!text-[3.8rem] !leading-[1.1] !text-[#e3e1da] text-balance`}
            >
              The Dashboard Reflection
            </motion.h4>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="!mb-0 !mt-8 md:!mt-10 !text-[0.95rem] md:!text-[1.1rem] !leading-[1.9] !text-[#e3e1da]/60 text-pretty font-medium"
            >
              The windshield is more than just glass; it is a lens that filters the raw intensity of the coast. These are the moments caught in the rearview mirror—the fleeting intersections of life and journey that linger long after the engine has cooled.
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
      </div>
    </section>
  );
}
