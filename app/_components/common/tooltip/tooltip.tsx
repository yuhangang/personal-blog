import React, {
  useState,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import styled, { css } from "styled-components";

// Type definitions for tooltip positions
type TooltipPosition = "top" | "bottom" | "left" | "right";

// Interface for Tooltip props
interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: TooltipPosition;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div<{
  $isVisible: boolean;
  $position: TooltipPosition;
}>`
  position: absolute;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;

  ${({ $position }) => {
    switch ($position) {
      case "bottom":
        return css`
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 6px;
        `;
      case "left":
        return css`
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 6px;
        `;
      case "right":
        return css`
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 6px;
        `;
      default: // top
        return css`
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 6px;
        `;
    }
  }}

  ${({ $isVisible }) =>
    $isVisible &&
    css`
      opacity: 1;
    `}
`;

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Ensure the child is a valid element before cloning
  const enhancedChild = React.Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<any>, {
        onMouseEnter: (e: React.MouseEvent) => {
          setIsVisible(true);

          // Call original onMouseEnter if it exists
          const originalOnMouseEnter = (child.props as any)?.onMouseEnter;
          if (typeof originalOnMouseEnter === "function") {
            try {
              originalOnMouseEnter(e);
            } catch (error) {
              console.error("Error in original onMouseEnter", error);
            }
          }
        },
        onMouseLeave: (e: React.MouseEvent) => {
          setIsVisible(false);

          // Call original onMouseLeave if it exists
          const originalOnMouseLeave = (child.props as any)?.onMouseLeave;
          if (typeof originalOnMouseLeave === "function") {
            try {
              originalOnMouseLeave(e);
            } catch (error) {
              console.error("Error in original onMouseLeave", error);
            }
          }
        },
      });
    }
    return child;
  });

  return (
    <TooltipContainer>
      {enhancedChild}
      <TooltipText $isVisible={isVisible} $position={position}>
        {text}
      </TooltipText>
    </TooltipContainer>
  );
};

export default Tooltip;
