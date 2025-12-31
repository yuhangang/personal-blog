'use client';

import { useRef, useEffect, useState } from 'react';
import { useThreeOptimization } from '@/hooks/useThreeOptimization';
import styles from './MessyThreads.module.scss';

export default function MessyThreads() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const frameloop = useThreeOptimization(containerRef as React.RefObject<HTMLElement>);
    const isActiveRef = useRef(true);

    // Sync ref for the animation closure
    useEffect(() => {
        isActiveRef.current = frameloop === 'always';
    }, [frameloop]);

    const penRef = useRef({
        angle: 0,
        radius: 100,
        cx: 0,
        cy: 0,
        driftX: 0, 
        driftY: 0,
        history: [] as { x: number; y: number }[]
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#ff4d00';
        ctx.lineWidth = 4.0; // Thicker, constant

        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        penRef.current.cx = cx;
        penRef.current.cy = cy;
        
        let penX = cx;
        let penY = cy;
        let angle = Math.random() * Math.PI * 2;
        let time = 0;
        
        const MAX_POINTS = 800; 

        const animate = () => {
            if (!isActiveRef.current) {
                frameRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, rect.width, rect.height);
            
            // 1. Chaotic Physics
            // Slower: Reduced to 6 steps per frame
            for (let i = 0; i < 6; i++) { 
                time += 0.05; 
                angle += 0.15; 
                
                // Exaggerated Scale for larger canvas
                const rNoise = Math.sin(time * 2.1) * 20 + Math.cos(time * 5.7) * 15;
                const rSlow = Math.sin(time * 0.4) * 35; 
                // Increased base radius from 50 -> 80
                const r = Math.max(20, 80 + rNoise + rSlow); 

                const scaleX = 1 + Math.sin(time * 1.3) * 0.3;
                const scaleY = 1 + Math.cos(time * 1.7) * 0.3;

                // Larger Drift
                const driftX = Math.sin(time * 0.6) * 40 + (Math.random()-0.5)*10;
                const driftY = Math.cos(time * 0.5) * 35 + (Math.random()-0.5)*10;
                
                const targetX = cx + driftX + Math.cos(angle) * r * scaleX;
                const targetY = cy + driftY + Math.sin(angle) * r * scaleY;
                
                penX += (targetX - penX) * 0.25;
                penY += (targetY - penY) * 0.25;

                penRef.current.history.push({ x: penX, y: penY });
            }

            if (penRef.current.history.length > MAX_POINTS) {
                penRef.current.history.splice(0, penRef.current.history.length - MAX_POINTS);
            }

            if (penRef.current.history.length > 1) {
                const history = penRef.current.history;
                ctx.beginPath();
                ctx.moveTo(history[0].x, history[0].y);
                for (let i = 1; i < history.length; i++) {
                    ctx.lineTo(history[i].x, history[i].y);
                }
                ctx.stroke();
            }
            
            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.container} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}
