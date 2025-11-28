'use client';

import { useEffect, useRef } from 'react';
import { blogPosts } from '@/data/blogPosts';
import BlogCard from '../BlogCard/BlogCard';
import styles from './BlogGrid.module.scss';

export default function BlogGrid() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="blog">
      <div className={styles.header}>
        <p className={styles.subtitle}>Insights & Stories</p>
        <h2 className={styles.title}>Journal</h2>
      </div>

      <div className={styles.grid}>
        {blogPosts.map((post, index) => (
          <div
            key={post.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className={styles.cardWrapper}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
