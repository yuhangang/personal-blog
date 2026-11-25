"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { StoryChapter as StoryChapterData, StoryPlate } from "../story";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface PlateProps {
  plate: StoryPlate;
  isSingle: boolean;
  onOpen: (index: number) => void;
}

const Plate = ({ plate, isSingle, onOpen }: PlateProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={styles.plate}
      style={{ "--plate-ratio": plate.ratio } as CSSProperties}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        className={styles["plate-button"]}
        onClick={() => onOpen(plate.index)}
      >
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          className={styles["plate-image"]}
          sizes={
            isSingle
              ? `(min-width: 768px) min(1436px, ${Math.round(82 * plate.ratio)}vh), 100vw`
              : "(min-width: 768px) 50vw, 100vw"
          }
        />
      </button>
      <figcaption className={styles["plate-caption"]}>{plate.caption}</figcaption>
    </motion.figure>
  );
};

interface StoryChapterProps {
  chapter: StoryChapterData;
  onOpenPlate: (index: number) => void;
  /** Immersive piece between the opener and the plates. */
  lead?: ReactNode;
  /** Pieces after the plates, before the next chapter. */
  coda?: ReactNode;
}

export const StoryChapter = ({ chapter, onOpenPlate, lead, coda }: StoryChapterProps) => {
  const headingId = `${chapter.id}-title`;
  // Just where we are, and how far the road came to get here.
  const note =
    chapter.kmFromPrevious === null
      ? chapter.region
      : `${chapter.region}, ${chapter.kmFromPrevious} km south`;

  return (
    <section id={chapter.id} className={styles["story-chapter"]} aria-labelledby={headingId}>
      <header className={styles["chapter-opener"]}>
        <h2 id={headingId} className={`${cormorant.className} ${styles["chapter-title"]}`}>
          {chapter.title}
        </h2>
        <p className={styles["chapter-note"]}>{note}</p>
      </header>

      {lead}

      <div className={styles["chapter-plates"]}>
        {chapter.rows.map((row) => (
          <div
            key={row.map((plate) => plate.src).join("|")}
            className={`${styles["plate-row"]} ${row.length === 1 ? styles["plate-row-single"] : ""}`}
          >
            {row.map((plate) => (
              <Plate key={plate.src} plate={plate} isSingle={row.length === 1} onOpen={onOpenPlate} />
            ))}
          </div>
        ))}
      </div>

      {coda}
    </section>
  );
};
