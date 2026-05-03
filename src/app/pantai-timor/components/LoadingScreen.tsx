"use client";

import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { PANTAI_TIMOR_COPY } from "../config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

export const LoadingScreen = () => {

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#10110F]"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
           <h2 className={`${cormorant.className} text-2xl text-[#e3e1da] opacity-80 italic`}>
            {PANTAI_TIMOR_COPY.loading.text}
          </h2>
        </motion.div>

        {/* Progress bar background */}
        <div className="w-32 h-[1px] bg-[#e3e1da]/10 overflow-hidden relative mt-8">
          {/* Animated progress line */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 w-full h-full bg-[#e3e1da]/40"
          />
        </div>
      </div>
      
      {/* Subtle background texture or glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e3e1da]/5 blur-[120px] rounded-full" />
      </div>
    </motion.div>
  );
};
