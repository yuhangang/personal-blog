"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import { ptTrack } from "@/utils/ga-events";
import { PANTAI_TIMOR_COPY } from "../config";
import { STORY_PLATES } from "../story";
import { ContactSheet } from "./ContactSheet";
import styles from "../pantai-timor.module.scss";

interface LightboxProps {
  activeImageIndex: number | null;
  setActiveImageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

const LAST = STORY_PLATES.length - 1;

/**
 * A plain viewer: the photograph on a dark ground, where it is and how far
 * through, and text controls. "Index" swaps the photo for a contact sheet.
 */
export const Lightbox = ({
  activeImageIndex,
  setActiveImageIndex,
  isGridView,
  setIsGridView,
}: LightboxProps) => {
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const reduceMotion = useReducedMotion();
  const prevIndexRef = useRef<number | null>(null);
  const scrollLockYRef = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const gridToggleRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Which side of the photo the pointer is over: the left 40% steps back,
  // the rest forward. It also sets the cursor.
  const [pointerSide, setPointerSide] = useState<"prev" | "next">("next");
  const sideAt = (clientX: number): "prev" | "next" => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return "next";
    return clientX < rect.left + rect.width * 0.4 ? "prev" : "next";
  };
  const isOpen = activeImageIndex !== null;

  useEffect(() => {
    if (activeImageIndex !== null && prevIndexRef.current === null) {
      ptTrack.lightboxOpen(activeImageIndex, STORY_PLATES[activeImageIndex].src);
    } else if (activeImageIndex === null && prevIndexRef.current !== null) {
      ptTrack.lightboxClose();
    } else if (
      activeImageIndex !== null &&
      prevIndexRef.current !== null &&
      activeImageIndex !== prevIndexRef.current
    ) {
      ptTrack.lightboxImageChange(
        prevIndexRef.current,
        activeImageIndex,
        STORY_PLATES[activeImageIndex].src
      );
    }
    prevIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex !== null) {
      ptTrack.lightboxToggleGrid(isGridView);
    }
  }, [isGridView, activeImageIndex]);

  useEffect(() => {
    if (activeImageIndex === null) return;

    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalLeft = body.style.left;
    const originalRight = body.style.right;
    const originalWidth = body.style.width;

    scrollLockYRef.current = window.scrollY;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollLockYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.left = originalLeft;
      body.style.right = originalRight;
      body.style.width = originalWidth;
      window.scrollTo(0, scrollLockYRef.current);
    };
  }, [activeImageIndex]);

  // Modal focus: everything outside the viewer goes inert so Tab stays inside,
  // focus starts on Close, and returns to the photo that opened it. Declared
  // after the scroll lock so the page is back in place before focus returns.
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const opener =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : null;
    const inertedNodes = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== dialog && !node.inert
    );

    inertedNodes.forEach((node) => {
      node.inert = true;
    });
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      inertedNodes.forEach((node) => {
        node.inert = false;
      });
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const close = () => {
    setIsGridView(false);
    setActiveImageIndex(null);
  };

  const step = (delta: 1 | -1) =>
    setActiveImageIndex((prev) =>
      prev === null ? prev : Math.min(LAST, Math.max(0, prev + delta))
    );

  const handleSheetSelect = (index: number) => {
    setActiveImageIndex(index);
    setIsGridView(false);
    // The sheet is about to unmount; keep focus on its toggle.
    gridToggleRef.current?.focus({ preventScroll: true });
  };

  if (!portalRoot) return null;

  const activeImage = activeImageIndex === null ? null : STORY_PLATES[activeImageIndex];

  return createPortal(
    <AnimatePresence>
      {activeImageIndex !== null && activeImage && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={PANTAI_TIMOR_COPY.lightbox.aria.dialog}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`${styles.viewer} ${isGridView ? styles["viewer-sheet-mode"] : ""}`}
        >
          <div className={styles["viewer-bar"]}>
            <p className={styles["viewer-status"]} aria-live="polite">
              {isGridView ? (
                <>{STORY_PLATES.length} photographs</>
              ) : (
                <>
                  <span className={styles["viewer-count"]}>
                    {activeImageIndex + 1} / {STORY_PLATES.length}
                  </span>
                  <span>{activeImage.caption}</span>
                </>
              )}
            </p>
            <div className={styles["viewer-actions"]}>
              <button
                ref={gridToggleRef}
                type="button"
                className={styles["viewer-text-btn"]}
                aria-pressed={isGridView}
                onClick={() => setIsGridView(!isGridView)}
              >
                Index
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles["viewer-text-btn"]}
                aria-label={PANTAI_TIMOR_COPY.lightbox.aria.closeLightbox}
                onClick={close}
              >
                Close
              </button>
            </div>
          </div>

          {isGridView ? (
            <div className={styles["viewer-sheet"]} data-lenis-prevent>
              <ContactSheet activeIndex={activeImageIndex} onSelect={handleSheetSelect} />
            </div>
          ) : (
            <>
              <div
                ref={stageRef}
                className={styles["viewer-stage"]}
                data-side={pointerSide}
                onPointerMove={(event) => setPointerSide(sideAt(event.clientX))}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeImageIndex}
                    className={styles["viewer-frame"]}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -90 || info.velocity.x < -500) step(1);
                      else if (info.offset.x > 90 || info.velocity.x > 500) step(-1);
                    }}
                    onTap={(event, info) => {
                      // Touch screens page by swiping; a tap shouldn't also step.
                      if ("pointerType" in event && event.pointerType !== "mouse") return;
                      // Read the side from the click itself; the cursor state
                      // can lag if the pointer jumped without moving.
                      const side = sideAt(info.point.x - window.scrollX);
                      setPointerSide(side);
                      step(side === "prev" ? -1 : 1);
                    }}
                  >
                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt}
                      fill
                      className={styles["viewer-image"]}
                      priority
                      sizes="100vw"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className={styles["viewer-foot"]}>
                <button
                  type="button"
                  className={styles["viewer-text-btn"]}
                  aria-label={PANTAI_TIMOR_COPY.lightbox.aria.prevPhoto}
                  disabled={activeImageIndex === 0}
                  onClick={() => step(-1)}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className={styles["viewer-text-btn"]}
                  aria-label={PANTAI_TIMOR_COPY.lightbox.aria.nextPhoto}
                  disabled={activeImageIndex === LAST}
                  onClick={() => step(1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
