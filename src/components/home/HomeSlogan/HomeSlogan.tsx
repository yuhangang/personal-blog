'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import styles from './HomeSlogan.module.scss';
import SloganVisuals from '@/components/create/SloganScroll/SloganVisuals';
import { SLOGAN_ITEMS } from '@/components/create/SloganScroll/sloganConfig';

export default function HomeSlogan() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Drive activeIndex based on scroll
    useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
        const index = Math.min(
            SLOGAN_ITEMS.length - 1,
            Math.floor(latest * SLOGAN_ITEMS.length)
        );
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    });

    const handleCardClick = (i: number) => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerTop = container.offsetTop;
        const scrollRange = container.offsetHeight - window.innerHeight;
        // Center the item in its scroll range
        const targetProgress = (i + 0.5) / SLOGAN_ITEMS.length;
        
        window.scrollTo({
            top: containerTop + (targetProgress * scrollRange),
            behavior: 'smooth'
        });
    };

    // Subtle parallax for visuals
    const yVisuals = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section ref={containerRef} className={styles.section}>
            <div className={styles.stickyContainer}>
                {/* Background Visuals */}
                <motion.div 
                    className={styles.visualWrapper}
                    style={{ y: yVisuals }}
                >
                     <SloganVisuals activeIndex={activeIndex} />
                </motion.div>

                {/* Compact Grid */}
                <div className={styles.grid}>
                    {SLOGAN_ITEMS.map((item, i) => (
                        <div 
                            key={i} 
                            className={`${styles.card} ${i === activeIndex ? styles.active : ''}`}
                            onClick={() => handleCardClick(i)}
                        >
                            <h2 className={styles.cardTitle}>{item.title}</h2>
                            <p className={styles.cardDesc}>{item.desc}</p>
                        </div>
                    ))}
                    
                    {/* 6th Slot: Call to Action */}
                    <Link 
                        href="/create" 
                        className={`${styles.card} ${styles.ctaCard}`} 
                        style={{ justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}
                    >
                        <h2 className={styles.cardTitle} style={{ margin: 0 }}>Explore &rarr;</h2>
                    </Link>
                </div>
            </div>
        </section>
    );
}
