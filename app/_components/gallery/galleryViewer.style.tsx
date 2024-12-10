import styled, { keyframes } from "styled-components";

// Fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Zoom and origin-based animation
const createZoomAnimation = (originX: number, originY: number) => keyframes`
  from {
    opacity: 0;
    transform: 
      translate(${-originX}px, ${-originY}px) 
      scale(0.2) 
      translate(${originX}px, ${originY}px);
  }
  to {
    opacity: 1;
    transform: 
      translate(0px, 0px) 
      scale(1) 
      translate(0px, 0px);
  }
`;

// Styled Components
const ImmersiveOverlay = styled.div<{ $originX: number; $originY: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;

  // Always animate fade-in
  animation: ${fadeIn} 0.3s ease-out forwards;

  &.active {
    pointer-events: all;
  }
`;

const ImmersiveImage = styled.img<{ $originX: number; $originY: number }>`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  opacity: 0;
  animation: ${fadeIn} 0.3s ease-out forwards,
    ${(props) => createZoomAnimation(props.$originX, props.$originY)} 0.5s
      cubic-bezier(0.25, 0.1, 0.25, 1) forwards;

  &.active {
    opacity: 1;
  }
`;

export { ImmersiveOverlay, ImmersiveImage };
