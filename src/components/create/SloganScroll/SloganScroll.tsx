'use client';

import { useRef, useState, useEffect, Key } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import styles from './SloganScroll.module.scss';
import Image from 'next/image';

const FEATURES = [
    {
        title: "Organic Fluidity.",
        desc: "Simulating nature’s pulse. We craft interfaces that flow like water, reacting to every touch with raw, organic life.",
    },
    {
        title: "Weaving Stories.",
        desc: "Obsession in every detail. We weave texture, light, and depth into a narrative that defies the screen.",
    },
    {
        title: "Vision & Resonance.",
        desc: "Extraordinary impact. A symphony of sound, sight, and raw experience that resonates with your audience on a primal level.",
    },
    {
        title: "Raw Material.",
        desc: "Digital crafted to feel analog. Grain, noise, and imperfection creating a tactile connection.",
    },
    {
        title: "Eternal Structure.",
        desc: "built on foundations of titanium. Robust, performant, and designed to outlast the trend cycle.",
    }
];

import SloganVisuals from './SloganVisuals';
import SloganItem from './SloganItem';
import { SLOGAN_ITEMS } from './sloganConfig';

export default function SloganScroll() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className={styles.section}>
            <div className={styles.layoutGrid}>
                
                {/* LEFT: SLOGANS (SCROLLING) */}
                <div className={styles.sloganList}>
                    {SLOGAN_ITEMS.map((feature: { title: string; desc: string; }, i: number) => (
                        <SloganItem 
                            key={i} 
                            index={i}
                            title={feature.title} 
                            desc={feature.desc} 
                            setActiveIndex={setActiveIndex}
                        />
                    ))}
                </div>

                {/* RIGHT: VISUALS (STICKY) */}
                <div className={styles.stickyVisualWrapper}>
                    <div className={styles.visualContainer}>
                         <SloganVisuals activeIndex={activeIndex} />
                    </div>
                </div>

            </div>
        </section>
    );
}
