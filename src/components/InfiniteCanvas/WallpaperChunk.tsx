import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wallpaper } from '@/data/wallpapers';
import styles from './InfiniteCanvas.module.scss';

interface WallpaperChunkProps {
  x: number;
  y: number;
  chunkSize: { width: number; height: number };
  wallpapers: Wallpaper[];
  onWallpaperClick: (wallpaper: Wallpaper) => void;
}

interface Ripple {
    x: number;
    y: number;
    id: number;
}

const WallpaperCard = ({ 
    wallpaper, 
    type, 
    onClick 
}: { 
    wallpaper: Wallpaper, 
    type: string, 
    onClick: (w: Wallpaper) => void 
}) => {
    const [isActive, setIsActive] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isActive) {
            timeout = setTimeout(() => setIsActive(false), 2000);
        }
        return () => clearTimeout(timeout);
    }, [isActive]);

    useEffect(() => {
        if (ripples.length > 0) {
            const timeout = setTimeout(() => {
                setRipples((prev) => prev.slice(1));
            }, 1200); // Match animation duration
            return () => clearTimeout(timeout);
        }
    }, [ripples]);

    const handleClick = (e: React.MouseEvent) => {
        // Create Ripple
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { x, y, id: Date.now() };
        
        setRipples((prev) => [...prev, newRipple]);
        setIsActive(true);
        onClick(wallpaper);
    };

    return (
        <div 
            className={`${styles.card} ${styles[type]} ${isActive ? styles.active : ''}`}
            onClick={handleClick}
        >
            <Image
                src={wallpaper.src}
                alt={wallpaper.title}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className={styles.overlay}>
                <h3 className={styles.title}>{wallpaper.title}</h3>
                <p className={styles.meta}>{wallpaper.resolution}</p>
            </div>
            
            {/* Ripple Container */}
            <div className={styles.rippleContainer}>
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className={styles.ripple}
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 100, // Initial size logic handled by scale
                            height: 100,
                            marginLeft: -50, // Center
                            marginTop: -50
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default function WallpaperChunk({ x, y, chunkSize, wallpapers, onWallpaperClick }: WallpaperChunkProps) {
  // Helper to get a wallpaper from the array based on a pseudo-random index
  const getWallpaper = (index: number) => {
    const seed = Math.abs((x * 7 + y * 13 + index) % wallpapers.length);
    return wallpapers[seed];
  };

  const gridItems = [
    { type: 'span2x2', index: 0 },
    { type: 'span1x1', index: 1 },
    { type: 'span1x1', index: 2 },
    { type: 'span1x2', index: 3 },
    { type: 'span1x1', index: 4 },
    { type: 'span2x1', index: 5 },
    { type: 'span1x1', index: 6 },
    { type: 'span1x1', index: 7 },
  ];

  return (
    <div 
      className={styles.chunk}
      style={{
        transform: `translate(${x * chunkSize.width}px, ${y * chunkSize.height}px)`,
      }}
    >
      {gridItems.map((item, i) => (
        <WallpaperCard
            key={i}
            wallpaper={getWallpaper(item.index)}
            type={item.type}
            onClick={onWallpaperClick}
        />
      ))}
    </div>
  );
}
