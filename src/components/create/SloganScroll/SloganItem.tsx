'use client';

import { useRef, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import styles from './SloganScroll.module.scss';

interface Props {
    title: string;
    desc: string;
    index: number;
    setActiveIndex: (i: number) => void;
}

export default function SloganItem({ title, desc, index, setActiveIndex }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Curving & Focus Effect:
    // We use a wider "plateau" at the center [0.35, 0.65] where the item is fully clear.
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    
    // X and Rotate can stay dynamic to keep "wheel" feel, but maybe wider peak.
    const x = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [-50, 0, -50]); 
    const rotateY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [10, 0, 10]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.9, 1, 0.9]);
    
    const opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0.3, 1, 1, 0.3]);
    
    // Wide clear window
    const blurValue = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [4, 0, 0, 4]);
    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    // Detect active
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (v) => {
            if (v > 0.4 && v < 0.6) {
                setActiveIndex(index);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, index, setActiveIndex]);

    return (
        <div ref={ref} className={styles.sloganItem}>
            <motion.div 
                className={styles.sloganContent}
                style={{ x, opacity, rotateY, scale, filter, perspective: 1000 }}
            >
                <h2 className={styles.sloganTitle}>{title}</h2>
                <p className={styles.sloganDesc}>{desc}</p>
            </motion.div>
        </div>
    );
}
