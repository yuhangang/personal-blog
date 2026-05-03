"use client";

import dynamic from "next/dynamic";
import type { CoastalMapProps } from "@/components/showcase/CoastalMap";
import { CAROUSEL_IMAGES } from "./constants";

const CoastalMap = dynamic<CoastalMapProps>(() => import("@/components/showcase/CoastalMap"), { ssr: false });

interface GeographySectionProps {
  onImageClick: (index: number) => void;
}

export function GeographySection({ onImageClick }: GeographySectionProps) {
  return (
    <section className="relative w-full flex flex-col items-center z-10 bg-[#10110F]">
      <div className="max-w-[1700px] w-full flex flex-col items-center">
        <div className="relative w-full self-stretch rounded-[1.9rem] border border-[#e3e1da]/10 bg-[#171813] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.46)] md:rounded-[2.25rem] md:p-4">
          <div className="relative w-full aspect-[16/9] min-h-[400px] overflow-hidden rounded-[1.35rem] md:aspect-[21/9] md:rounded-[1.7rem]">
          <CoastalMap
            overlayLabel="COASTAL GEOGRAPHY"
            overlayTitle="The Eastern Enclave"
            onImageClick={(src) => {
              const index = CAROUSEL_IMAGES.findIndex((image) => image.src === src);
              if (index !== -1) onImageClick(index);
            }}
          />
        </div>
        </div>
      </div>
    </section>
  );
}
