"use client";

import Image from "next/image";
import { PantaiFrame, PantaiSection, pantaiLayout } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

export const VillageRhythms = () => {
  return (
    <PantaiSection id="village" className={`${styles["village-section"]} ${pantaiLayout.gutters}`}>
      <PantaiFrame>
        <div className={styles["village-container"]}>
          {/* Split Image Diptych */}
          <div className={styles["village-split-bg"]}>
            <div className={styles["village-image-wrapper"]}>
              <Image 
                src="https://cdn.yuhangang.com/pantai-timor/DSC00645.JPG" 
                alt="Village Life" 
                fill 
                className={styles["village-image"]} 
                sizes="(min-width: 768px) 50vw, 100vw" 
              />
            </div>
            <div className={`${styles["village-image-wrapper"]} ${styles["border-top"]}`}>
              <Image 
                src="https://cdn.yuhangang.com/pantai-timor/DSC00788.JPG" 
                alt="Coastal House" 
                fill 
                className={styles["village-image"]} 
                sizes="(min-width: 768px) 50vw, 100vw" 
              />
            </div>
          </div>
        </div>
      </PantaiFrame>
    </PantaiSection>
  );
};
