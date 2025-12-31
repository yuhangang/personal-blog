"use client";

import Link from 'next/link';
import { useRef } from 'react';
import FadeIn from '@/components/common/Animations/FadeIn';
import styles from './About.module.scss';
import { calculateAge } from '@/utils/date';
import MessyThreads from '@/components/common/MessyThreads/MessyThreads';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <div className={styles.container}>
        {/* Text Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <FadeIn direction="up">
              <span className={styles.subtitle}>01 — Who am I?</span>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={0.2} fullWidth={true}>
            <h2 className={styles.title}>
              Creating digital <span className={styles.accent}>experiences</span> that matter.
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className={styles.bio}>
              <p className={styles.text}>
                I'm a software engineer based in Kuala Lumpur, Malaysia, specializing in architecting 
                high-performance mobile and web applications. My expertise lies in building scalable, 
                user-centric applications.
              </p>
              <div className={styles.actions}>
                <Link href="/about" className={styles.readMore}>
                    Read Full Story
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Visual Decoration */}
        <div className={styles.visualContainer}>
            <FadeIn direction="down" delay={0.2}>
                <div className={styles.threadsWrapper}>
                    <MessyThreads />
                </div>
            </FadeIn>
        </div>
      </div>
    </section>
  );
}
