"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Portfolio.module.scss";

const PROJECTS = [
  {
    title: "Yoy Media",
    href: "https://yoymedia.com.my/",
    image: "/projects/yoymedia.png",
    category: "Digital Platform",
    launchDate: "May 2025",
  },
  // Add more projects here as needed
];

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Map vertical wheel scroll to horizontal scroll
    const handleWheel = (e: WheelEvent) => {
      // Only hijack scroll when we're in the horizontal scroll zone
      const rect = container.getBoundingClientRect();
      const isInView =
        rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (isInView && container.scrollWidth > container.clientWidth) {
        const atStart = container.scrollLeft <= 0;
        const atEnd =
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth - 1;

        // Only prevent default if we can scroll in the direction of the delta
        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>yuhangang</span>
        <h2 className={styles.headerTitle}>
          PROJECT
          <br />
          LISTS
        </h2>
      </div>

      <div className={styles.scrollContainer} ref={containerRef}>
        <div className={styles.projectsTrack}>
          {PROJECTS.map((project, index) => {
            const number = String(index + 1).padStart(2, "0");

            return (
              <a
                key={index}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectCard}
              >
                <div className={styles.cardInner}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={project.image}
                      alt={`${project.title} Preview`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.infoLeft}>
                      <span className={styles.projectNumber}>{number}</span>
                      <span className={styles.projectTitle}>
                        {project.title}
                      </span>
                    </div>
                    {project.category && (
                      <span className={styles.projectCategory}>
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}

          {/* CTA Sidebar - Now part of the flow */}
          <div className={styles.ctaSidebar}>
            {/* Animated gradient blobs */}
            <div className={styles.gradientBg}>
              <div className={styles.gradientBlob1} />
              <div className={styles.gradientBlob2} />
              <div className={styles.gradientBlob3} />
            </div>

            <a href="#contact" className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <span className={styles.ctaLabel}>Open for partnerships</span>
                <h3 className={styles.ctaTitle}>
                  You could
                  <br />
                  be next.
                </h3>
                <p className={styles.ctaDesc}>
                  Looking for collaborations, agency partnerships, and exciting
                  projects. Let&apos;s build something remarkable together.
                </p>
                <div className={styles.ctaArrow}>
                  <span>Get in touch</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
