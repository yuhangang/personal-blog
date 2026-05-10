"use client";

import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "../pantai-timor.module.scss";

export const pantaiLayout = {
  section: styles["pantai-section-base"],
  gutters: styles["pantai-gutters"],
  contentGutters: styles["pantai-content-gutters"],
  frame: styles["pantai-frame"],
  narrowFrame: styles["pantai-narrow-frame"],
  textMeasure: styles["pantai-text-measure"],
  sectionY: styles["pantai-section-y"],
} as const;

type PantaiSectionProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export const PantaiSection = forwardRef<HTMLElement, PantaiSectionProps>(
  ({ children, className, ...props }, ref) => (
    <section ref={ref} className={cn(pantaiLayout.section, className)} {...props}>
      {children}
    </section>
  )
);

PantaiSection.displayName = "PantaiSection";

type PantaiFrameProps = {
  children: ReactNode;
  className?: string;
  variant?: "standard" | "narrow";
  withGutters?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

export function PantaiFrame({
  children,
  className,
  variant = "standard",
  withGutters = false,
  ...props
}: PantaiFrameProps) {
  const frameClass = variant === "narrow" ? pantaiLayout.narrowFrame : pantaiLayout.frame;

  return (
    <div className={cn(withGutters && pantaiLayout.contentGutters, frameClass, className)} {...props}>
      {children}
    </div>
  );
}
