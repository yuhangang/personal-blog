"use client";

import { AnimatePresence, motion, MotionValue, useTransform } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import React, { useEffect, useState } from "react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import Image from "next/image";
import { ptTrack } from "@/utils/ga-events";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PANTAI_TIMOR_COPY } from "../config";
import styles from "../pantai-timor.module.scss";

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
  navTitleOpacity: MotionValue<number>;
  navRef: React.RefObject<HTMLDivElement | null>;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const Navbar = ({
  navBgOpacity,
  navBlur,
  navBorderOpacity,
  navTitleOpacity,
  navRef,
  menuOpen,
  setMenuOpen,
}: NavbarProps) => {
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
    window.addEventListener("keydown", handleEsc);
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
        className={styles.navbar}
      >
        <div className={styles["nav-left"]}>
          {/* Home icon removed */}
        </div>
        
        <div ref={navRef} className={styles["nav-center"]}>
          <motion.span
            aria-hidden="true"
            style={{ opacity: navTitleOpacity }}
            className={`${cormorant.className} ${styles["nav-title"]}`}
          >
            {PANTAI_TIMOR_COPY.navbar.title}
          </motion.span>
        </div>
 
         <div className={styles["nav-right"]}>
           <button 
             onClick={() => {
               ptTrack.navMenuOpen();
               setMenuOpen(true);
             }}
             className={styles["menu-trigger"]}
             aria-label={PANTAI_TIMOR_COPY.navbar.openMenu}
           >
             <div className={styles["menu-lines"]}>
               <div className={styles["menu-line-1"]} />
               <div className={styles["menu-line-2"]} />
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
             className={styles["menu-overlay"]}
           >
             <div className={styles["menu-bg-container"]}>
               <AnimatePresence mode="wait">
                 {hoveredImage && (
                   <motion.div
                     key={hoveredImage}
                     initial={{ opacity: 0, scale: 1.1 }}
                     animate={{ opacity: 0.4, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.05 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className={styles["menu-bg-image-wrapper"]}
                   >
                     <Image
                       src={hoveredImage!}
                       alt="Menu Background"
                       fill
                       className={styles["menu-bg-image"]}
                       priority
                     />
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

            <div className={styles["menu-large-text"]}>
               <h2 className={cormorant.className}>PANTAI</h2>
            </div>
            
            <div className={styles["menu-radial-gradient"]} />

            <div className={styles["menu-header"]}>
              <div />
              <div className={styles["menu-header-center"]}>
                 <button 
                  onClick={handleTitleClick}
                  className={`${cormorant.className} ${styles["menu-title-button"]}`}
                >
                  {PANTAI_TIMOR_COPY.navbar.title}
                </button>
              </div>
              <div className={styles["menu-header-right"]}>
                <button 
                   onClick={() => {
                    ptTrack.navMenuClose();
                    setMenuOpen(false);
                  }}
                  className={styles["menu-close-btn"]}
                  aria-label={PANTAI_TIMOR_COPY.navbar.closeMenu}
                >
                  <div className={styles["close-icon-wrapper"]}>
                     <div className={styles["close-line-1"]} />
                     <div className={styles["close-line-2"]} />
                  </div>
                </button>
              </div>
            </div>

            <div className={styles["menu-content"]} data-lenis-prevent>
            
            <nav className={styles["menu-nav"]}>
              {menuItems.map((item, idx) => (
                <div
                  key={item.label}
                  className={styles["menu-item"]}
                  onClick={(e) => handleScroll(e, item.id)}
                  onMouseEnter={() => setHoveredImage(item.image)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <span className={styles["menu-item-number"]}>0{idx + 1}</span>
                  <a
                    href={item.id.startsWith("/") ? item.id : `#${item.id}`}
                    className={`${cormorant.className} ${styles["menu-item-link"]}`}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </nav>
            
            <div className={styles["menu-footer"]}>
               <Link 
                href="/gallery" 
                className={styles["menu-footer-link"]}
                onClick={() => setMenuOpen(false)}
              >
                {PANTAI_TIMOR_COPY.navbar.backToGallery}
              </Link>
              <div className={styles["menu-footer-divider"]} />
              <Link 
                href="/" 
                className={styles["menu-footer-link"]}
                onClick={() => setMenuOpen(false)}
              >
                {PANTAI_TIMOR_COPY.navbar.home}
              </Link>
            </div>
            </div>
          </motion.div>
         )}
       </AnimatePresence>
    </>
  );
};
