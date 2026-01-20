"use client";

import { useRef, useState, useEffect } from "react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import styles from "./SloganScroll.module.scss";

import SloganVisuals from "./SloganVisuals";
import SloganItem from "./SloganItem";
import IdentitySloganItem from "./IdentitySloganItem";
import { SLOGAN_ITEMS } from "./sloganConfig";
import { useScroll } from "framer-motion";

export default function SloganScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  /*
   * Lenis Integration for Snapping
   */
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInteracting = useRef(false); // Track if user is holding the screen
  const { lenis } = useLenis();

  // Track global list progress to drive the "Sticky Fade" of the last item
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

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
      const items = document.querySelectorAll(`.${styles.sloganItem}`);
      const listContainer = document.querySelector(`.${styles.sloganList}`);

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
      // Leave more room at the end for natural scrolling
      if (listBottom < viewportHeight * 1.1) return;

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
    <section className={styles.section} ref={containerRef}>
      <div className={styles.layoutGrid}>
        {/* LEFT: SLOGANS (SCROLLING) */}
        <div className={styles.sloganList} ref={listRef}>
          {SLOGAN_ITEMS.map(
            (
              feature: {
                title: string;
                desc: string;
                alternateTitles?: { text: string; lang: string }[];
              },
              i: number,
            ) => {
              // Conditional Render: Use IdentityComponent if it has alternate titles
              if (feature.alternateTitles) {
                return (
                  <IdentitySloganItem
                    key={i}
                    index={i}
                    title={feature.title}
                    alternateTitles={feature.alternateTitles}
                    desc={feature.desc}
                    setActiveIndex={setActiveIndex}
                    isFirst={i === 0}
                    isLast={i === SLOGAN_ITEMS.length - 1}
                    // Since it replaces the first item, it likely won't be the last, but keep prop for safety
                    listProgress={listProgress}
                    totalCount={SLOGAN_ITEMS.length}
                  />
                );
              }

              return (
                <SloganItem
                  key={i}
                  index={i}
                  title={feature.title}
                  desc={feature.desc}
                  setActiveIndex={setActiveIndex}
                  isLast={i === SLOGAN_ITEMS.length - 1}
                  listProgress={listProgress}
                  totalCount={SLOGAN_ITEMS.length}
                />
              );
            },
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
