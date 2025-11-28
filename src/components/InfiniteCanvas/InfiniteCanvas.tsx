'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { wallpapers } from '@/data/wallpapers';
import WallpaperChunk from './WallpaperChunk';
import styles from './InfiniteCanvas.module.scss';

const CHUNK_WIDTH = 1200;
const CHUNK_HEIGHT = 800;

export default function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;
    
    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPosition]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const dx = e.touches[0].clientX - lastPosition.x;
    const dy = e.touches[0].clientY - lastPosition.y;
    
    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, [isDragging, lastPosition]);

  // Calculate Visible Chunks
  const getVisibleChunks = () => {
    if (viewportSize.width === 0) return [];

    // Calculate the range of visible chunks based on offset and viewport
    // We add a buffer of 1 chunk in each direction for smooth scrolling
    const startCol = Math.floor(-offset.x / CHUNK_WIDTH) - 1;
    const endCol = Math.floor((-offset.x + viewportSize.width) / CHUNK_WIDTH) + 1;
    const startRow = Math.floor(-offset.y / CHUNK_HEIGHT) - 1;
    const endRow = Math.floor((-offset.y + viewportSize.height) / CHUNK_HEIGHT) + 1;

    const chunks = [];
    for (let x = startCol; x <= endCol; x++) {
      for (let y = startRow; y <= endRow; y++) {
        chunks.push({ x, y });
      }
    }
    return chunks;
  };

  return (
    <div 
      ref={containerRef}
      className={styles.canvasContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div 
        className={styles.canvasLayer}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {getVisibleChunks().map((chunk) => (
          <WallpaperChunk
            key={`${chunk.x}-${chunk.y}`}
            x={chunk.x}
            y={chunk.y}
            chunkSize={{ width: CHUNK_WIDTH, height: CHUNK_HEIGHT }}
            wallpapers={wallpapers}
          />
        ))}
      </div>
    </div>
  );
}
