"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
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
  stickyParallax?: boolean;
  immersive?: boolean;
  headerAlign?: "center" | "top-left";
  showScrollCue?: boolean;
  stickyHeader?: boolean;
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
  stickyParallax = false,
  immersive = false,
  headerAlign = "center",
  showScrollCue = true,
  stickyHeader = false,
}: PageCoverProps) {
  const { lenis } = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const isSticky = stickyParallax || immersive;
  const sectionClassName = [
    styles.coverSection,
    stickyParallax ? styles.coverSectionSticky : "",
    immersive ? styles.coverSectionImmersive : "",
    headerAlign === "top-left" ? styles.coverHeaderAlignTopLeft : "",
    stickyHeader ? styles.coverStickyHeader : "",
    !showScrollCue ? styles.coverNoClick : "",
  ]
    .filter(Boolean)
    .join(" ");
  const imageClassName = `${styles.coverImage} ${
    focal === "manaslu" ? styles.focalManaslu : styles.focalPenang
  }`;
  const hasHeader = Boolean(headline || subtitle);

  useEffect(() => {
    if (!isSticky) return;
    const el = sectionRef.current;
    if (!el) return;

    // Native CSS Scroll-Driven Animations handle progress on the compositor thread
    // when supported; only attach the JS scroll listener as a fallback.
    const supportsScrollDriven =
      typeof window !== "undefined" &&
      Boolean(
        window.CSS?.supports?.(
          "(animation-timeline: scroll()) and (animation-range: 0% 100%)"
        )
      );
    if (supportsScrollDriven) return;

    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      const maxScroll = stickyHeader
        ? Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1
          )
        : el.offsetHeight || window.innerHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      el.style.setProperty("--cover-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isSticky, stickyHeader]);

  const scrollToContent = () => {
    const targetEl = document.getElementById(scrollTargetId);
    const targetTop = targetEl
      ? Math.ceil(targetEl.getBoundingClientRect().top + window.scrollY)
      : null;
    const coverBottom = sectionRef.current
      ? Math.ceil(sectionRef.current.offsetHeight)
      : null;
    const targetY = targetTop ?? coverBottom ?? window.innerHeight;

    if (lenis) {
      lenis.resize();
      lenis.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const handleCoverClick = () => {
    if (!showScrollCue) return;
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
      className={sectionClassName}
      aria-label={ariaLabel}
      data-nav-cover={stickyHeader ? "fixed" : isSticky ? "sticky" : ""}
      onClick={handleCoverClick}
    >
      <div className={styles.coverFrame}>
        <div className={styles.coverMedia}>
          <Image
            src={src}
            alt={alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className={imageClassName}
          />
        </div>
        <div className={styles.scrimTop} aria-hidden="true" />
        {hasHeader && <div className={styles.scrimRadial} aria-hidden="true" />}
        <div className={styles.scrimBottom} aria-hidden="true" />
        {isSticky && <div className={styles.coverDim} aria-hidden="true" />}
        <div className={styles.coverOverlay}>
          {hasHeader && (
            <div className={styles.coverHeader}>
              {headline && <p className={styles.coverHeadline}>{headline}</p>}
              {subtitle && <p className={styles.coverSubtitle}>{subtitle}</p>}
            </div>
          )}
          <div className={styles.coverBottomRow}>
            <span className={styles.coverCredit}>{credit}</span>
            {showScrollCue && (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
