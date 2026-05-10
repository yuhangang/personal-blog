"use client";

import { motion, Variants, MotionValue, useScroll, useTransform } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React, { useRef } from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection } from "./LayoutPrimitives";
import styles from "../pantai-timor.module.scss";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

const Word = ({ children, progress, range, index, yOffset = 24 }: { children: React.ReactNode, progress: MotionValue<number>, range: [number, number], index: number, yOffset?: number }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [yOffset + Math.sin(index * 0.4) * (yOffset / 2), 0]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
  
  return (
    <motion.span 
      suppressHydrationWarning
      style={{ opacity, y, filter: blur }} 
      className={styles["history-word"]}
    >
      {children}
    </motion.span>
  );
};

const FadingText = ({ text, className, yOffset = 24, as: Component = "div" }: { text: string, className?: string, yOffset?: number, as?: React.ElementType }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"]
  });

  const words = text.split(/\s+/);
  const Tag = Component as "div";

  return (
    <Tag ref={containerRef as React.Ref<HTMLDivElement>} className={`${styles["fading-text-container"]} ${className || ""}`}>
      {words.map((word, i) => {
        const wordCount = words.length;
        const start = i / wordCount;
        const end = start + 0.15;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, Math.min(end, 1)]} index={i} yOffset={yOffset}>
            {word}
          </Word>
        );
      })}
    </Tag>
  );
};

export const HistoryCulture = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <PantaiSection id="history-section" className={styles["history-section"]}>
      {/* Background Image */}
      <div className={styles["history-bg-container"]}>
        <Image
          src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01218.jpg"
          alt="History Background"
          fill
          className={styles["history-bg-image"]}
        />
        {/* Dim Overlay */}
        <div className={styles["history-dim-overlay"]} />
      </div>

      <PantaiFrame variant="narrow" withGutters className={styles["history-content-frame"]}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className={styles["history-grid-container"]}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className={styles["history-header"]}>
             <h3 className={styles["history-label"]}>
              {PANTAI_TIMOR_COPY.historyCulture.label}
            </h3>
            <FadingText 
              as="h2"
              className={`${libreCaslon.className} ${styles["history-title"]}`}
              text={PANTAI_TIMOR_COPY.historyCulture.title}
              yOffset={24}
            />
          </motion.div>

          {/* Content Grid */}
          <div className={styles["history-content-grid"]}>
            <motion.div variants={itemVariants} className={styles["history-sub-section"]}>
              <h4 className={styles["history-sub-title"]}>
                {PANTAI_TIMOR_COPY.historyCulture.sections[0].title}
              </h4>
              <FadingText 
                as="p"
                className={styles["history-description"]}
                text={PANTAI_TIMOR_COPY.historyCulture.sections[0].content}
                yOffset={12}
              />
            </motion.div>

            <motion.div variants={itemVariants} className={styles["history-sub-section"]}>
              <h4 className={styles["history-sub-title"]}>
                {PANTAI_TIMOR_COPY.historyCulture.sections[1].title}
              </h4>
              <FadingText 
                as="p"
                className={styles["history-description"]}
                text={PANTAI_TIMOR_COPY.historyCulture.sections[1].content}
                yOffset={12}
              />
            </motion.div>

            <motion.div variants={itemVariants} className={`${styles["history-sub-section"]} ${styles["full-width"]}`}>
              <h4 className={styles["history-sub-title"]}>
                {PANTAI_TIMOR_COPY.historyCulture.sections[2].title}
              </h4>
              <FadingText 
                as="p"
                className={styles["history-description"]}
                text={PANTAI_TIMOR_COPY.historyCulture.sections[2].content}
                yOffset={12}
              />
            </motion.div>
          </div>
        </motion.div>
      </PantaiFrame>
    </PantaiSection>
  );
};
