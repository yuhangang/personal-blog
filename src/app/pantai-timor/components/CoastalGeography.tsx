"use client";

import dynamic from "next/dynamic";
import type { CoastalMapProps } from "@/components/showcase/CoastalMap";
import { FEATURED_IMAGES, PANTAI_TIMOR_COPY } from "../config";

const CoastalMap = dynamic<CoastalMapProps>(() => import("@/components/showcase/CoastalMap"), { ssr: false });

interface CoastalGeographyProps {
  onImageClick: (index: number) => void;
}

export const CoastalGeography = ({ onImageClick }: CoastalGeographyProps) => {
  return (
    <section id="geography" className="relative w-full !pt-10 !pb-10 md:!py-18 px-6 md:px-[calc((100vw-min(1700px,100vw-3rem))/2)] flex flex-col items-center z-10 overflow-hidden bg-[#10110F]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0c0a] to-transparent" />
      <div className="max-w-[1700px] w-full flex flex-col items-center">
        <div className="relative w-full self-stretch rounded-[1.9rem] border border-[#e3e1da]/10 bg-[#171813] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.46)] md:rounded-[2.25rem] md:p-4">
          <div className="relative w-full aspect-[3/4] min-h-[480px] overflow-hidden rounded-[1.35rem] bg-[#161715] sm:aspect-[16/11] md:aspect-[21/9] md:min-h-[560px] md:rounded-[1.7rem]">
            <CoastalMap
              overlayLabel={PANTAI_TIMOR_COPY.geography.label}
              overlayTitle={PANTAI_TIMOR_COPY.geography.title}
              onImageClick={(src) => {
                const index = FEATURED_IMAGES.findIndex((img) => img.src === src);
                if (index !== -1) onImageClick(index);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
