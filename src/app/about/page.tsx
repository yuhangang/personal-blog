"use client";

import { useState } from "react";
import FadeIn from "@/components/common/Animations/FadeIn";
import { calculateAge } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.scss";

export default function AboutPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate age directly to avoid "synchronous setState in useEffect" warning
  // This is safe for hydration as long as the server/client date consistency is maintained
  const age = calculateAge("1998-01-06");

  return (
    <main className={styles.container} data-theme="dark">
      <div className={styles.coverWrapper}>
        <Image
          src="/images/about-cover.webp"
          alt="Yuhang at Manaslu Circuit, Nepal"
          fill
          className={styles.coverImage}
          priority
          quality={90}
          sizes="100vw"
          onLoad={() => setImageLoaded(true)}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.headerGrid}>
          <div className={styles.headerContent}>
            <FadeIn direction="up" delay={0.1}>
              <h1 className={styles.title}>Yu Hang Ang</h1>
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
