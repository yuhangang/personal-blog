"use client";

import { motion, Variants } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React from "react";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame, PantaiSection } from "./LayoutPrimitives";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

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
    <PantaiSection id="history-section" className="!pt-24 !pb-12 md:!py-32 overflow-hidden bg-transparent">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01218.jpg"
          alt="History Background"
          fill
          className="object-cover blur-[1px] opacity-60 scale-100"
        />
        {/* Dim Overlay */}
        <div className="absolute inset-0 bg-[#10110F]/50" />
      </div>

      <PantaiFrame variant="narrow" withGutters className="flex flex-col relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-12 md:gap-24"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="md:w-1/3 flex flex-col">
             <h3 className="font-sans !mb-6 !text-[0.8rem] md:!text-[0.9rem] font-bold uppercase !tracking-[0.4em] !text-[#fff]/60">
              {PANTAI_TIMOR_COPY.historyCulture.label}
            </h3>
             <h2 className={`${libreCaslon.className} !mb-0 !text-[2rem] md:!text-[3rem] !leading-[1.1] !text-[#fff]`}>
              {PANTAI_TIMOR_COPY.historyCulture.title}
            </h2>
          </motion.div>

          {/* Content Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 md:pt-4">
            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="font-sans !mb-4 !text-[0.8rem] font-bold uppercase !tracking-[0.2em] !text-[#fff]/80 border-b border-[#fff]/20 pb-4">
                {PANTAI_TIMOR_COPY.historyCulture.sections[0].title}
              </h4>
              <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-[#fff]/90">
                {PANTAI_TIMOR_COPY.historyCulture.sections[0].content}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="font-sans !mb-4 !text-[0.8rem] font-bold uppercase !tracking-[0.2em] !text-[#fff]/80 border-b border-[#fff]/20 pb-4">
                {PANTAI_TIMOR_COPY.historyCulture.sections[1].title}
              </h4>
              <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-[#fff]/90">
                {PANTAI_TIMOR_COPY.historyCulture.sections[1].content}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:col-span-2">
              <h4 className="font-sans !mb-4 !text-[0.8rem] font-bold uppercase !tracking-[0.2em] !text-[#fff]/80 border-b border-[#fff]/20 pb-4">
                {PANTAI_TIMOR_COPY.historyCulture.sections[2].title}
              </h4>
              <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-[#fff]/90">
                {PANTAI_TIMOR_COPY.historyCulture.sections[2].content}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </PantaiFrame>
    </PantaiSection>
  );
};
