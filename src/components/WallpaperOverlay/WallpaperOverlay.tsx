'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Wallpaper } from '@/data/wallpapers';
import DeviceMockup from './DeviceMockup';
import styles from './WallpaperOverlay.module.scss';
import { useIsMobile } from '@/hooks/useIsMobile';

interface WallpaperOverlayProps {
  wallpaper: Wallpaper | null;
  wallpapers: Wallpaper[];
  onClose: () => void;
}

export default function WallpaperOverlay({
  wallpaper,
  wallpapers,
  onClose,
}: WallpaperOverlayProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [device, setDevice] = useState<'none' | 'iphone' | 'pixel' | 'macbook'>('none');
  const [resolution, setResolution] = useState('4K');
  const [activeWallpaper, setActiveWallpaper] = useState<Wallpaper | null>(wallpaper);
  const { isMobile, isTablet } = useIsMobile();
  const [mobileViewMode, setMobileViewMode] = useState<'mockup' | 'fullscreen'>('mockup');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync active wallpaper to URL
  useEffect(() => {
    if (activeWallpaper) {
      const currentId = searchParams.get('wallpaper');
      if (currentId !== activeWallpaper.id) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('wallpaper', activeWallpaper.id);
        // use replace to avoid building huge history stack
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }
  }, [activeWallpaper, router, searchParams]);

  // Set default device for mobile mockup view
  useEffect(() => {
    if (isMobile) {
      // Simple detection - could be more robust
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setDevice(isIOS ? 'iphone' : 'pixel');
    }
  }, [isMobile]);

  // Sync active wallpaper when prop changes (initial open)
  useEffect(() => {
    if (wallpaper) {
      setActiveWallpaper(wallpaper);
    }
  }, [wallpaper]);

  // Scroll to active wallpaper on mount/open
  useEffect(() => {
    if (wallpaper && scrollContainerRef.current) {
      const index = wallpapers.findIndex(w => w.id === wallpaper.id);
      if (index !== -1) {
        const container = scrollContainerRef.current;
        const width = container.clientWidth;
        container.scrollTo({ left: index * width, behavior: 'instant' });
      }
    }
  }, [wallpaper, wallpapers]);

  // Track active wallpaper on scroll (Debounced to prevent jank during animation)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear existing timeout
      clearTimeout(timeoutId);

      // Set new timeout to update state ONLY after scrolling stops (150ms)
      timeoutId = setTimeout(() => {
        const index = Math.round(container.scrollLeft / container.clientWidth);
        if (wallpapers[index] && wallpapers[index].id !== activeWallpaper?.id) {
          setActiveWallpaper(wallpapers[index]);
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [wallpapers, activeWallpaper]);

  // Mouse Wheel Navigation (Debounced Index Jumping)
  const lastWheelTime = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Always take control

      const now = Date.now();
      if (now - lastWheelTime.current < 500) return; // Debounce 500ms for "page turn" feel

      // Determine primary direction
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      // Threshold to avoid accidental triggers
      if (Math.abs(delta) < 20) return; 

      if (!activeWallpaper) return;
      
      // BLOCK: If in device mockup mode, disable scroll switching
      if (device !== 'none') return;
      
      const currentIndex = wallpapers.findIndex(w => w.id === activeWallpaper.id);
      
      if (delta > 0) {
        // Scroll Down/Right -> Next
        if (currentIndex < wallpapers.length - 1) {
          scrollToWallpaper(currentIndex + 1);
          lastWheelTime.current = now;
        }
      } else {
        // Scroll Up/Left -> Prev
        if (currentIndex > 0) {
          scrollToWallpaper(currentIndex - 1);
          lastWheelTime.current = now;
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeWallpaper, wallpapers]); // Re-bind when active wallpaper changes to have correct index logic

  // Keyboard Navigation
  useEffect(() => {
    if (!wallpaper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (device !== 'none') {
           setDevice('none'); // Exit mockup mode first
        } else {
           onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const container = scrollContainerRef.current;
        if (!container || !activeWallpaper || device !== 'none') return; // BLOCK navigation in mockup mode
        
        const currentIndex = wallpapers.findIndex(w => w.id === activeWallpaper.id);
        const nextIndex = e.key === 'ArrowRight' 
          ? Math.min(currentIndex + 1, wallpapers.length - 1)
          : Math.max(currentIndex - 1, 0);
            
        container.scrollTo({
          left: nextIndex * container.clientWidth,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wallpaper, onClose, activeWallpaper, wallpapers, device]);

  const scrollToWallpaper = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = () => {
    if (!activeWallpaper || device !== 'none') return;
    const currentIndex = wallpapers.findIndex(w => w.id === activeWallpaper.id);
    if (currentIndex < wallpapers.length - 1) {
      scrollToWallpaper(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!activeWallpaper || device !== 'none') return;
    const currentIndex = wallpapers.findIndex(w => w.id === activeWallpaper.id);
    if (currentIndex > 0) {
      scrollToWallpaper(currentIndex - 1);
    }
  };

  if (!wallpaper || !mounted) return null;

  // Find neighbors for preview buttons based on active wallpaper
  const activeIndex = activeWallpaper ? wallpapers.findIndex(w => w.id === activeWallpaper.id) : -1;
  const prevWallpaper = activeIndex > 0 ? wallpapers[activeIndex - 1] : null;
  const nextWallpaper = activeIndex < wallpapers.length - 1 ? wallpapers[activeIndex + 1] : null;

  // Animation Variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: { opacity: 0, x: 20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  return createPortal(
    <div 
      className={`${styles.overlay} ${wallpaper ? styles.open : ''}`}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div 
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <div className={styles.content}>
        {/* Main Stage with Scroll Container */}
        <div className={styles.stage}>
          {/* Previous Wallpaper Preview Button - Hide in Mockup Mode */}
          {prevWallpaper && device === 'none' && (
            <motion.div 
              className={`${styles.navButton} ${styles.prev}`} 
              onClick={handlePrev}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={prevWallpaper.src} alt="Previous" className={styles.previewImage} />
            </motion.div>
          )}

          {/* Next Wallpaper Preview Button - Hide in Mockup Mode */}
          {nextWallpaper && device === 'none' && (
            <motion.div 
              className={`${styles.navButton} ${styles.next}`} 
              onClick={handleNext}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={nextWallpaper.src} alt="Next" className={styles.previewImage} />
            </motion.div>
          )}

          <div className={styles.scrollContainer} ref={scrollContainerRef}>
            {wallpapers.map((w) => (
              <WallpaperItem 
                key={w.id}
                wallpaper={w}
                device={device}
                isMobile={isMobile}
                mobileViewMode={mobileViewMode}
              />
            ))}
          </div>

          {/* Mobile View Toggle */}
          {isMobile && (
            <div className={styles.mobileControls}>
              <motion.button 
                className={`${styles.mobileToggle} ${mobileViewMode === 'mockup' ? styles.active : ''}`}
                onClick={() => setMobileViewMode('mockup')}
                whileTap={{ scale: 0.95 }}
              >
                Mockup
              </motion.button>
              <motion.button 
                className={`${styles.mobileToggle} ${mobileViewMode === 'fullscreen' ? styles.active : ''}`}
                onClick={() => setMobileViewMode('fullscreen')}
                whileTap={{ scale: 0.95 }}
              >
                Full Screen
              </motion.button>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className={styles.sidebarWrapper}> {/* Wrapper for sidebar positioning */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeWallpaper?.id} // Trigger animation on wallpaper change
              className={styles.sidebar}
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className={styles.header} variants={itemVariants}>
                <div>
                  <h2 className={styles.title}>{activeWallpaper?.title}</h2>
                  <p className={styles.meta}>By Yu Hang Ang</p>
                </div>
                <button className={styles.closeButton} onClick={onClose}>×</button>
              </motion.div>

              <motion.div className={styles.section} variants={itemVariants}>
                <span className={styles.label}>Preview Device</span>
                <div className={styles.options} style={{ flexWrap: 'wrap' }}>
                  {['iphone', 'pixel', 'macbook'].map((d) => (
                    <motion.button 
                      key={d}
                      className={`${styles.optionButton} ${device === d ? styles.active : ''}`}
                      onClick={() => setDevice(d as any)}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </motion.button>
                  ))}
                </div>
                {device !== 'none' && (
                  <motion.button
                    className={styles.closeMockupButton}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => setDevice('none')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Exit Mockup Mode
                  </motion.button>
                )}
              </motion.div>

              <motion.div className={styles.section} variants={itemVariants}>
                <span className={styles.label}>Resolution</span>
                <div className={styles.options}>
                  {['4K', '8K', 'Mobile'].map((res) => (
                     <motion.button 
                      key={res}
                      className={`${styles.optionButton} ${resolution === res ? styles.active : ''}`}
                      onClick={() => setResolution(res)}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {res}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.a 
                href={activeWallpaper?.downloadUrl} 
                download
                className={styles.downloadButton}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Download Wallpaper
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>,
    document.body
  );
}

const WallpaperItem = React.memo(({ 
  wallpaper, 
  device, 
  isMobile, 
  mobileViewMode 
}: { 
  wallpaper: Wallpaper, 
  device: 'none' | 'iphone' | 'pixel' | 'macbook', 
  isMobile: boolean, 
  mobileViewMode: 'mockup' | 'fullscreen' 
}) => {
  return (
    <div className={styles.scrollItem}>
      {device === 'none' && !isMobile ? (
        <img 
          src={wallpaper.src} 
          alt={wallpaper.title}
          className={styles.wallpaperImage}
          draggable={false}
          style={{ willChange: 'transform' }} // Optimization hint
        />
      ) : (
        <DeviceMockup 
          type={device === 'none' ? 'iphone' : device} 
          imageSrc={wallpaper.src} 
          fullscreen={isMobile && mobileViewMode === 'fullscreen'}
        />
      )}
    </div>
  );
}, (prev, next) => {
  return prev.wallpaper.id === next.wallpaper.id && 
         prev.device === next.device && 
         prev.isMobile === next.isMobile && 
         prev.mobileViewMode === next.mobileViewMode;
});
