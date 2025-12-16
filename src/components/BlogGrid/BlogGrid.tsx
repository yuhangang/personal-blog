'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { blogPosts } from '@/data/blogPosts';
import BlogCard from '../BlogCard/BlogCard';
import FadeIn from '@/components/Animations/FadeIn';
import styles from './BlogGrid.module.scss';

export default function BlogGrid() {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth;
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        
        // Calculate total scroll distance needed
        // We want the last item (width ~50vh) to be centered
        // Last item center = scrollWidth - (50vh / 2)
        // Target position = Viewport Center = viewportW / 2
        // Transform = -(Last Item Center - Target Position)
        
        const cardWidth = viewportH * 0.5; // 50vh approx width from CSS
        const lastItemCenter = scrollWidth - (cardWidth / 2);
        const targetPos = viewportW / 2;
        
        const finalTransform = -(lastItemCenter - targetPos);
        
        setScrollRange(finalTransform);
        setViewportWidth(viewportW);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, scrollRange]);

  return (
    <section ref={targetRef} className={styles.section} id="blog">
      <div className={styles.stickyWrapper}>
        <div className={styles.header}>
          <FadeIn>
            <h2 className={styles.subtitle}>Insights & Stories</h2>
            <h3 className={`text-display-2 ${styles.title}`}>Journal</h3>
          </FadeIn>
        </div>

        <div className={styles.overflowWrapper}>
          <motion.div ref={containerRef} style={{ x }} className={styles.cardList}>
            {blogPosts.map((post) => (
              <div key={post.id} className={styles.cardWrapper}>
                <BlogCard post={post} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
