'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './DeviceMockup.module.scss';

interface DeviceMockupProps {
  type: 'iphone' | 'pixel' | 'macbook';
  imageSrc: string;
  fullscreen?: boolean;
}

export default function DeviceMockup({ type, imageSrc, fullscreen = false }: DeviceMockupProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [fitMode, setFitMode] = useState<'width' | 'height'>('height');

  useEffect(() => {
    const checkRatio = () => {
      if (!constraintsRef.current || !imageRef.current) return;
      
      const container = constraintsRef.current;
      const image = imageRef.current;
      
      const containerRatio = container.clientWidth / container.clientHeight;
      const imageRatio = image.naturalWidth / image.naturalHeight;

      if (imageRatio > containerRatio) {
        setFitMode('height'); // Image is wider, fit height, pan width
      } else {
        setFitMode('width'); // Image is taller, fit width, pan height
      }
    };

    // Initial check and on load
    const img = imageRef.current;
    if (img && img.complete) {
        checkRatio();
    }

    window.addEventListener('resize', checkRatio);
    return () => window.removeEventListener('resize', checkRatio);
  }, [imageSrc, type, fullscreen]);

  const getDeviceClass = () => {
    switch (type) {
      case 'iphone': return styles.iphone;
      case 'pixel': return styles.pixel;
      case 'macbook': return styles.macbook;
      default: return styles.iphone;
    }
  };

  return (
    <div className={`${styles.container} ${fullscreen ? styles.fullscreen : ''}`}>
      <div className={getDeviceClass()}>
        {/* Device Specific UI Elements */}
        {type === 'iphone' && (
          <>
            <div className={styles.dynamicIsland} />
            <div className={styles.homeIndicator} />
          </>
        )}
        {type === 'pixel' && (
          <div className={styles.camera} />
        )}
        {type === 'macbook' && (
          <div className={styles.notch} />
        )}

        {/* Screen Area with Drag Interaction */}
        <div className={styles.screen} ref={constraintsRef}>
          <div className={styles.hint}>Drag to adjust</div>
          <motion.img
            ref={imageRef}
            src={imageSrc}
            alt="Wallpaper Preview"
            className={styles.image}
            onLoad={() => {
                // Trigger ratio check after load
                if (constraintsRef.current && imageRef.current) {
                    const container = constraintsRef.current;
                    const image = imageRef.current;
                    const containerRatio = container.clientWidth / container.clientHeight;
                    const imageRatio = image.naturalWidth / image.naturalHeight;
                    setFitMode(imageRatio > containerRatio ? 'height' : 'width');
                }
            }}
            drag={!fullscreen}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            draggable={false}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            style={{ 
                width: fitMode === 'width' ? '100%' : 'auto',
                height: fitMode === 'height' ? '100%' : 'auto',
                maxWidth: 'none',
                maxHeight: 'none',
                objectFit: 'fill', // Reset cover to allow overflow
                cursor: !fullscreen ? 'grab' : 'default',
                scale: 1.2, // Keep slight zoom to ensure edges aren't immediately visible
            }}
            whileTap={{ cursor: !fullscreen ? 'grabbing' : 'default' }}
          />
        </div>
      </div>
    </div>
  );
}
