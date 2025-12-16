import { useState, useEffect, RefObject } from 'react';

/**
 * Optimizes Three.js Canvas by determining if it should simulate (frameloop="always") or pause (frameloop="never").
 * Pauses when:
 * 1. Element is scrolled out of view (IntersectionObserver).
 * 2. Navigation menu is open (class 'nav-open' on body).
 * 3. Tab is hidden (document.hidden).
 */
export function useThreeOptimization(containerRef: RefObject<HTMLElement>) {
    // Default to 'always' to ensure initial render, then switch if needed.
    const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');

    useEffect(() => {
        let isIntersecting = true;
        let isNavOpen = false;

        const checkState = () => {
            // If element is NOT in view OR Nav is Open OR Document is Hidden OR Reduced Motion -> Pause
            // R3F handles document.hidden by default, but we can be explicit.
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            const shouldPause = !isIntersecting || isNavOpen || document.hidden || mediaQuery.matches;
            setFrameloop(shouldPause ? 'never' : 'always');
        };

        // 1. Intersection Observer (Scroll Visibility)
        const observer = new IntersectionObserver(([entry]) => {
            isIntersecting = entry.isIntersecting;
            checkState();
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        // 2. Mutation Observer (Nav Open State)
        const bodyObserver = new MutationObserver(() => {
            isNavOpen = document.body.classList.contains('nav-open');
            checkState();
        });
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // 3. Document Visibility (Tab Switch)
        const handleVisibility = () => {
            checkState();
        }
        document.addEventListener('visibilitychange', handleVisibility);

        // Initial check
        checkState();

        return () => {
            observer.disconnect();
            bodyObserver.disconnect();
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [containerRef]);

    return frameloop;
}
