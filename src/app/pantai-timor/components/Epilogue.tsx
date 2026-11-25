"use client";

import Link from "next/link";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { ptTrack } from "@/utils/ga-events";
import styles from "../pantai-timor.module.scss";

/** The end of the road: no summary, just the ways out. */
export const Epilogue = () => {
  const { lenis } = useLenis();

  const backToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav id="epilogue" className={styles.epilogue} aria-label="End of Pantai Timor">
      <Link
        href="/gallery"
        className={styles["epilogue-link"]}
        onClick={() => ptTrack.navClick("gallery")}
      >
        ← Back to gallery
      </Link>
      <button type="button" className={styles["epilogue-link"]} onClick={backToTop}>
        Back to top ↑
      </button>
    </nav>
  );
};
