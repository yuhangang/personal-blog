import styled from "styled-components";

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 64rem;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AvatarWrapper = styled.div<{
  size: "small" | "medium" | "large";
  variant: "circle" | "square";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #e1e1e1;
  color: #333;
  font-weight: 600;
  text-transform: uppercase;

  width: ${({ size }) =>
    size === "small" ? "40px" : size === "medium" ? "64px" : "200px"};
  height: ${({ size }) =>
    size === "small" ? "40px" : size === "medium" ? "64px" : "200px"};

  border-radius: ${({ variant }) => (variant === "circle" ? "50%" : "12px")};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${({ variant }) => (variant === "circle" ? "50%" : "12px")};
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const BioText = styled.div`
  flex: 1;
  margin-left: 1rem;

  @media (max-width: 768px) {
    margin-left: 0;
    text-align: center;
  }
`;

const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

export { AvatarContainer, AvatarWrapper, BioText, Name, Description };
