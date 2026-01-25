"use client";

import Image from "next/image";
import styles from "./CreateServices.module.scss";

export default function CreateServices() {
  return (
    <section className={styles.section} id="why-build-with-me">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>WHY BUILD WITH ME?</h2>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column - Visual */}
          <div className={styles.visualColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/services-visual.webp"
                alt="AI-powered development visualization"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className={styles.contentColumn}>
            <p className={styles.lead}>
              I leverage advanced AI workflows to code faster, smarter, and
              cheaper than traditional agencies. You get a dedicated partner who
              delivers studio-grade performance without the agency overhead.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
