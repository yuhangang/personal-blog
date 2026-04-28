"use client";

import dynamic from "next/dynamic";
import { CAROUSEL_IMAGES } from "./constants";
import type { PantaiTimorFontClasses } from "./types";

const CoastalMap = dynamic(() => import("@/components/showcase/CoastalMap"), { ssr: false });

interface GeographySectionProps {
  fonts: PantaiTimorFontClasses;
  onImageClick: (index: number) => void;
}

export function GeographySection({ fonts, onImageClick }: GeographySectionProps) {
  return (
    <section className="relative w-full flex flex-col items-center z-10 bg-[#10110F]">
      <div className="max-w-[1700px] w-full flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-[32rem] mb-20 md:mb-32">
          <h3 className="font-sans !mb-0 !text-[0.65rem] font-black uppercase !tracking-[0.34em] !text-[#e3e1da] md:!tracking-[0.4em]">
            COASTAL GEOGRAPHY
          </h3>
          <h4 className={`${fonts.serif} !mt-10 !mb-0 !text-[2rem] md:!text-[3rem] !leading-[1.1] !text-[#e3e1da] text-balance`}>
            The Eastern Enclave
          </h4>
          <p className="!mb-0 !mt-8 !text-[0.85rem] md:!text-[0.95rem] !leading-[2] !text-[#e3e1da]/50 text-pretty">
            Spanning the length of the peninsula&apos;s eastern edge, our journey explores the unique character of each settlement, from the northern gates of Bachok to the ancient rocks of Dungun.
          </p>
        </div>

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[400px] overflow-hidden">
          <CoastalMap
            onImageClick={(src) => {
              const index = CAROUSEL_IMAGES.findIndex((image) => image.src === src);
              if (index !== -1) onImageClick(index);
            }}
          />
        </div>
      </div>
    </section>
  );
}
