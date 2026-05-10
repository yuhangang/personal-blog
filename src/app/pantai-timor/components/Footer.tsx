"use client";

import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { PANTAI_TIMOR_COPY } from "../config";
import { PantaiFrame } from "./LayoutPrimitives";
import { motion } from "framer-motion";
import styles from "../pantai-timor.module.scss";

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
    <footer id="footer" className={styles.footer}>
      <PantaiFrame className={styles["footer-frame"]}>
        {/* Branding Header */}
        <div className={styles["footer-branding"]}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${cormorant.className} ${styles["footer-branding-title"]}`}
          >
            {PANTAI_TIMOR_COPY.animatedTitle.title}
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className={styles["footer-grid"]}>
          {/* Column 1: About */}
          <div className={styles["footer-column"]}>
            <h3 className={styles["footer-column-title"]}>The Enclave</h3>
            <p className={styles["footer-column-text"]}>
              {PANTAI_TIMOR_COPY.almanac.content}
            </p>
          </div>

          {/* Column 2: Sections */}
          <div className={styles["footer-column"]}>
            <h3 className={styles["footer-column-title"]}>Explore</h3>
            <div className={styles["footer-link-list"]}>
              {menuItems.map((item) => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  onClick={(e) => handleScroll(e, item.id)}
                  className={styles["footer-link"]}
                >
                  <span className={styles["link-hover-line"]} />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className={styles["footer-column"]}>
            <h3 className={styles["footer-column-title"]}>Navigate</h3>
            <div className={styles["footer-link-list"]}>
              <Link 
                href="/" 
                className={styles["footer-link"]}
              >
                <span className={styles["link-hover-line"]} />
                {PANTAI_TIMOR_COPY.footer.menu.home}
              </Link>
              <Link 
                href="/gallery" 
                className={styles["footer-link"]}
              >
                <span className={styles["link-hover-line"]} />
                {PANTAI_TIMOR_COPY.footer.menu.gallery}
              </Link>
            </div>
          </div>

          {/* Column 4: Back to Top */}
          <div className={styles["footer-column"]}>
            <h3 className={styles["footer-column-title"]}>Return</h3>
            <button 
              onClick={handleBackToTop}
              className={styles["back-to-top-btn"]}
            >
              <div className={styles["top-btn-circle"]}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles["top-btn-icon"]}>
                  <path d="M6 1V11M6 1L1 6M6 1L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles["back-to-top-label"]}>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles["footer-bottom"]}>
          <div className={styles["footer-bottom-stack"]}>
            <p className={styles["copyright-text"]}>
              {PANTAI_TIMOR_COPY.footer.copyright}
            </p>
          </div>
          <div className={styles["footer-bottom-row"]}>
             <span className={styles["rights-reserved"]}>
               All rights reserved.
             </span>
          </div>
        </div>
      </PantaiFrame>
    </footer>
  );
};
