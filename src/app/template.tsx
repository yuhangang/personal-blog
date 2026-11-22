"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { shouldAnimate } = useTransition();
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const disableRouteTransition =
    pathname === "/terengganu" ||
    pathname === "/pantai-timor" ||
    Boolean(prefersReducedMotion);

  if (disableRouteTransition) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        ease: [0.16, 1, 0.3, 1],
        duration: 0.28,
      }}
    >
      {children}
    </motion.div>
  );
}
