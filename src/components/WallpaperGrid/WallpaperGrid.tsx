'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wallpaper, wallpapers } from '@/data/wallpapers';
import styles from './WallpaperGrid.module.scss';

export default function WallpaperGrid() {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const items = gridRef.current?.querySelectorAll(`.${styles.gridItem}`);
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.masonryGrid} ref={gridRef}>
        {wallpapers.map((wallpaper, index) => (
          <div 
            key={wallpaper.id} 
            className={styles.gridItem}
            style={{ transitionDelay: `${index * 0.1}s` }} // Staggered delay
            onClick={() => setSelectedWallpaper(wallpaper)}
          >
            <Image
              src={wallpaper.src}
              alt={wallpaper.title}
              width={800}
              height={600}
              className={styles.image}
              style={{ height: 'auto' }} // Preserve aspect ratio
            />
            <div className={styles.overlay}>
              <div className={styles.info}>
                <h3 className={styles.title}>{wallpaper.title}</h3>
                <div className={styles.meta}>
                  <span>{wallpaper.resolution}</span>
                  <span>•</span>
                  <span>{wallpaper.device}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <div className={`${styles.lightbox} ${selectedWallpaper ? styles.open : ''}`}>
        <button 
          className={styles.closeButton}
          onClick={() => setSelectedWallpaper(null)}
        >
          ×
        </button>
        
        {selectedWallpaper && (
          <div className={styles.lightboxContent}>
            <Image
              src={selectedWallpaper.src}
              alt={selectedWallpaper.title}
              width={1920}
              height={1080}
              quality={100}
            />
            <a 
              href={selectedWallpaper.downloadUrl} 
              download
              className={styles.downloadButton}
              onClick={(e) => e.stopPropagation()}
            >
              Download Wallpaper
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
