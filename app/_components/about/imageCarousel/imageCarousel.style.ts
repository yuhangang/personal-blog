import styled from "styled-components";

export const CarouselContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 60vh;
  overflow: hidden;
`;

export const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Slide = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

export const PlaceholderSlide = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2a303c;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 14px;
`;

export const CarouselImage = styled.image`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px white;
  }
`;

export const PrevButton = styled(CarouselButton)`
  left: 16px;

  @media (min-width: 768px) {
    left: 32px;
  }
  @media (min-width: 1024px) {
    left: 48px;
  }
`;

export const NextButton = styled(CarouselButton)`
  right: 16px;

  @media (min-width: 768px) {
    right: 32px;
  }
  @media (min-width: 1024px) {
    right: 48px;
  }
`;

export const Indicators = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

export const Indicator = styled.button<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${(props) =>
    props.$isActive ? "white" : "rgba(255, 255, 255, 0.5)"};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: white;
  }
`;
