"use client";

import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import type { CSSProperties } from "react";
import { STORY_CHAPTERS } from "../story";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface ContactSheetProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * Every photograph once, in story order, grouped by chapter: a contact sheet
 * rather than a canvas to drag around. Frames keep their own shape at a
 * shared row height.
 */
export const ContactSheet = ({ activeIndex, onSelect }: ContactSheetProps) => (
  <div className={styles.sheet}>
    {STORY_CHAPTERS.map((chapter) => (
      <section
        key={chapter.id}
        className={styles["sheet-chapter"]}
        aria-labelledby={`sheet-${chapter.id}`}
      >
        <h3 id={`sheet-${chapter.id}`} className={`${cormorant.className} ${styles["sheet-title"]}`}>
          {chapter.title}
        </h3>
        <div className={styles["sheet-row"]}>
          {chapter.rows.flat().map((plate) => (
            <button
              key={plate.src}
              type="button"
              className={styles["sheet-cell"]}
              style={{ "--plate-ratio": plate.ratio } as CSSProperties}
              aria-current={plate.index === activeIndex ? "true" : undefined}
              onClick={() => onSelect(plate.index)}
            >
              <Image
                src={plate.thumb}
                alt={plate.alt}
                fill
                sizes="(min-width: 768px) 300px, 50vw"
                className={styles["sheet-image"]}
              />
            </button>
          ))}
        </div>
      </section>
    ))}
  </div>
);
