"use client";

import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const pantaiLayout = {
  section: "relative w-full flex flex-col items-center z-10",
  gutters: "!px-4 md:!px-8",
  contentGutters: "!px-6 md:px-[calc((100vw-min(1700px,100vw-3rem))/2)]",
  frame: "w-full max-w-[1700px] mx-auto",
  narrowFrame: "w-full max-w-[1280px] mx-auto",
  textMeasure: "max-w-[44rem]",
  sectionY: "!py-32 md:!py-48",
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
