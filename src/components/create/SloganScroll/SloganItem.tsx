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
    
    // Logarithmic visibility logic to increase "clear" area
    // Center is 0.5. We want a wide clear zone, then fast falloff.
    // Logic: 
    // 1. Calculate distance from center (abs(v - 0.5))
    // 2. Define a "safe zone" (e.g., +/- 0.15 = 0.35 to 0.65) where op=1, blur=0
    // 3. Outside safe zone, use log to fall off.
    
    // Helper to calculate visibility factor (0 to 1)
    const getVisibility = (v: number) => {
        const dist = Math.abs(v - 0.5);
        const safeZone = 0.15; // 30% of viewport height is fully clear
        
        if (dist <= safeZone) return 1;
        
        // Logarithmic falloff
        // dist - safeZone goes from 0 to ~0.35
        // We want it to drop to 0 relatively linearly or log-like
        // Let's use a power curve for "log-like" steepness or just simple remapping
        const falloffDist = dist - safeZone;
        const maxFalloff = 0.5 - safeZone; // ~0.35
        const normalizedFalloff = falloffDist / maxFalloff; // 0 to 1
        
        // Log-like curve: slow start, then fast drop? Or fast drop then slow tail?
        // User asked for "log function to increase area".
        // Usually log(x) rises fast. 1 - log(x+1) drops fast.
        // Let's try 1 - (falloff ^ 0.5) or similar.
        // Or simply:
        return Math.max(0, 1 - Math.pow(normalizedFalloff, 0.5)); 
    };

    const opacity = useTransform(scrollYProgress, (v) => {
        const val = getVisibility(v);
        // Base opacity 0.2, max 1
        return 0.2 + (val * 0.8);
    });

    const blurValue = useTransform(scrollYProgress, (v) => {
        const val = getVisibility(v);
        // Max blur 8px, min 0
        return (1 - val) * 8;
    });

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
