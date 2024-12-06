import styled, { keyframes } from "styled-components";

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SlideWrapper = styled.div<{
  $isActive: boolean;
  $direction: "next" | "prev" | "initial";
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transform: ${(props) => {
    if (!props.$isActive) {
      return props.$direction === "next"
        ? "translateX(100%)"
        : "translateX(-100%)";
    }
    return "translateX(0)";
  }};
  transition: transform 500ms ease-in-out, opacity 500ms ease-in-out;
  z-index: ${(props) => (props.$isActive ? 10 : 1)};
`;
const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 21 / 9;

  @media (max-width: 768px) {
    aspect-ratio: 9 / 16;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  z-index: 30;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const BottomIndicatorsContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
  bottom: 8px;

  @media (min-width: 768px) {
    bottom: 24px;
  }
`;

const BottomIndicator = styled.div<{ $isActive: boolean }>`
  width: 40px;
  height: 4px;
  margin: 0 4px;
  background-color: ${(props) =>
    props.$isActive ? "white" : "rgba(255, 255, 255, 0.5)"};
  border-radius: 2px;
  transition: background-color 0.3s ease;
`;

const Indicators = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 8px;
`;

const Indicator = styled.button<{ $isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background-color: ${(props) => (props.$isActive ? "black" : "#D1D5DB")};
  border: none;
  cursor: pointer;
`;

const LocationContainer = styled.div`
  position: relative; // Keep relative positioning for child elements
  display: flex;
  justify-content: flex-start; // Default alignment (for larger screens)
  align-items: flex-end; // Align to bottom
  height: 100%; // Ensure proper alignment within a fixed height container
  padding: 16px; // Add padding to the container instead of the chip

  @media (max-width: 768px) {
    align-items: flex-start;
    justify-content: center; // Center horizontally on small screens
  }
`;

const LocationChip = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 32px; // Adjust bottom spacing instead of absolute positioning
`;

export {
  CarouselContainer,
  SlideWrapper,
  SlideContainer,
  NavigationButton,
  BottomIndicatorsContainer,
  BottomIndicator,
  Indicators,
  Indicator,
  LocationContainer,
  LocationChip,
};
