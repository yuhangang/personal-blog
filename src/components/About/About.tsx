'use client';

import { useEffect, useRef, useState } from 'react';
import { stats } from '@/data/blogPosts';
import styles from './About.module.scss';

export default function About() {
  const [counted, setCounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counted) {
            setCounted(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [counted]);

  const animateCounters = () => {
    const statElements = document.querySelectorAll(`.${styles.number}`);
    statElements.forEach((element) => {
      const target = parseInt(element.textContent?.replace(/\D/g, '') || '0');
      animateCounter(element as HTMLElement, target);
    });
  };

  const animateCounter = (element: HTMLElement, target: number, duration = 2000) => {
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, 16);
  };

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <div className={styles.header}>
        <p className={styles.subtitle}>My Journey</p>
        <h2 className={styles.title}>Building the Future</h2>
      </div>
      <div className={styles.content}>
        <p className={styles.text}>
          I'm a software engineer passionate about creating meaningful digital experiences.
          Currently working as an App Developer at Lumi News and Software Engineer at Snappymob,
          I specialize in mobile development and modern web technologies.
        </p>
        <p className={styles.text}>
          My journey in technology has taken me from mobile development at Artisan IT Solutions
          to building innovative solutions that impact thousands of users. I believe in the power
          of clean code, thoughtful design, and continuous learning.
        </p>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.number}>{stat.number}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
