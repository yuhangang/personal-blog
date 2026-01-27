"use client";

import { useRef, useState, useEffect } from "react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import styles from "./SloganScroll.module.scss";

import { SLOGAN_ITEMS } from "./sloganConfig";
// Remove useScroll import
import SloganVisuals from "./SloganVisuals";
import SloganTextDisplay from "./SloganTextDisplay";

export default function SloganScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null!);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  /*
   * Lenis Integration for Snapping
   */
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInteracting = useRef(false); // Track if user is holding the screen
  const { lenis } = useLenis();

  // Track which item is in view
  useEffect(() => {
    const handleScroll = () => {
      const trackItems = itemRefs.current;
      const viewportCenter = window.innerHeight / 2;
      let minDist = Infinity;
      let closestIndex = 0;

      trackItems.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        // Calculate distance from center of item to center of viewport
        const itemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - viewportCenter);

        if (dist < minDist) {
          minDist = dist;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    // Attach listener
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // If no Lenis instance, we can't snap elegantly
    if (!lenis) return;

    const handleScroll = () => {
      // Clear existing timeout on every scroll event
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // If user is holding the screen, DO NOT schedule a snap.
      // We will only snap when they release (onInteractEnd will trigger this).
      if (isInteracting.current) return;

      // Set new timeout to detect scroll stop (Debounce period)
      scrollTimeoutRef.current = setTimeout(() => {
        snapToClosest();
      }, 300); // Increased debounce to 300ms for better stability
    };

    const snapToClosest = () => {
      const items = document.querySelectorAll(`.${styles.trackItem}`);
      const listContainer = document.querySelector(`.${styles.scrollTrack}`);

      if (!items.length || !listContainer) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      // BOUNDARY CHECK:
      const listRect = listContainer.getBoundingClientRect();
      const listTop = listRect.top;
      const listBottom = listRect.bottom;

      // MOMENTUM CHECK:
      if (Math.abs(lenis.velocity) > 0.5) return;

      if (viewportCenter < listTop || viewportCenter > listBottom) return;

      // EXIT CHECK:
      // If we are significantly past the last item, STOP snapping.
      // This prevents the "trap" sensation when scrolling to the next section.
      const lastItem = items[items.length - 1];
      if (lastItem) {
        const lastRect = lastItem.getBoundingClientRect();
        const lastItemCenter = lastRect.top + lastRect.height / 2;

        // EXIT CHECK 1: Velocity Escape
        // If scrolling DOWN (positive velocity) and we've already passed the center of the last item,
        // DO NOT snap back. Let the user pass freely.
        if (lenis.velocity > 0 && lastItemCenter < viewportCenter) return;

        // EXIT CHECK 2: Distance Threshold
        // If the center of the last item is ABOVE the viewport center by more than the threshold, we are leaving.
        if (
          viewportCenter - lastItemCenter >
          Math.min(viewportHeight * 0.1, 150)
        )
          return;
      }

      // Backstop: If list bottom is high up, definitely stop.
      if (listBottom < viewportHeight * 0.8) return;

      let closestItem: HTMLElement | null = null;
      let minDistance = Infinity;

      items.forEach((node) => {
        const item = node as HTMLElement;

        // Skip the sticky first item from snapping to avoid a "scroll trap"
        // Since it stays centered visually for 50vh, snapping to it forces scroll back to 0.
        if (item.classList.contains(styles.stickyFirst)) return;

        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      // ONLY SNAP IF VERY CLOSE
      // Threshold: 10% of viewport OR max 150px (prevents huge snap zones on large screens)
      const snapThreshold = Math.min(viewportHeight * 0.1, 150);

      // console.log(`[SloganSnap] Checking snap. Threshold: ${snapThreshold}px`, { viewportCenter, listTop, listBottom });

      if (closestItem && minDistance < snapThreshold) {
        const item = closestItem as HTMLElement;

        // console.log(`[SloganSnap] Snapping to item `, item.innerText.substring(0, 20), ` Distance: ${minDistance}`);

        // Sticky Trap Guard Removed

        lenis.scrollTo(item, {
          offset: 0,
          duration: 0.8,
          lock: false,
          easing: (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        });
      }
    };

    // Interaction Handlers
    const onInteractStart = () => {
      isInteracting.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };

    const onInteractEnd = () => {
      isInteracting.current = false;
      // Trigger a check immediately in case we are stopped
      handleScroll();
    };

    // Wheel Handler
    const onWheel = () => {
      // Treat wheel as interaction: clear existing snap timer
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      // Reschedule snap
      scrollTimeoutRef.current = setTimeout(() => {
        isInteracting.current = false; // ensuring this reset
        snapToClosest();
      }, 300);
    };

    // Bind interaction events to window with CAPTURE to catch everything
    // Use both Pointer and Touch to be absolutely sure on all devices
    const opts = { capture: true };
    const passiveOpts = { capture: true, passive: true };

    window.addEventListener("pointerdown", onInteractStart, opts);
    window.addEventListener("pointerup", onInteractEnd, opts);
    window.addEventListener("pointercancel", onInteractEnd, opts);

    window.addEventListener("touchstart", onInteractStart, passiveOpts);
    window.addEventListener("touchend", onInteractEnd, opts);
    window.addEventListener("touchcancel", onInteractEnd, opts);

    // Fallback for non-pointer browsers (rare but safe)
    window.addEventListener("mousedown", onInteractStart, opts);
    window.addEventListener("mouseup", onInteractEnd, opts);

    // Wheel listener for trackpads
    window.addEventListener("wheel", onWheel, passiveOpts);

    // Lenis Scroll Event
    const unsubscribe = lenis.on("scroll", handleScroll);

    return () => {
      // Clean up
      window.removeEventListener("pointerdown", onInteractStart, opts);
      window.removeEventListener("pointerup", onInteractEnd, opts);
      window.removeEventListener("pointercancel", onInteractEnd, opts);

      window.removeEventListener("touchstart", onInteractStart, passiveOpts);
      window.removeEventListener("touchend", onInteractEnd, opts);
      window.removeEventListener("touchcancel", onInteractEnd, opts);

      window.removeEventListener("mousedown", onInteractStart, opts);
      window.removeEventListener("mouseup", onInteractEnd, opts);

      window.removeEventListener("wheel", onWheel, passiveOpts);

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
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.layoutGrid}>
        {/* LEFT: STICKY TEXT */}
        <div className={styles.sloganList}>
          <SloganTextDisplay activeIndex={activeIndex} />

          {/* Scroll Indicator - Modern Retro Technical Style */}
          <div className={styles.scrollIndicator}>
            <div className={styles.indicatorTrack}>
              <div
                className={styles.progressBar}
                style={{
                  transform: `scaleX(${(activeIndex + 1) / SLOGAN_ITEMS.length})`,
                }}
              />
            </div>
            <span className={styles.indicatorNum}>
              {activeIndex + 1}/{SLOGAN_ITEMS.length}
            </span>
          </div>
        </div>

        {/* RIGHT: SCROLLABLE VISUALS TRACK */}
        <div className={styles.scrollTrack}>
          {/* STICKY CANVAS BEHIND TRACK ITEMS */}
          <div className={styles.stickyVisualWrapper}>
            <div className={styles.visualContainer}>
              <SloganVisuals activeIndex={activeIndex} />
            </div>
          </div>

          {/* INVISIBLE SCROLL TRIGGERS */}
          {SLOGAN_ITEMS.map((_, i) => (
            <div
              key={i}
              className={styles.trackItem}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
