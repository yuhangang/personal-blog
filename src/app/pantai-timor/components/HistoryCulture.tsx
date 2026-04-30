"use client";

import { motion, Variants } from "framer-motion";
import { Libre_Caslon_Text } from "next/font/google";
import Image from "next/image";
import React from "react";

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
    <section id="history-section" className="relative w-full !pt-24 !pb-12 md:!py-32 !px-6 md:!px-12 flex flex-col items-center z-10 overflow-hidden bg-transparent">
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

      <div className="max-w-screen-xl w-full flex flex-col relative z-10">
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
              Echoes of the Past
            </h3>
            <h2 className={`${libreCaslon.className} !mb-0 !text-[2rem] md:!text-[3rem] !leading-[1.1] !text-[#fff]`}>
              A Tapestry of Trade & Tradition
            </h2>
          </motion.div>

          {/* Content Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 md:pt-4">
            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="font-sans !mb-4 !text-[0.8rem] font-bold uppercase !tracking-[0.2em] !text-[#fff]/80 border-b border-[#fff]/20 pb-4">
                The Siamese Imprint
              </h4>
              <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-[#fff]/90">
                To the north, the powerful kingdoms of Ayutthaya and Sukhothai cast a long shadow. This historical proximity wove Siamese influences deeply into the administrative structures, regional dialects, and daily customs of Kelantan and Terengganu, creating a unique Malay-Siamese cultural blend.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="font-sans !mb-4 !text-[0.8rem] font-bold uppercase !tracking-[0.2em] !text-[#fff]/80 border-b border-[#fff]/20 pb-4">
                The Islamic Dawn
              </h4>
              <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-[#fff]/90">
                Carried on the monsoon winds by merchants, Islam gradually embedded itself into the region&apos;s social fabric. This arrival brought new legal frameworks—evidenced by the famous Terengganu Inscription Stone, discovered in a local river and now housed in the State Museum, which stands as the earliest testament to Quranic-based Jawi script in the Malay world.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:col-span-2">
              <h4 className="font-sans !mb-4 !text-[0.8rem] font-bold uppercase !tracking-[0.2em] !text-[#fff]/80 border-b border-[#fff]/20 pb-4">
                The Maritime Crossroads
              </h4>
              <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-[#fff]/90">
                For centuries, the eastern shoreline served as a vital artery in the global maritime trade network. Bridging the gap between the markets of China, India, and the Middle East, these coastal communities flourished as dynamic hubs of commerce, cultural exchange, and seafaring resilience.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
