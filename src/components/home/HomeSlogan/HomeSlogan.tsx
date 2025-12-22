'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HomeSlogan.module.scss';
import SloganVisuals from '@/components/create/SloganScroll/SloganVisuals';
import { SLOGAN_ITEMS } from '@/components/create/SloganScroll/sloganConfig';

export default function HomeSlogan() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className={styles.section}>
            {/* Background Visuals - Reacts to Hover */}
            <div className={styles.visualWrapper}>
                 <SloganVisuals activeIndex={activeIndex} />
            </div>

            {/* Grid Content */}
            <div className={styles.grid}>
                 {SLOGAN_ITEMS.map((item, i) => (
                    <div 
                        key={i} 
                        className={`${styles.card} ${i === activeIndex ? styles.active : ''}`}
                        onMouseEnter={() => setActiveIndex(i)}
                    >
                        <h2 className={styles.cardTitle}>{item.title}</h2>
                        <p className={styles.cardDesc}>{item.desc}</p>
                    </div>
                 ))}
                 
                 {/* 6th Slot: Call to Action / Link to Create Page */}
                 <Link href="/create" className={styles.card} style={{ justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
                    <h2 className={styles.cardTitle} style={{ margin: 0 }}>Explore &rarr;</h2>
                 </Link>
            </div>
        </section>
    );
}
