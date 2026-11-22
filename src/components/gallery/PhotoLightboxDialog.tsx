"use client";

import React, { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Compass, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { GalleryMapPhoto } from "@/config/gallery";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { formatCoordinates } from "./photoClustering";
import { useHorizontalScrollHints } from "./useHorizontalScrollHints";
import styles from "./PhotoLightboxDialog.module.scss";

interface PhotoLightboxDialogProps {
  photos: GalleryMapPhoto[];
  activePhoto: GalleryMapPhoto | null;
  onSelectPhoto: (photo: GalleryMapPhoto) => void;
  onClose: () => void;
  onFlyToPhoto: (photo: GalleryMapPhoto) => void;
}

export default function PhotoLightboxDialog({
  photos,
  activePhoto,
  onSelectPhoto,
  onClose,
  onFlyToPhoto,
}: PhotoLightboxDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const spotStripRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { lenis } = useLenis();
  const prefersReducedMotion = useReducedMotion();

  const currentIndex = activePhoto
    ? photos.findIndex((item) => item.id === activePhoto.id)
    : -1;

  useHorizontalScrollHints(spotStripRef, {
    moreStartClass: styles.moreStart,
    moreEndClass: styles.moreEnd,
    refreshKey: `${activePhoto?.id ?? "closed"}-${photos.length}`,
  });

  useEffect(() => {
    const strip = spotStripRef.current;
    if (!strip || !activePhoto || strip.scrollWidth <= strip.clientWidth) return;

    const thumb = strip.querySelector<HTMLElement>(
      `[data-photo-id="${CSS.escape(activePhoto.id)}"]`,
    );
    if (!thumb) return;

    const centeredLeft =
      thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2;
    const clampedLeft = Math.max(
      0,
      Math.min(centeredLeft, strip.scrollWidth - strip.clientWidth),
    );
    strip.scrollTo({
      left: clampedLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activePhoto, photos.length, prefersReducedMotion]);

  // Open / close native top-layer modal dialog cleanly
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activePhoto) {
      if (!dialog.open) {
        dialog.showModal();
      }
      lenis?.stop();
    } else if (dialog.open) {
      dialog.close();
      lenis?.start();
    }

    return () => {
      lenis?.start();
    };
  }, [activePhoto, lenis]);

  // Progressive fallback for browsers missing <dialog closedby="any"> (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", onPointerDown);
    dialog.addEventListener("pointerup", onPointerUp);

    return () => {
      dialog.removeEventListener("pointerdown", onPointerDown);
      dialog.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  // Keyboard Prev/Next navigation while modal is open
  useEffect(() => {
    if (!activePhoto || photos.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
        onSelectPhoto(photos[prevIdx]);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIdx = (currentIndex + 1) % photos.length;
        onSelectPhoto(photos[nextIdx]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, currentIndex, onSelectPhoto, photos]);

  const handlePrev = () => {
    if (photos.length <= 1 || currentIndex < 0) return;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIdx]);
  };

  const handleNext = () => {
    if (photos.length <= 1 || currentIndex < 0) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIdx]);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={styles.dialog}
      onClose={onClose}
      {...({ closedby: "any" } as Record<string, unknown>)}
    >
      {activePhoto && (
        <>
          <header className={styles.header}>
            <div className={styles.headerMeta}>
              <p className={styles.kicker}>
                {activePhoto.frameCode} · {activePhoto.region} ·{" "}
                {formatCoordinates(activePhoto.lat, activePhoto.lng)}
              </p>
              <h2 id={titleId} className={styles.title}>
                {activePhoto.placeName}
              </h2>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => {
                  const target = activePhoto;
                  onClose();
                  onFlyToPhoto(target);
                }}
              >
                <Compass size={15} strokeWidth={1.75} aria-hidden="true" />
                <span>Fly Here</span>
              </button>

              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close photo viewer"
                autoFocus
                onClick={() => dialogRef.current?.close()}
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className={styles.stage}>
            {photos.length > 1 && (
              <button
                type="button"
                className={`${styles.navButton} ${styles.prev}`}
                aria-label="Previous photograph"
                onClick={handlePrev}
              >
                <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}

            <div className={styles.imageFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={activePhoto.id}
                src={activePhoto.image}
                alt={activePhoto.alt}
                className={styles.image}
                decoding="async"
                draggable={false}
              />
            </div>

            {photos.length > 1 && (
              <button
                type="button"
                className={`${styles.navButton} ${styles.next}`}
                aria-label="Next photograph"
                onClick={handleNext}
              >
                <ChevronRight size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
          </div>

          <footer className={styles.footer}>
            <div className={styles.footerTop}>
              {activePhoto.description ? (
                <p className={styles.description}>{activePhoto.description}</p>
              ) : (
                <span />
              )}
              <div className={styles.footerLinks}>
                <span className={styles.counter}>
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(photos.length).padStart(2, "0")}
                </span>
                <Link
                  href={activePhoto.collectionHref}
                  className={styles.essayLink}
                  onClick={() => onClose()}
                >
                  <span>{activePhoto.collectionTitle}</span>
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {photos.length > 1 && (
              <div
                ref={spotStripRef}
                className={styles.spotStrip}
                aria-label="Photographs in selection"
              >
                {photos.map((item) => {
                  const isSelected = item.id === activePhoto.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-photo-id={item.id}
                      className={styles.spotThumbButton}
                      aria-label={`View ${item.frameCode} at ${item.placeName}`}
                      aria-pressed={isSelected}
                      onClick={() => onSelectPhoto(item)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumb}
                        alt=""
                        className={styles.spotThumbImg}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </footer>
        </>
      )}
    </dialog>
  );
}
