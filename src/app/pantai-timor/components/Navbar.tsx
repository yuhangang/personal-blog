"use client";

import { motion, MotionValue, useMotionTemplate, useTransform } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import React from "react";
import { ptTrack } from "@/utils/ga-events";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface NavbarProps {
  navBgOpacity: MotionValue<number>;
  navTitleOpacity: MotionValue<number>;
  navRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Top chrome only: the way back to /gallery and the title the hero heading
 * lands on. No menu; the page is read top to bottom.
 */
export const Navbar = ({ navBgOpacity, navTitleOpacity, navRef }: NavbarProps) => {
  const navBackground = useMotionTemplate`linear-gradient(to bottom, rgba(16, 17, 15, ${useTransform(navBgOpacity, [0, 1], [0, 0.8])}) 0%, rgba(16, 17, 15, 0) 100%)`;

  return (
    <motion.nav
      initial={false}
      style={{
        background: navBackground,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
      className={styles.navbar}
    >
      <div className={styles["nav-left"]}>
        <Link
          href="/gallery"
          className={styles["nav-back"]}
          aria-label={PANTAI_TIMOR_COPY.navbar.backToGallery}
          onClick={() => ptTrack.navClick("gallery")}
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          <span className={styles["nav-back-label"]}>{PANTAI_TIMOR_COPY.navbar.gallery}</span>
        </Link>
      </div>

      <div ref={navRef} className={styles["nav-center"]}>
        <motion.span
          aria-hidden="true"
          style={{ opacity: navTitleOpacity }}
          className={`${cormorant.className} ${styles["nav-title"]}`}
        >
          {PANTAI_TIMOR_COPY.navbar.title}
        </motion.span>
      </div>

      {/* Empty: balances the back link so the title stays centred. */}
      <div className={styles["nav-right"]} />
    </motion.nav>
  );
};
