import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./galleryViewer.module.scss";

// Type Definitions
interface ImageData {
  id: number;
  url: string;
  title: string;
  width: number;
  height: number;
  size: "small" | "medium" | "large";
}

interface ImmersiveImageViewerProps {
  image: ImageData | null;
  onClose: () => void;
  clickOrigin?: { x: number; y: number };
}

const ImmersiveImageViewer: React.FC<ImmersiveImageViewerProps> = ({
  image,
  onClose,
  clickOrigin = {
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  },
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle key press for closing immersive mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && image) {
        onClose();
      }
    };

    if (image) {
      setIsVisible(true);
      history.pushState({ immersiveView: true }, "");
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      ref={overlayRef}
      className={`${styles.immersiveOverlay} ${isVisible ? styles.active : ""}`}
      onClick={onClose}
    >
      <img
        src={image.url}
        alt={image.title}
        className={`${styles.immersiveImage} ${styles.zoomDefault}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// Wrapper Component to Capture Click Origin
interface ImageWithImmersiveViewProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  onImmersiveView?: (image: ImageData) => void;
}

export const ImageWithImmersiveView: React.FC<ImageWithImmersiveViewProps> = ({
  onClick,
  onImmersiveView,
  ...props
}) => {
  const [clickOrigin, setClickOrigin] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [immersiveImage, setImmersiveImage] = useState<ImageData | null>(null);

  const handleClose = useCallback(() => {
    setImmersiveImage(null);
    setClickOrigin(undefined);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;

    setClickOrigin({
      x: e.clientX,
      y: e.clientY,
    });

    const imageData: ImageData = {
      id: Date.now(),
      url: props.src || "",
      title: props.alt || "Image",
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
      size: "medium",
    };

    setImmersiveImage(imageData);

    if (onClick) {
      onClick(e);
    }

    if (onImmersiveView) {
      onImmersiveView(imageData);
    }
  };

  return (
    <>
      <img {...props} onClick={handleClick} style={{ cursor: "pointer" }} />
      {immersiveImage && (
        <ImmersiveImageViewer
          image={immersiveImage}
          onClose={handleClose}
          clickOrigin={clickOrigin}
        />
      )}
    </>
  );
};

export default ImmersiveImageViewer;
export type { ImageData };
