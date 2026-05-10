"use client";

import dynamic from "next/dynamic";
import type { CoastalMapProps } from "@/components/showcase/CoastalMap";
import { FEATURED_IMAGES, PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

const CoastalMap = dynamic<CoastalMapProps>(() => import("@/components/showcase/CoastalMap"), { ssr: false });

interface CoastalGeographyProps {
  onImageClick: (index: number) => void;
}

export const CoastalGeography = ({ onImageClick }: CoastalGeographyProps) => {
  return (
    <section id="geography" className={styles["geography-section"]}>
      <div className={styles["geography-gradient-top"]} />
      <div className={styles["geography-container"]}>
        <div className={styles["map-card"]}>
          <div className={styles["map-viewport"]}>
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
