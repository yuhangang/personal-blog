import React from 'react';
import Image from 'next/image';
import { Wallpaper } from '@/data/wallpapers';
import styles from './InfiniteCanvas.module.scss';

interface WallpaperChunkProps {
  x: number;
  y: number;
  chunkSize: { width: number; height: number };
  wallpapers: Wallpaper[];
}

export default function WallpaperChunk({ x, y, chunkSize, wallpapers }: WallpaperChunkProps) {
  // Helper to get a wallpaper from the array based on a pseudo-random index
  // This ensures the grid looks varied even though it repeats
  const getWallpaper = (index: number) => {
    // Create a unique seed based on chunk coordinates and item index
    const seed = Math.abs((x * 7 + y * 13 + index) % wallpapers.length);
    return wallpapers[seed];
  };

  // Define the bento grid layout for one chunk (12 slots in a 4x3 grid)
  // We'll manually place some items to create the "designed" look
  const gridItems = [
    { type: 'span2x2', index: 0 }, // Big feature item
    { type: 'span1x1', index: 1 },
    { type: 'span1x1', index: 2 },
    { type: 'span1x2', index: 3 }, // Tall item
    { type: 'span1x1', index: 4 },
    { type: 'span2x1', index: 5 }, // Wide item
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
      {gridItems.map((item, i) => {
        const wallpaper = getWallpaper(item.index);
        return (
          <div key={i} className={`${styles.card} ${styles[item.type]}`}>
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
          </div>
        );
      })}
    </div>
  );
}
