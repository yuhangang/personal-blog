"use client";

import { Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { CAROUSEL_IMAGES } from "./constants";
import type { LocalArchiveSectionProps } from "./types";

export function LocalArchiveSection({
  carouselRef,
  carouselX,
  carouselOpacity,
  fonts,
  hasExitedLocalSection,
  isLocalAutoplaying,
  localSectionRef,
  localSnapIndex,
  onImageClick,
  onToggleAutoplay,
  sectionOpacity,
  shouldReduceMotion,
}: LocalArchiveSectionProps) {
  return (
    <section ref={localSectionRef} className="relative w-full h-[640svh] md:h-[760svh] bg-[#10110F] z-10">
      <motion.div style={{ opacity: hasExitedLocalSection ? 1 : sectionOpacity }} className="sticky top-0 h-[100svh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#10110F] via-[#10110F]/80 to-transparent z-40 pointer-events-none md:h-32" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#10110F] to-transparent z-40 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-full md:w-[62%] bg-gradient-to-r from-[#10110F] via-[#10110F]/90 to-transparent z-20 pointer-events-none" />

        <div className="relative w-full h-full max-w-[1700px] !mx-auto !px-4 md:!px-10 lg:!px-16 flex items-start md:items-center">
          <div className="relative z-30 flex w-[calc(100vw-3rem)] max-w-[28rem] flex-col justify-start pt-24 shrink-0 pointer-events-none md:justify-center md:pt-0">
            <div className="pointer-events-auto">
              <h2 className="font-sans !text-xs font-black uppercase !tracking-[0.34em] !text-[#e3e1da] !mb-10 md:!tracking-[0.4em] drop-shadow-2xl">
                THE LOCAL
              </h2>
              <h3 className={`${fonts.serif} !text-[clamp(3.25rem,10vw,4.5rem)] md:!text-[4.5rem] !leading-[1.05] !tracking-normal !text-[#e3e1da] !mb-10 text-balance drop-shadow-2xl`}>
                The Living Artifact
              </h3>
              <p className="max-w-full md:max-w-[26rem] !text-sm md:!text-base !leading-[2] !text-[#e3e1da] !mb-14 text-pretty drop-shadow-lg">
                Our collection spans decades of coastal memories. We preserve not just the images, but the atmosphere of the Timor coast, treating each photographic practice with a sense of urgency.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="self-start font-sans text-left text-xs font-bold uppercase leading-relaxed tracking-[0.18em] text-[#e3e1da] hover:text-[#e3e1da]/60 transition-colors flex items-center gap-3 md:tracking-[0.2em] drop-shadow-md">
                  EXPLORE THE COLLECTION <span className="text-base font-light">+</span>
                </button>
                <button
                  type="button"
                  aria-label={isLocalAutoplaying ? "Pause horizontal autoplay" : "Start horizontal autoplay"}
                  onClick={onToggleAutoplay}
                  disabled={shouldReduceMotion}
                  className="flex h-11 items-center gap-3 border border-[#e3e1da]/16 bg-[#e3e1da]/5 !px-4 font-sans text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#e3e1da] transition-colors duration-300 hover:bg-[#e3e1da] hover:text-[#10110F] focus:outline-none focus:ring-2 focus:ring-[#e3e1da]/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLocalAutoplaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isLocalAutoplaying ? "PAUSE" : "AUTO"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-4 z-30 border border-[#e3e1da]/14 bg-[#10110F]/72 !px-4 !py-3 backdrop-blur-xl md:right-10">
            <p className="!mb-0 font-sans !text-[0.58rem] font-black uppercase !tracking-[0.22em] !text-[#e3e1da]/55">
              {String(localSnapIndex + 1).padStart(2, "0")} / {String(CAROUSEL_IMAGES.length).padStart(2, "0")}
            </p>
          </div>

          <div className="absolute inset-0 z-10 flex items-center">
            <motion.div
              ref={carouselRef}
              id="pantai-timor-scroller"
              style={{ x: carouselX, opacity: hasExitedLocalSection ? 1 : carouselOpacity }}
              className="flex h-[38svh] min-h-[280px] max-h-[400px] w-max items-center gap-6 will-change-transform !pl-[calc(100vw-3rem)] pr-[20vw] sm:!pl-[30rem] md:h-[74svh] md:max-h-none md:gap-28 md:!pl-[42rem]"
            >
              {CAROUSEL_IMAGES.map((item, idx) => (
                <div
                  key={item.src}
                  onClick={() => onImageClick(idx)}
                  className={`relative flex h-full max-w-[82vw] shrink-0 cursor-pointer overflow-hidden border border-[#e3e1da]/10 bg-[#161715] group md:max-w-none ${item.isPortrait ? "aspect-[2/3]" : "aspect-square md:aspect-auto"}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={`h-full max-w-[82vw] transition-transform duration-700 ease-out group-hover:scale-[1.03] md:max-w-none ${item.isPortrait ? "w-auto object-contain" : "w-full object-cover md:w-auto md:object-contain"}`}
                  />

                  {item.isSpecial && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#10110F] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center text-center px-6">
                        <h4 className={`${fonts.serif} !mb-0 !text-2xl md:!text-3xl uppercase !tracking-widest !text-[#e3e1da]`}>
                          ISLAND PEAKS
                        </h4>
                        <p className="!mb-0 !mt-3 font-sans !text-[0.55rem] font-bold uppercase !tracking-[0.3em] !text-[#e3e1da]/40">
                          SAFFT MARK
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
