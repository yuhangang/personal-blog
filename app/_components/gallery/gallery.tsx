"use client";

import React, { useState, useEffect, useRef, FC } from "react";
import { ImageData } from "./gallery.config";
import ImmersiveImageViewer from "./galleryViewer";
import styles from "./gallery.module.scss";

// Generate image data with variable sizes
const generateImageData = (count: number): ImageData[] => {
  const sizes: ImageData["size"][] = ["small", "medium", "large"];
  const images: string[] = [
    "./images/bhimtang.webp",
    "./images/manaslu_glacier.webp",
    "./images/namjung.webp",
    "./images/yak.webp",
  ];

  return Array.from({ length: count }, (_, index) => {
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const seed = Math.floor(Math.random() * 1000);

    // Adjust image dimensions based on size
    const dimensions = {
      small: { width: 200, height: 200 },
      medium: { width: 400, height: 400 },
      large: { width: 600, height: 600 },
    }[size];

    return {
      id: Date.now() + index,
      url: images[seed % images.length],
      title: `Gallery Image ${index + 1}`,
      width: dimensions.width,
      height: dimensions.height,
      size,
    };
  });
};

type ImageState = {
  image: ImageData;
  origin: { x: number; y: number };
};

const TwoDimensionalInfiniteGallery: FC = () => {
  const [images, setImages] = useState<ImageData[]>(() =>
    typeof window !== "undefined" ? generateImageData(900) : []
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<ImageState | null>(null);

  // Smooth scroll wrapping
  useEffect(() => {
    const container = scrollContainerRef.current;
    const inner = innerContainerRef.current;
    if (!container || !inner) return;

    // Initial centering
    const centerX = inner.offsetWidth / 3;
    const centerY = inner.offsetHeight / 3;
    container.scrollLeft = centerX;
    container.scrollTop = centerY;

    const handleScroll = () => {
      const { scrollLeft, scrollTop } = container;
      const { offsetWidth, offsetHeight } = inner;

      let newScrollLeft = scrollLeft;
      let newScrollTop = scrollTop;
      let shouldReposition = false;

      // Horizontal wrapping with smooth transition
      if (scrollLeft <= 0) {
        newScrollLeft = centerX;
        shouldReposition = true;
      } else if (scrollLeft >= (offsetWidth * 2) / 3) {
        newScrollLeft = centerX;
        shouldReposition = true;
      }

      // Vertical wrapping with smooth transition
      if (scrollTop <= 0) {
        newScrollTop = centerY;
        shouldReposition = true;
      } else if (scrollTop >= (offsetHeight * 2) / 3) {
        newScrollTop = centerY;
        shouldReposition = true;
      }

      // Smooth repositioning
      if (shouldReposition) {
        requestAnimationFrame(() => {
          container.scrollLeft = newScrollLeft;
          container.scrollTop = newScrollTop;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [images]);

  // Initial load
  useEffect(() => {
    const initialImages = generateImageData(900); // Enough to fill 30x30 grid
    setImages(initialImages);
  }, []);

  // Open image in immersive mode
  const openImmersiveMode = (image: ImageData, event: React.MouseEvent) => {
    // Calculate click coordinates relative to the viewport
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSelectedImage({ image, origin: { x, y } });
  };

  // Close immersive mode
  const closeImmersiveMode = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className={styles.galleryContainer}>
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <div ref={innerContainerRef} className={styles.innerContainer}>
            {images.map((image) => (
              <div
                key={image.id}
                className={`${styles.imageCard} ${styles[image.size]}`}
                onClick={(e) => openImmersiveMode(image, e)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className={styles.imageThumbnail}
                />
                <p className={styles.imageTitle}>{image.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImmersiveImageViewer
        image={selectedImage?.image ?? null}
        clickOrigin={selectedImage?.origin}
        onClose={closeImmersiveMode}
      />
    </>
  );
};

export default TwoDimensionalInfiniteGallery;
