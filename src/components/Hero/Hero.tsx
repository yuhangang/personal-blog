'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.scss';

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrolled = window.scrollY;
        const parallaxSpeed = 0.5;
        if (scrolled < window.innerHeight) {
          bgRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.hero} id="home">
      <div className={styles.background} ref={bgRef}>
        <Image
          src="/images/hero-bg.png"
          alt="Mountain landscape"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={`${styles.subtitle} fade-in`}>Developer & Creator</p>
        <h1 className={`${styles.title} fade-in fade-in-delay-1`}>Yu Hang Ang</h1>
        <p className={`${styles.description} fade-in fade-in-delay-2`}>
          Crafting elegant solutions through code, one line at a time.
          Exploring the intersection of technology and human experience.
        </p>
        <a href="#blog" className={`${styles.cta} fade-in fade-in-delay-3`}>
          Explore My Work
        </a>
      </div>
    </section>
  );
}
