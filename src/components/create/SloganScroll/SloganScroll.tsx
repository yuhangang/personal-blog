"use client";

import { useRef, useState, useEffect } from "react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import styles from "./SloganScroll.module.scss";

import SloganVisuals from "./SloganVisuals";
import SloganItem from "./SloganItem";
import { SLOGAN_ITEMS } from "./sloganConfig";

export default function SloganScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  /*
   * Lenis Integration for Snapping
   */
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { lenis } = useLenis();

  useEffect(() => {
    // If no Lenis instance, we can't snap elegantly (or could fallback, but let's rely on Lenis)
    if (!lenis) return;

    const handleScroll = () => {
      // Clear existing timeout on every scroll event
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect scroll stop (Debounce period)
      // "auto scroll only move after a debounce period"
      scrollTimeoutRef.current = setTimeout(() => {
        snapToClosest();
      }, 300); // 300ms debounce as requested for a bit of a pause
    };

    const snapToClosest = () => {
      const items = document.querySelectorAll(`.${styles.sloganItem}`);
      const listContainer = document.querySelector(`.${styles.sloganList}`);

      if (!items.length || !listContainer) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      // BOUNDARY CHECK:
      // Check if the slogan list container is actually covering the center of the screen.
      // If the user has scrolled past it (top is way above, bottom is above center)
      // or hasn't reached it (top is below center), we shouldn't snap.
      const listRect = listContainer.getBoundingClientRect();
      const listTop = listRect.top;
      const listBottom = listRect.bottom;

      // Allow a small buffer? No, strict check is safer for "not the cover".
      // If center of screen is NOT inside the list container, abort.
      if (viewportCenter < listTop || viewportCenter > listBottom) {
        return;
      }

      let closestItem: Element | null = null;
      let minDistance = Infinity;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      if (closestItem) {
        // "not necessrily need to alaways center it"
        // Magnetic Snap: Only snap if we are reasonably close (e.g. within 30% of viewport)
        const SNAP_THRESHOLD = window.innerHeight * 0.3;

        if (minDistance > SNAP_THRESHOLD) {
          return;
        }

        // "make it slower" + hyogen feel
        // Hyogen feel = Viscous, heavy inertia.
        // Use EaseInOutQuart (Power 4) for heavy startup/slowdown.
        // Duration 2.5s for that slow, luxurious drift.

        lenis.scrollTo(closestItem as HTMLElement, {
          offset:
            -window.innerHeight / 2 +
            (closestItem as HTMLElement).offsetHeight / 2,
          duration: 2.5,
          lock: false,
          easing: (t) =>
            t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2, // EaseInOutQuart
        });
      }
    };

    // Use Lenis's scroll event
    // lenis.on returns an unsubscribe function in recent versions?
    // Checking SmoothScroll.tsx, it creates `new Lenis({...})`.
    // The library usually returns the instance. We can use .on().
    const unsubscribe = lenis.on("scroll", handleScroll);

    return () => {
      // Clean up
      if (typeof unsubscribe === "function") {
        unsubscribe();
      } else {
        // Fallback if older version of lenis where .on doesn't return unsub
        lenis.off("scroll", handleScroll);
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [lenis]);

  return (
    <section className={styles.section} ref={containerRef}>
      <div className={styles.layoutGrid}>
        {/* LEFT: SLOGANS (SCROLLING) */}
        <div className={styles.sloganList}>
          {SLOGAN_ITEMS.map(
            (feature: { title: string; desc: string }, i: number) => (
              <SloganItem
                key={i}
                index={i}
                title={feature.title}
                desc={feature.desc}
                setActiveIndex={setActiveIndex}
              />
            )
          )}
        </div>

        {/* RIGHT: VISUALS (STICKY) */}
        <div className={styles.stickyVisualWrapper}>
          <div className={styles.visualContainer}>
            <SloganVisuals activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}
