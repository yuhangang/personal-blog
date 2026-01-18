"use client";

// import { useEffect, useState } from "react"; // Removed unused imports
import FadeIn from "@/components/common/Animations/FadeIn";
import styles from "./about.module.scss";
import Link from "next/link";
import Image from "next/image";
import { calculateAge } from "@/utils/date";
import MessyThreads from "@/components/common/MessyThreads/MessyThreads";

export default function AboutPage() {
  // Calculate age directly to avoid "synchronous setState in useEffect" warning
  // This is safe for hydration as long as the server/client date consistency is maintained
  const age = calculateAge("1998-01-06");

  return (
    <main className={styles.container} data-theme="dark">
      <FadeIn direction="up" delay={0.05}>
        <div className={styles.coverWrapper}>
          <Image
            src="/images/yuhang_at_penang.webp"
            alt="Yuhang at Penang"
            fill
            className={styles.coverImage}
            priority
            sizes="(max-width: 3840px) 100vw, 3840px"
          />
        </div>
      </FadeIn>
      <div className={styles.innerContainer}>
        <div className={styles.headerGrid}>
          <div className={styles.headerContent}>
            <FadeIn direction="up" delay={0.1}>
              <h1 className={styles.title}>My Journey</h1>
            </FadeIn>
          </div>

          <div className={styles.visualContainer}>
            <FadeIn direction="down" delay={0.5}>
              <div className={styles.threadsWrapper}>
                <MessyThreads />
              </div>
            </FadeIn>
          </div>
        </div>

        <div className={styles.content}>
          <FadeIn direction="up" delay={0.2}>
            <div className={styles.bio}>
              <p className={styles.text}>
                {age || "..."}, software engineer based in Kuala Lumpur,
                Malaysia. Open for new opportunities for collaboration and
                learning.
              </p>
              <div className={styles.actions}>
                <Link href="/resume" className={styles.resumeLink}>
                  View Professional Resume &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
