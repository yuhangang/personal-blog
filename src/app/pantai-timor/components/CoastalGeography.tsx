"use client";

import dynamic from "next/dynamic";
import { Cormorant_Garamond } from "next/font/google";
import type { CoastalMapProps } from "@/components/showcase/CoastalMap";
import { CAROUSEL_IMAGES } from "../data";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

const CoastalMap = dynamic<CoastalMapProps>(() => import("@/components/showcase/CoastalMap"), { ssr: false });

interface CoastalGeographyProps {
  onImageClick: (index: number) => void;
}

export const CoastalGeography = ({ onImageClick }: CoastalGeographyProps) => {
  return (
    <section id="geography" className="relative w-full !pt-24 !pb-10 md:!py-44 !px-4 md:!px-8 flex flex-col items-center z-10 overflow-hidden bg-[#10110F]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0c0a] to-transparent" />
      <div className="max-w-[1700px] w-full">
        <div className="grid gap-10 !mb-10 md:!mb-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(21rem,0.52fr)] lg:items-end">
          <div>
            <h3 className="font-sans !mb-0 !text-[0.65rem] font-black uppercase !tracking-[0.34em] !text-[#e3e1da] md:!tracking-[0.4em]">
              COASTAL GEOGRAPHY
            </h3>
            <h4 className={`${cormorant.className} !mt-8 !mb-0 max-w-[42rem] !text-[clamp(2.8rem,10vw,4rem)] !leading-[1.02] !text-[#e3e1da] text-balance font-semibold`}>
              The Eastern Enclave
            </h4>
          </div>
          <p className="max-w-[31rem] !mb-0 !text-[0.85rem] md:!text-[0.95rem] !leading-[2] !text-[#e3e1da]/52 text-pretty lg:justify-self-end">
            Spanning the peninsula&apos;s eastern edge, this map traces islands, beaches, lakes, heritage sites, and rainforest thresholds from Bachok to the ancient rocks of Dungun.
          </p>
        </div>
        
        <div className="relative bg-[#171813] shadow-[0_40px_120px_rgba(0,0,0,0.46)]">
          <div className="relative w-full aspect-[3/4] min-h-[480px] overflow-hidden bg-[#161715] sm:aspect-[16/11] md:aspect-[21/9] md:min-h-[560px]">
            <CoastalMap onImageClick={(src) => {
              const index = CAROUSEL_IMAGES.findIndex(img => img.src === src);
              if (index !== -1) onImageClick(index);
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};
