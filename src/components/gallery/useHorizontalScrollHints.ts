"use client";

import { useEffect, type RefObject } from "react";

interface HorizontalScrollHintOptions {
  moreStartClass: string;
  moreEndClass: string;
  /** Changing this value (e.g. item count or open flag) re-attaches observers. */
  refreshKey?: string | number | boolean;
}

/**
 * Fallback scroll-edge detection for horizontal scrollers when CSS
 * scroll-driven `animation-timeline: scroll()` is unsupported.
 * Observes only the first and last child elements via IntersectionObserver
 * to toggle `moreStartClass` and `moreEndClass`.
 */
export function useHorizontalScrollHints(
  scrollerRef: RefObject<HTMLElement | null>,
  { moreStartClass, moreEndClass, refreshKey }: HorizontalScrollHintOptions,
) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "scroll()")
    ) {
      return;
    }

    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;

    if (!first || !last) {
      scroller.classList.remove(moreStartClass, moreEndClass);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === first) {
            scroller.classList.toggle(moreStartClass, !entry.isIntersecting);
          }
          if (entry.target === last) {
            scroller.classList.toggle(moreEndClass, !entry.isIntersecting);
          }
        }
      },
      {
        root: scroller,
        rootMargin: "1px",
        threshold: 1,
      },
    );

    observer.observe(first);
    if (last !== first) {
      observer.observe(last);
    }

    return () => {
      observer.disconnect();
      scroller.classList.remove(moreStartClass, moreEndClass);
    };
  }, [scrollerRef, moreStartClass, moreEndClass, refreshKey]);
}
