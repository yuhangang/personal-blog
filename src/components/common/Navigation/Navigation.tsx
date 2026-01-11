"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.scss";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const [activeSection, setActiveSection] = useState("home");

  // Dynamic Theme & Scroll Spy
  useEffect(() => {
    // Scroll state
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Theme Observer
    const themeSections = document.querySelectorAll("[data-theme]");
    const themeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute("data-theme") as
              | "light"
              | "dark";
            if (theme) setNavTheme(theme);
          }
        });
      },
      { rootMargin: "-30px 0px -90% 0px" }
    );
    themeSections.forEach((s) => themeObserver.observe(s));

    // Section Spy Observer
    // Only active on homepage
    if (pathname === "/") {
      const spySections = ["home", "about", "identity", "contact"];
      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
              console.log("Active Section Check:", entry.target.id); // Debug Log
            }
          });
        },
        { rootMargin: "-30% 0px -30% 0px" }
      ); // Broader detection (30% vs 40%)

      spySections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) spyObserver.observe(el);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        themeSections.forEach((s) => themeObserver.unobserve(s));
        spySections.forEach((id) => {
          const el = document.getElementById(id);
          if (el) spyObserver.unobserve(el);
        });
      };
    } else {
      // Non-home pages: Still observe 'contact' (Footer)
      const cleanPath = pathname.replace("/", "") || "home";

      // Default to page name
      setActiveSection(cleanPath);

      const contactObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection("contact");
            } else {
              // When contact leaves view, revert to page name
              setActiveSection(cleanPath);
            }
          });
        },
        { rootMargin: "-10% 0px -10% 0px", threshold: 0.1 }
      ); // More sensitive for footer

      const contactEl = document.getElementById("contact");
      if (contactEl) contactObserver.observe(contactEl);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        themeSections.forEach((s) => themeObserver.unobserve(s));
        if (contactEl) contactObserver.unobserve(contactEl);
      };
    }
  }, [pathname]);

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const { lenis } = useLenis();

  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
      document.body.classList.add("nav-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [mobileMenuOpen, lenis]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileMenuOpen(false);

    if (href.startsWith("#") || (pathname === "/" && href.startsWith("/#"))) {
      e.preventDefault();
      const targetId = href.split("#")[1];
      const element = document.getElementById(targetId);
      if (element) {
        lenis?.scrollTo(element);
      }
    }
  };

  if (pathname === "/resume") return null;

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${
          mobileMenuOpen ? styles.navOpen : ""
        }`}
        data-nav-theme={navTheme}
      >
        <div className={styles.container}>
          {/* Identity Anchor */}
          {/* Identity Anchor */}
          <div className={styles.identityAnchor}>
            <Link
              href="/"
              className={styles.name}
              onClick={(e) => handleClick(e, "/#home")}
            >
              Yu Hang Ang
            </Link>

            {/* Logic: Only show anchor if mapped to a valid label */}
            <AnimatePresence>
              {(() => {
                const SECTION_LABELS: Record<string, string> = {
                  about: "About",
                  contact: "Contact",
                  identity: "Create", // Homepage section alias
                  create: "Create", // Actual page
                };

                const displayText = SECTION_LABELS[activeSection] || null;

                if (!displayText) return null;

                return (
                  <motion.div
                    key="anchor-container"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className={styles.anchorContainer}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      overflow: "hidden",
                    }}
                  >
                    <span className={styles.separator}>|</span>
                    <FilmLightText text={displayText} />
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* New Desktop Navigation (Minimal) */}
          <ul className={styles.links}>
            {/* We can hide standard links if we want a pure "anchor" look, or keep them. 
                 The request implies "make navbar... display scroll ancho", 
                 often this replaces the standard menu or sits alongside. 
                 I'll keep the hamburger for full menu and maybe hide text links 
                 to be cleaner, OR just keep them. Let's keep them for usability but make sure styling works.
             */}
          </ul>

          {/* Menu Button - New Design */}
          {/* Menu Button - New Design */}
          <button
            className={styles.menuButton}
            onClick={handleMenuClick}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <span className={styles.closeIcon}>✕</span>
            ) : (
              <span className={styles.hamburger}>
                <span></span>
                <span></span>
              </span>
            )}
          </button>

          {/* New Dark Floating Menu - Moved inside container for relative positioning */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  className={styles.menuBackdrop}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setMobileMenuOpen(false)}
                />

                <motion.div
                  className={styles.menuOverlay}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.menuContent}>
                    <nav className={styles.menuNav}>
                      {[
                        { label: "Home", href: "/" },
                        { label: "About", href: "/about" },
                        { label: "Create", href: "/create" },
                        { label: "Contact", href: "#contact" },
                      ].map((link, i) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}
                        >
                          <Link
                            href={link.href}
                            className={`${styles.menuLink} ${
                              pathname === link.href ? styles.active : ""
                            }`}
                            onClick={(e) => handleClick(e, link.href)}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    <motion.div
                      className={styles.menuFooter}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <div className={styles.socialCard}>
                        <span className={styles.socialLabel}>Follow me</span>
                        <div className={styles.socialIcons}>
                          <a
                            href="https://github.com/yuhangang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="GitHub"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                          <a
                            href="https://www.linkedin.com/in/yu-hang-ang-b8510010b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="LinkedIn"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                          <a
                            href="https://www.instagram.com/yuhangang/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            aria-label="Instagram"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}

// --- Components ---

function FilmLightText({ text }: { text: string }) {
  // Cinematic Crop = Slide Reveal
  return (
    <motion.div
      className={styles.anchorWrapper}
      layout // Animate width changes
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "100%", filter: "blur(2px)", opacity: 0 }}
          animate={{
            y: "0%",
            filter: "blur(0px)",
            opacity: 1,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            y: "-100%",
            filter: "blur(2px)",
            opacity: 0,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          }}
          className={styles.anchorText}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
