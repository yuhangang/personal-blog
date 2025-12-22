"use client";

import Link from 'next/link';
import { useRef } from 'react';
import FadeIn from '@/components/common/Animations/FadeIn';
import styles from './About.module.scss';
import { calculateAge } from '@/utils/date';
import MessyThreads from '@/components/common/MessyThreads/MessyThreads';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const age = calculateAge('1998-01-06');

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <div className={styles.container}>
        {/* Visual Decoration */}
        <div className={styles.visualContainer}>
            <FadeIn direction="down" delay={0.2}>
                <div className={styles.threadsWrapper}>
                    <MessyThreads />
                </div>
            </FadeIn>
        </div>

        {/* Text Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <FadeIn direction="up">
              <span className={styles.subtitle}>01 — Who am I?</span>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={0.2}>
            <h2 className={styles.title}>
              Creating digital <br/>
              <span className={styles.accent}>experiences</span> that matter.
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className={styles.bio}>
              <p className={styles.text}>
                I'm a {age}-year-old software engineer based in Kuala Lumpur, Malaysia. 
                I specialize in building accessible, inclusive, and high-performance web applications.
              </p>
              <div className={styles.actions}>
                <Link href="/about" className={styles.readMore}>
                    Read Full Story
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
