'use client';

import { useRef } from 'react';
import FadeIn from '@/components/Animations/FadeIn';
import styles from './About.module.scss';
import Link from 'next/link';
import { calculateAge } from '@/utils/date';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const age = calculateAge('1998-01-06');

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <div className={styles.header}>
        <FadeIn direction="up">
          <p className={styles.subtitle}>My Journey</p>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <h2 className={styles.title}>Yu Hang Ang</h2>
        </FadeIn>
      </div>
      
      <div className={styles.content}>
        <FadeIn direction="up" delay={0.3}>
          <div className={styles.bio}>
            <p className={styles.text}>
              {age}, software engineer based in Kuala Lumpur, Malaysia. Open for new opportunities for collaboration and learning.
            </p>
            <Link href="/about" className={styles.readMore}>
              Read More →
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
