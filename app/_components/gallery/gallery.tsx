"use client";

import React, { useState, useEffect, useRef, FC } from "react";
import styled from "styled-components";
import { ImageData } from "./gallery.config";
import ImmersiveImageViewer from "./galleryViewer";

// Styled Components
const GalleryContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #f4f4f4;
`;

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */

  &::-webkit-scrollbar {
    display: none; /* WebKit */
  }
`;

const InnerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 300%;
  height: 300%;
  display: grid;
  grid-template-columns: repeat(30, minmax(100px, 1fr));
  grid-template-rows: repeat(30, minmax(100px, 1fr));
  gap: 15px;
  padding: 20px;
  background-color: black;
  transition: transform 0.1s ease; /* Smooth transition for repositioning */
`;

const ImageCard = styled.div<{ size: "small" | "medium" | "large" }>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;

  grid-column-end: span
    ${(props) => (props.size === "small" ? 2 : props.size === "medium" ? 4 : 6)};
  grid-row-end: span
    ${(props) => (props.size === "small" ? 2 : props.size === "medium" ? 4 : 6)};

  &:hover {
    transform: scale(0.95);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;

  ${ImageCard}:hover & {
    transform: scale(1.2);
  }
`;

const ImageTitle = styled.p`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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
  const [images, setImages] = useState<ImageData[]>([]);
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
      const { scrollLeft, scrollTop, clientWidth, clientHeight } = container;
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
      <GalleryContainer>
        <ScrollContainer ref={scrollContainerRef}>
          <InnerContainer ref={innerContainerRef}>
            {images.map((image) => (
              <ImageCard
                key={image.id}
                size={image.size}
                onClick={(e) => openImmersiveMode(image, e)}
              >
                <ImageThumbnail src={image.url} alt={image.title} />
                <ImageTitle>{image.title}</ImageTitle>
              </ImageCard>
            ))}
          </InnerContainer>
        </ScrollContainer>
      </GalleryContainer>

      <ImmersiveImageViewer
        image={selectedImage?.image ?? null}
        clickOrigin={selectedImage?.origin}
        onClose={closeImmersiveMode}
      />
    </>
  );
};

export default TwoDimensionalInfiniteGallery;
