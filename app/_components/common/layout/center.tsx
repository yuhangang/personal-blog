import styled from "styled-components";

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const CenterVertical = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CenterHorizontal = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

// Flexbox column centering
const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

interface SpacerProps {
  size?: number;
}

const Spacer = styled.div<SpacerProps>`
  width: ${({ size = 16 }) => size}px;
  height: ${({ size = 16 }) => size}px;

  @media (max-width: 768px) {
    width: ${({ size = 8 }) => size / 2}px;
    height: ${({ size = 8 }) => size / 2}px;
  }
`;

export { Center, CenterVertical, CenterHorizontal, CenterColumn, Row, Spacer };
