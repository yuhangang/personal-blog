"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import styles from "./PageCover.module.scss";

interface PageCoverProps {
  src: string;
  alt: string;
  credit: string;
  ariaLabel: string;
  scrollTargetId: string;
  headline?: ReactNode;
  subtitle?: ReactNode;
  focal?: "penang" | "manaslu";
}

export default function PageCover({
  src,
  alt,
  credit,
  ariaLabel,
  scrollTargetId,
  headline,
  subtitle,
  focal = "penang",
}: PageCoverProps) {
  const { lenis } = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const imageClassName = `${styles.coverImage} ${
    focal === "manaslu" ? styles.focalManaslu : styles.focalPenang
  }`;
  const hasHeader = Boolean(headline || subtitle);

  const scrollToContent = () => {
    const coverBottom = sectionRef.current
      ? Math.ceil(sectionRef.current.getBoundingClientRect().bottom + window.scrollY)
      : null;
    const targetEl = document.getElementById(scrollTargetId);
    const targetY =
      coverBottom ??
      (targetEl
        ? Math.ceil(targetEl.getBoundingClientRect().top + window.scrollY)
        : window.innerHeight);

    if (lenis) {
      lenis.resize();
      lenis.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const handleCoverClick = () => {
    if (window.getSelection()?.toString()) return;
    scrollToContent();
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    scrollToContent();
  };

  return (
    <section
      ref={sectionRef}
      className={styles.coverSection}
      aria-label={ariaLabel}
      data-nav-cover=""
      onClick={handleCoverClick}
    >
      <div className={styles.coverFrame}>
        <Image
          src={src}
          alt={alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className={imageClassName}
        />
        <div className={styles.scrimTop} aria-hidden="true" />
        {hasHeader && <div className={styles.scrimRadial} aria-hidden="true" />}
        <div className={styles.scrimBottom} aria-hidden="true" />
        <div className={styles.coverOverlay}>
          {hasHeader && (
            <div className={styles.coverHeader}>
              {headline && <p className={styles.coverHeadline}>{headline}</p>}
              {subtitle && <p className={styles.coverSubtitle}>{subtitle}</p>}
            </div>
          )}
          <div className={styles.coverBottomRow}>
            <span className={styles.coverCredit}>{credit}</span>
            <button
              type="button"
              className={styles.scrollCue}
              onClick={handleButtonClick}
              aria-label="Scroll to content"
            >
              <span className={styles.scrollCueLabel}>Scroll</span>
              <ArrowDown
                size={14}
                strokeWidth={1.75}
                className={styles.scrollCueIcon}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
