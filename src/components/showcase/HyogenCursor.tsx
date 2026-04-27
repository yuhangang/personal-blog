"use client";

import { useEffect, useState, memo } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

function HyogenCursorComponent() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Smooth springs for the cursor follow effect
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50, mass: 0.5 });

  useEffect(() => {
    let lastHoverState = false;

    const handleMouseMove = (e: MouseEvent) => {
      // Use direct motion value set for best performance
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Efficient hover detection
      const target = e.target as HTMLElement;
      const currentHoverState = !!target.closest(".project-card");
      
      if (currentHoverState !== lastHoverState) {
        setIsHovering(currentHoverState);
        lastHoverState = currentHoverState;
      }
    };

    // Add passive listener for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        scale: isHovering ? 1 : 0,
        opacity: isHovering ? 1 : 0,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[999] flex h-20 w-20 items-center justify-center rounded-full bg-black text-white mix-blend-normal will-change-transform"
    >
      <span className="font-sans text-[0.6rem] font-medium tracking-[0.2em] select-none">
        詳細
      </span>
    </motion.div>
  );
}

const HyogenCursor = memo(HyogenCursorComponent);
export default HyogenCursor;
