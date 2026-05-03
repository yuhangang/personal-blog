"use client";


import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame } from "./LayoutPrimitives";
import { motion } from "framer-motion";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

export const Footer = () => {
  const { lenis } = useLenis();

   const menuItems = [
    { label: PANTAI_TIMOR_COPY.footer.menu.history, id: "history-section" },
    { label: PANTAI_TIMOR_COPY.footer.menu.village, id: "village" },
    { label: PANTAI_TIMOR_COPY.footer.menu.geography, id: "geography" },
    { label: PANTAI_TIMOR_COPY.footer.menu.archive, id: "archive" },
  ];

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -20 });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="relative z-20 flex w-full flex-col items-center border-t border-[#e3e1da]/10 bg-[#10110F] !px-6 !pt-32 !pb-20 sm:!px-8 md:!pt-48 md:!pb-24 lg:!px-10">
      <PantaiFrame className="flex flex-col items-center gap-20 md:gap-28 lg:gap-32">
        {/* Branding Header */}
        <div className="w-full text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${cormorant.className} !mb-0 !text-[clamp(3.5rem,15vw,10rem)] !leading-[0.85] !tracking-tight text-[#e3e1da] opacity-90`}
          >
            {PANTAI_TIMOR_COPY.animatedTitle.title}
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 justify-items-center gap-14 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: About */}
          <div className="flex max-w-xs flex-col items-center gap-6 text-center">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#e3e1da]">The Enclave</h3>
            <p className="font-sans text-xs leading-relaxed text-[#e3e1da]/40 text-balance max-w-xs">
              {PANTAI_TIMOR_COPY.almanac.content}
            </p>
          </div>

          {/* Column 2: Sections */}
          <div className="flex max-w-xs flex-col items-center gap-6 text-center">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#e3e1da]">Explore</h3>
            <div className="flex flex-col items-center gap-4">
              {menuItems.map((item) => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  onClick={(e) => handleScroll(e, item.id)}
                  className="group flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-all"
                >
                  <span className="hidden md:block w-0 group-hover:w-4 h-px bg-[#e3e1da]/40 transition-all duration-300 overflow-hidden" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className="flex max-w-xs flex-col items-center gap-6 text-center">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#e3e1da]">Navigate</h3>
            <div className="flex flex-col items-center gap-4">
              <Link 
                href="/" 
                className="group flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-all"
              >
                <span className="hidden md:block w-0 group-hover:w-4 h-px bg-[#e3e1da]/40 transition-all duration-300 overflow-hidden" />
                {PANTAI_TIMOR_COPY.footer.menu.home}
              </Link>
              <Link 
                href="/gallery" 
                className="group flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-all"
              >
                <span className="hidden md:block w-0 group-hover:w-4 h-px bg-[#e3e1da]/40 transition-all duration-300 overflow-hidden" />
                {PANTAI_TIMOR_COPY.footer.menu.gallery}
              </Link>
            </div>
          </div>

          {/* Column 4: Back to Top */}
          <div className="flex max-w-xs flex-col items-center gap-6 text-center">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#e3e1da]">Return</h3>
            <button 
              onClick={handleBackToTop}
              className="group flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e3e1da]/80 hover:text-[#e3e1da] transition-all"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e3e1da]/20 group-hover:border-[#e3e1da]/40 transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:-translate-y-1 transition-transform">
                  <path d="M6 1V11M6 1L1 6M6 1L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="hidden md:block">Back to Top</span>
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex w-full flex-col items-center justify-center gap-8 pt-12 text-center md:pt-16">
          <div className="flex flex-col items-center gap-2">
            <p className="!mb-0 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#e3e1da]/30">
              {PANTAI_TIMOR_COPY.footer.copyright}
            </p>
          </div>
          <div className="flex items-center gap-8">
             <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#e3e1da]/20">
               All rights reserved.
             </span>
          </div>
        </div>
      </PantaiFrame>
    </footer>



  );
};
