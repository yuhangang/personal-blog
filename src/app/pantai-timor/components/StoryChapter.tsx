"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { StoryChapter as StoryChapterData, StoryPlate } from "../story";
import { CoastalFinale } from "./CoastalFinale";
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
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        className={styles["plate-button"]}
        onClick={() => onOpen(plate.index)}
      >
        <span className={styles["plate-frame"]}>
          <span className={styles["plate-parallax"]}>
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              className={styles["plate-image"]}
              sizes={isSingle ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
            />
          </span>
          <span className={styles["plate-scrim"]} aria-hidden="true" />
        </span>
      </button>
      <figcaption className={styles["plate-caption"]}>{plate.caption}</figcaption>
    </motion.figure>
  );
};

interface CinemaPlateProps {
  plate: StoryPlate;
  onOpen: (index: number) => void;
}

const CinemaPlate = ({ plate, onOpen }: CinemaPlateProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={styles["cinema-plate"]}
      style={{ "--plate-ratio": plate.ratio } as CSSProperties}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        className={styles["cinema-button"]}
        onClick={() => onOpen(plate.index)}
      >
        <span className={styles["plate-frame"]}>
          <span className={styles["plate-parallax"]}>
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              className={styles["plate-image"]}
              sizes="100vw"
            />
          </span>
          <span className={styles["cinema-vignette"]} aria-hidden="true" />
        </span>
      </button>
      <figcaption className={styles["cinema-caption"]}>{plate.caption}</figcaption>
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
  const reduceMotion = useReducedMotion();
  const headingId = `${chapter.id}-title`;
  // Just where we are, and how far the road came to get here.
  const note =
    chapter.kmFromPrevious === null
      ? chapter.region
      : `${chapter.region}, ${chapter.kmFromPrevious} km south`;

  // Split standard plate rows from full-bleed cinema/finale rows so full-bleed
  // beats span 100% width cleanly without 100vw overflow hacks.
  const segments: Array<
    | { kind: "plates"; rows: StoryPlate[][] }
    | { kind: "cinema"; plate: StoryPlate }
    | { kind: "finale"; plate: StoryPlate }
  > = [];

  for (const row of chapter.rows) {
    if (row.length === 1 && row[0].presentation === "cinema") {
      segments.push({ kind: "cinema", plate: row[0] });
    } else if (row.length === 1 && row[0].presentation === "finale") {
      segments.push({ kind: "finale", plate: row[0] });
    } else {
      const last = segments.at(-1);
      if (last && last.kind === "plates") {
        last.rows.push(row);
      } else {
        segments.push({ kind: "plates", rows: [row] });
      }
    }
  }

  return (
    <section id={chapter.id} className={styles["story-chapter"]} aria-labelledby={headingId}>
      <motion.header
        className={styles["chapter-opener"]}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={styles["chapter-rule"]} aria-hidden="true" />
        <h2 id={headingId} className={`${cormorant.className} ${styles["chapter-title"]}`}>
          {chapter.title}
        </h2>
        <p className={styles["chapter-note"]}>{note}</p>
      </motion.header>

      {lead}

      {segments.map((segment, index) => {
        if (segment.kind === "cinema") {
          return (
            <CinemaPlate
              key={segment.plate.src}
              plate={segment.plate}
              onOpen={onOpenPlate}
            />
          );
        }
        if (segment.kind === "finale") {
          return (
            <CoastalFinale
              key={segment.plate.src}
              plate={segment.plate}
              onOpen={onOpenPlate}
            />
          );
        }
        return (
          <div key={`${chapter.id}-plates-${index}`} className={styles["chapter-plates"]}>
            {segment.rows.map((row) => (
              <div
                key={row.map((plate) => plate.src).join("|")}
                className={`${styles["plate-row"]} ${row.length === 1 ? styles["plate-row-single"] : ""}`}
              >
                {row.map((plate) => (
                  <Plate
                    key={plate.src}
                    plate={plate}
                    isSingle={row.length === 1}
                    onOpen={onOpenPlate}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}

      {coda}
    </section>
  );
};
