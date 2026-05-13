"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { FEATURED_IMAGES, getThumbnailUrl, PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

interface InfiniteGridProps {
  setActiveImageIndex: (index: number) => void;
  setIsGridView: (isGrid: boolean) => void;
  activeImageIndex: number | null;
}

interface Dimensions {
  width: number;
  height: number;
}

interface GridCellProps {
  col: number;
  row: number;
  step: number;
  cellSize: number;
  totalWidth: number;
  totalHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  imageIndex: number;
  dragDistanceRef: React.MutableRefObject<number>;
  setActiveImageIndex: (index: number) => void;
  setIsGridView: (isGrid: boolean) => void;
  activeImageIndex: number | null;
}

const wrapPosition = (position: number, span: number, min: number, max: number) => {
  if (span <= 0) return position;

  let wrapped = position;

  while (wrapped < min) wrapped += span;
  while (wrapped > max) wrapped -= span;

  return wrapped;
};

const getImageIndex = (col: number, row: number) => {
  const len = FEATURED_IMAGES.length;
  if (len === 0) return 0;

  const hash = Math.abs(col * 13 + row * 7);
  return hash % len;
};

export const InfiniteGrid = ({
  setActiveImageIndex,
  setIsGridView,
  activeImageIndex
}: InfiniteGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragDistanceRef = useRef(0);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  const springX = useSpring(offsetX, { stiffness: 60, damping: 25, mass: 0.5 });
  const springY = useSpring(offsetY, { stiffness: 60, damping: 25, mass: 0.5 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isMobile = dimensions.width < 768;
  const cellSize = isMobile ? 240 : 360;
  const gap = isMobile ? 12 : 24;
  const step = cellSize + gap;

  const cols = Math.max(1, Math.ceil(dimensions.width / step) + 4);
  const rows = Math.max(1, Math.ceil(dimensions.height / step) + 4);
  const totalWidth = cols * step;
  const totalHeight = rows * step;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId || !lastPointRef.current) return;

      const deltaX = event.clientX - lastPointRef.current.x;
      const deltaY = event.clientY - lastPointRef.current.y;

      if (deltaX === 0 && deltaY === 0) return;

      dragDistanceRef.current += Math.hypot(deltaX, deltaY);
      offsetX.set(offsetX.get() + deltaX);
      offsetY.set(offsetY.get() + deltaY);
      lastPointRef.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return;

      pointerIdRef.current = null;
      lastPointRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [dragDistanceRef, offsetX, offsetY]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerIdRef.current = event.pointerId;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    dragDistanceRef.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className={styles["infinite-grid-container"]}
      onPointerDown={handlePointerDown}
    >
      <div className={styles["infinite-grid-viewport"]}>
        {Array.from({ length: rows * cols }).map((_, index) => {
          const col = Math.floor(index / rows) - 1;
          const row = (index % rows) - 1;
          const imageIndex = getImageIndex(col, row);

          return (
            <GridCell
              key={`${col}-${row}`}
              col={col}
              row={row}
              step={step}
              cellSize={cellSize}
              totalWidth={totalWidth}
              totalHeight={totalHeight}
              viewportWidth={dimensions.width}
              viewportHeight={dimensions.height}
              springX={springX}
              springY={springY}
              imageIndex={imageIndex}
              dragDistanceRef={dragDistanceRef}
              setActiveImageIndex={setActiveImageIndex}
              setIsGridView={setIsGridView}
              activeImageIndex={activeImageIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

const GridCell = ({
  col,
  row,
  step,
  cellSize,
  totalWidth,
  totalHeight,
  viewportWidth,
  viewportHeight,
  springX,
  springY,
  imageIndex,
  dragDistanceRef,
  setActiveImageIndex,
  setIsGridView,
  activeImageIndex
}: GridCellProps) => {
  const image = FEATURED_IMAGES[imageIndex];

  const x = useTransform(springX, (value) =>
    wrapPosition(col * step + value, totalWidth, -step, viewportWidth + step)
  );

  const y = useTransform(springY, (value) =>
    wrapPosition(row * step + value, totalHeight, -step, viewportHeight + step)
  );

  if (!image) return null;

  return (
    <motion.div
      style={{ x, y, width: cellSize, height: cellSize }}
      className={`${styles["infinite-grid-cell"]} ${activeImageIndex === imageIndex ? styles.active : ""}`}
      whileHover={{ scale: 1.02, zIndex: 20 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (dragDistanceRef.current > 12) return;
        setActiveImageIndex(imageIndex);
        setIsGridView(false);
      }}
    >
      <Image
        src={getThumbnailUrl(image.src)}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 400px, 280px"
        className={styles["grid-image"]}
        draggable={false}
      />
      <div className={styles["grid-item-overlay"]}>
        <span className={styles["view-label"]}>{PANTAI_TIMOR_COPY.lightbox.viewPhoto}</span>
      </div>
    </motion.div>
  );
};
