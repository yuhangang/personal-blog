'use client';
import { motion } from 'framer-motion';
import { useTransition } from '@/context/TransitionContext';

export default function Template({ children }: { children: React.ReactNode }) {
    const { shouldAnimate } = useTransition();

    return (
        <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 40, filter: 'blur(10px)' } : false}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ 
                ease: [0.76, 0, 0.24, 1], // Cinematic easeInOutQuart feel
                duration: 1.2
            }}
        >
            {children}
        </motion.div>
    );
}
