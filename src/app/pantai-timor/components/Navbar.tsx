"use client";

import { AnimatePresence, motion, MotionValue, useTransform } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import React, { useEffect, useState } from "react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import Image from "next/image";
import { ptTrack } from "@/utils/ga-events";
import { useRouter } from "next/navigation";
import Link from "next/link";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
  display: "swap",
});

interface NavbarProps {
  navBgOpacity: MotionValue<number>;
  navBlur: MotionValue<number>;
  navBorderOpacity: MotionValue<number>;
  navRef: React.RefObject<HTMLDivElement | null>;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const Navbar = ({ navBgOpacity, navBlur, navBorderOpacity, navRef, menuOpen, setMenuOpen }: NavbarProps) => {
  const { lenis } = useLenis();
  const router = useRouter();

  const menuItems = [

    { label: "HISTORY", id: "history-section", image: "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01218.jpg" },
    { label: "VILLAGE", id: "village", image: "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00756_2.JPG" },
    { label: "GEOGRAPHY", id: "geography", image: "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00631.JPG" },
    { label: "ARCHIVE", id: "archive", image: "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00587.JPG" },
  ];

  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [menuOpen, lenis]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setMenuOpen]);

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    ptTrack.navClick(id);
    setMenuOpen(false);

    if (id.startsWith("/")) {
      router.push(id);
      return;
    }

    if (lenis) {
      lenis.start();
      lenis.scrollTo(`#${id}`, { offset: -20 });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav 
        initial={false}
        style={{ 
          backgroundColor: useTransform(navBgOpacity, [0, 1], ["rgba(16, 17, 15, 0)", "rgba(16, 17, 15, 0.42)"]),
          backdropFilter: useTransform(navBlur, (v) => (v <= 0.01 ? "none" : `blur(${v}px) saturate(180%)`)),
          borderBottom: useTransform(navBorderOpacity, (v) => (v <= 0.001 ? "0 solid rgba(227, 225, 218, 0)" : `1px solid rgba(227, 225, 218, ${v})`)),
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
        className="fixed top-0 left-0 w-full z-[60] grid grid-cols-3 items-center !px-4 h-[calc(72px+env(safe-area-inset-top,0px))] md:h-[calc(80px+env(safe-area-inset-top,0px))] md:grid-cols-[1fr_auto_1fr] md:!px-10 bg-transparent transition-none"
      >
        <div className="flex items-center gap-6 md:gap-10">
          {/* Home icon removed */}
        </div>
        
        <div ref={navRef} className="flex items-center justify-center pointer-events-none min-w-0 md:min-w-[20rem]">
           <span className={`${cormorant.className} text-[1.85rem] md:text-[2rem] leading-none invisible font-normal tracking-tight`}>PANTAI TIMOR</span>
        </div>

        <div className="flex justify-end items-center">
          <button 
            onClick={() => {
              ptTrack.navMenuOpen();
              setMenuOpen(true);
            }}
            className="flex items-center justify-center text-[#e3e1da] group"
            aria-label="Open menu"
          >
            <div className="flex flex-col gap-2 items-end">
              <div className="w-7 h-[1px] bg-[#e3e1da]/90 transition-all group-hover:w-8" />
              <div className="w-5 h-[1px] bg-[#e3e1da]/90 transition-all group-hover:w-8" />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ backdropFilter: "blur(32px) saturate(180%)" }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#10110F]/42 overflow-hidden"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <AnimatePresence mode="wait">
                {hoveredImage && (
                  <motion.div
                    key={hoveredImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={hoveredImage}
                      alt="Menu Background"
                      fill
                      className="object-cover blur-[10px] scale-110"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute -bottom-10 -right-20 pointer-events-none opacity-[0.03] select-none z-10">
               <h2 className={`${cormorant.className} text-[25rem] leading-none whitespace-nowrap`}>PANTAI</h2>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(43,65,71,0.15)_0%,transparent_70%)] pointer-events-none z-10" />

            <div className="flex items-center justify-between relative z-10 grid grid-cols-3 w-full !px-4 h-[72px] md:h-20 md:!px-10 border-b border-[#e3e1da]/10">
              <div />
              <div className="flex justify-center">
                <button 
                  onClick={handleTitleClick}
                  className={`${cormorant.className} text-[1.85rem] md:text-[2rem] leading-none text-[#f2f0ea] whitespace-nowrap tracking-tight hover:opacity-70 transition-opacity cursor-pointer`}
                >
                  PANTAI TIMOR
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    ptTrack.navMenuClose();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center text-[#e3e1da] group"
                  aria-label="Close menu"
                >
                  <div className="relative w-7 h-7 flex items-center justify-center">
                     <div className="absolute w-7 h-[1px] bg-[#e3e1da] rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]" />
                     <div className="absolute w-7 h-[1px] bg-[#e3e1da] -rotate-45 transition-transform duration-500 group-hover:rotate-[135deg]" />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center !p-6 md:!p-20">
            
            <nav className="flex flex-col gap-8 !pl-4 md:!pl-0 md:items-center relative z-10 md:!mt-0">
              {menuItems.map((item, idx) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 group cursor-pointer md:gap-8"
                  onClick={(e) => handleScroll(e, item.id)}
                  onMouseEnter={() => setHoveredImage(item.image)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <span className="font-sans text-[0.6rem] md:text-[0.7rem] font-bold text-[#e3e1da]/30 pt-3 md:pt-4">0{idx + 1}</span>
                  <a
                    href={item.id.startsWith("/") ? item.id : `#${item.id}`}
                    className={`${cormorant.className} text-[2.5rem] md:text-[4.5rem] font-light uppercase tracking-[0.05em] text-[#f2f0ea] leading-tight`}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </nav>
            
            <div className="absolute bottom-12 left-0 w-full flex flex-row items-center justify-center gap-6 md:gap-12 z-10">
              <Link 
                href="/gallery" 
                className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Back to Gallery
              </Link>
              <div className="w-[1px] h-3 bg-[#e3e1da]/10" />
              <Link 
                href="/" 
                className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-[#e3e1da]/40 hover:text-[#e3e1da] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </div>


            
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
