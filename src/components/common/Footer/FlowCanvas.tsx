'use client';

import { useEffect, useRef } from 'react';

export default function FlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight; // Usually footer height, controlled by CSS
    
    // Perlin-ish Noise approximation helper
    // Based on simple sine superposition for "watery" feel without heavy maths lib
    const noise = (x: number, y: number, t: number) => {
        return Math.sin(x * 0.002 + t) * Math.cos(y * 0.005 + t * 0.5) * 0.5 + 
               Math.sin(x * 0.005 - t * 0.8) * 2;
    };

    let time = 0;

    const resize = () => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
        ctx.fillStyle = '#111'; // Dark background color
        ctx.fillRect(0, 0, width, height);

        // Configuration
        const lines = 100; // Slightly reduced for cleaner look
        const step = height / lines;
        
        ctx.lineWidth = 1;
        
        // Draw flowing curves
        for (let i = 0; i <= lines; i++) {
            const yBase = i * step;
            
            ctx.beginPath();
            
            // Gradient for the line
            const grad = ctx.createLinearGradient(0, yBase, width, yBase);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            // Organic pulsing opacity
            const opacity = 0.1 + Math.sin(time * 0.5 + i * 0.1) * 0.10; 
            grad.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = grad;
            
            for (let x = 0; x <= width; x += 15) { // Slightly coarser step for smoothness
                // Multi-octave wave for natural liquid feel
                // Base swell
                const w1 = Math.sin(x * 0.002 + time * 0.5 + i * 0.05) * 30;
                // Medium flow
                const w2 = Math.sin(x * 0.005 - time * 0.3 + i * 0.1) * 15;
                // Detail ripple
                const w3 = Math.sin(x * 0.01 + time * 0.8) * 5;
                
                const yOffset = w1 + w2 + w3;

                ctx.lineTo(x, yBase + yOffset);
            }
            ctx.stroke();
        }

        time += 0.008; // Slower, more majestic speed
        requestAnimationFrame(draw);
    };
    
    const animationFrame = requestAnimationFrame(draw);

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        style={{ 
            width: '100%', 
            height: '100%', 
            display: 'block',
            background: '#111' 
        }} 
    />
  );
}
