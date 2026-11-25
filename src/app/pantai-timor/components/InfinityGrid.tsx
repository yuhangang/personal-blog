"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { FEATURED_IMAGES, getThumbnailUrl } from "../config";
import styles from "../pantai-timor.module.scss";

interface InfiniteGridProps {
  onSelectImage: (index: number) => void;
  activeImageIndex: number | null;
}

interface Cell {
  col: number;
  row: number;
}

const ARROW_STEPS: Record<string, Cell> = {
  ArrowLeft: { col: -1, row: 0 },
  ArrowRight: { col: 1, row: 0 },
  ArrowUp: { col: 0, row: -1 },
  ArrowDown: { col: 0, row: 1 },
};

// Cells are indexed from -1 to count - 2 and the grid wraps, so moving past
// either end lands on the cell drawn next to it.
const wrapCellIndex = (value: number, count: number) => (((value + 1) % count) + count) % count - 1;

// The offset that puts a cell at `target`, picked from all wrapped equivalents
// as the one nearest the current offset so the pan stays short.
const nearestOffset = (current: number, target: number, span: number) =>
  span > 0 ? target + Math.round((current - target) / span) * span : target;

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
  onSelectImage: (index: number) => void;
  activeImageIndex: number | null;
  isTabStop: boolean;
  onCellFocus: (cell: Cell, fromKeyboard: boolean) => void;
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
  onSelectImage,
  activeImageIndex
}: InfiniteGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const [focusedCell, setFocusedCell] = useState<Cell | null>(null);
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

  // One tab stop for the whole grid (arrow keys move within it): the last
  // focused cell, or the one under the centre before the grid is panned.
  const tabStop = focusedCell ?? {
    col: Math.floor(dimensions.width / 2 / step),
    row: Math.floor(dimensions.height / 2 / step),
  };

  const panToCell = ({ col, row }: Cell) => {
    offsetX.set(nearestOffset(offsetX.get(), (dimensions.width - cellSize) / 2 - col * step, totalWidth));
    offsetY.set(nearestOffset(offsetY.get(), (dimensions.height - cellSize) / 2 - row * step, totalHeight));
  };

  const handleCellFocus = (cell: Cell, fromKeyboard: boolean) => {
    setFocusedCell(cell);
    if (fromKeyboard) panToCell(cell);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const move = ARROW_STEPS[event.key];
    if (!move) return;

    // Keep the page's arrow keys (previous/next photo) out of grid navigation.
    event.preventDefault();
    event.stopPropagation();

    const next = {
      col: wrapCellIndex(tabStop.col + move.col, cols),
      row: wrapCellIndex(tabStop.row + move.row, rows),
    };
    setFocusedCell(next);
    panToCell(next);
    containerRef.current
      ?.querySelector<HTMLElement>(`[data-cell="${next.col}:${next.row}"]`)
      ?.focus({ preventScroll: true });
  };

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
      onKeyDown={handleKeyDown}
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
              onSelectImage={onSelectImage}
              activeImageIndex={activeImageIndex}
              isTabStop={col === tabStop.col && row === tabStop.row}
              onCellFocus={handleCellFocus}
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
  onSelectImage,
  activeImageIndex,
  isTabStop,
  onCellFocus
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
    <motion.button
      type="button"
      tabIndex={isTabStop ? 0 : -1}
      data-cell={`${col}:${row}`}
      style={{ x, y, width: cellSize, height: cellSize }}
      className={`${styles["infinite-grid-cell"]} ${activeImageIndex === imageIndex ? styles.active : ""}`}
      whileHover={{ scale: 1.02, zIndex: 20 }}
      whileTap={{ scale: 0.98 }}
      onFocus={(event) => onCellFocus({ col, row }, event.currentTarget.matches(":focus-visible"))}
      onClick={(event) => {
        // detail is 0 for Enter and Space, which never follow a drag.
        if (event.detail !== 0 && dragDistanceRef.current > 12) return;
        onSelectImage(imageIndex);
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
    </motion.button>
  );
};
