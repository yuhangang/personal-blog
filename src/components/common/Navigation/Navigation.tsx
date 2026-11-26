"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import styles from "./Navigation.module.scss";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { NAV_LINKS } from "@/config/navigation";
import { SOCIAL_LINKS } from "@/config/social";

const HOME_SECTION_LABELS: Record<string, string> = {
  photography: "Photography",
};

const HIDDEN_ROUTES = new Set(["/pantai-timor", "/terengganu"]);

const INLINE_NAV_LINKS = NAV_LINKS.filter((item) => item.href !== "/");

export default function Navigation() {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const isOpeningRef = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [overDarkSurface, setOverDarkSurface] = useState(false);
  const [overHeroCover, setOverHeroCover] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [homeSectionLabel, setHomeSectionLabel] = useState<string | null>(null);

  const isHidden = HIDDEN_ROUTES.has(pathname);
  const isDarkRoute =
    pathname === "/" || pathname.startsWith("/gallery") || pathname === "/about";
  const isHome = pathname === "/";

  const navTheme: "light" | "dark" = isDarkRoute
    ? "dark"
    : overHeroCover || (isHome && overDarkSurface)
      ? "dark"
      : "light";

  const contextLabel = isHome ? homeSectionLabel : null;

  useEffect(() => {
    if (isHidden) return;

    const handleScroll = () => {
      const coverEl = document.querySelector<HTMLElement>("[data-nav-cover]");
      if (coverEl) {
        const coverMode = coverEl.getAttribute("data-nav-cover");
        // A fixed cover sits behind the nav for the whole page, so the nav
        // stays transparent instead of switching to the frosted bar.
        if (coverMode === "fixed") {
          setOverHeroCover(true);
          setScrolledPastHero(false);
          return;
        }
        const threshold =
          coverMode === "sticky"
            ? Math.max(coverEl.offsetHeight - 72, 240)
            : Math.max(coverEl.offsetHeight * 0.65, 240);
        const pastCover = window.scrollY >= threshold;
        setOverHeroCover(!pastCover);
        setScrolledPastHero(pastCover);
      } else {
        setOverHeroCover(false);
        setScrolledPastHero(window.scrollY > 24);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    const rafScroll = requestAnimationFrame(handleScroll);

    const themeSections = document.querySelectorAll("[data-theme]");
    const themeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute("data-theme");
            setOverDarkSurface(theme === "dark");
          }
        });
      },
      { rootMargin: "-24px 0px -88% 0px" }
    );
    themeSections.forEach((el) => themeObserver.observe(el));

    let spyObserver: IntersectionObserver | null = null;

    if (isHome) {
      spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              setHomeSectionLabel(HOME_SECTION_LABELS[id] ?? null);
            }
          });
        },
        { rootMargin: "-35% 0px -45% 0px" }
      );

      Object.keys(HOME_SECTION_LABELS).forEach((id) => {
        const el = document.getElementById(id);
        if (el) spyObserver?.observe(el);
      });

      const practiceEl = document.getElementById("practice");
      if (practiceEl) spyObserver.observe(practiceEl);
    }

    return () => {
      cancelAnimationFrame(rafScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      themeObserver.disconnect();
      spyObserver?.disconnect();
    };
  }, [pathname, isHidden, isHome]);

  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!dialog?.open) return;

    isOpeningRef.current = false;
    if (scroller) {
      scroller.scrollTo({ left: 0, behavior: "auto" });
    } else {
      dialog.close();
    }
  }, []);

  // Wire up scroll-snap drawer state observation, Escape handling,
  // and progressive backdrop-fade fallback for browsers without animation-timeline.
  useEffect(() => {
    if (isHidden) return;
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!dialog || !scroller || !sheet) return;

    const visibleThreshold = 1 / Math.max(window.innerWidth, 1);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry) return;

        if (entry.intersectionRatio >= visibleThreshold) {
          isOpeningRef.current = false;
        }

        if (entry.intersectionRatio === 1) {
          setMenuOpen(true);
        } else if (
          entry.intersectionRatio < visibleThreshold &&
          dialog.open &&
          !isOpeningRef.current
        ) {
          dialog.close();
        }
      },
      { root: dialog, threshold: [visibleThreshold, 1] }
    );
    observer.observe(sheet);

    const onCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeMenu();
      }
    };
    dialog.addEventListener("cancel", onCancel);

    const supportsScrollTimeline = Boolean(
      window.CSS?.supports?.("animation-timeline", "scroll()")
    );
    const onScroll = () => {
      const width = sheet.offsetWidth;
      const ratio =
        width > 0 ? Math.min(1, Math.max(0, scroller.scrollLeft / width)) : 0;
      dialog.style.setProperty("--drawer-backdrop", String(ratio));
    };

    if (!supportsScrollTimeline) {
      scroller.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      dialog.removeEventListener("cancel", onCancel);
      if (!supportsScrollTimeline) {
        scroller.removeEventListener("scroll", onScroll);
      }
    };
  }, [isHidden, closeMenu]);

  const openMenu = useCallback(async () => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!dialog || !scroller || !sheet || dialog.open) return;

    isOpeningRef.current = true;
    dialog.showModal();
    setMenuOpen(true);
    lenis?.stop();

    if (!window.CSS?.supports?.("scroll-initial-target", "nearest")) {
      scroller.scrollTo({ left: 0, behavior: "instant" });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
    }

    if (!dialog.open) return;
    scroller.scrollTo({ left: sheet.offsetWidth, behavior: "auto" });
  }, [lenis]);

  const handleDialogClose = useCallback(() => {
    isOpeningRef.current = false;
    if (dialogRef.current) {
      dialogRef.current.returnValue = "";
    }
    setMenuOpen(false);
    lenis?.start();
  }, [lenis]);

  const handleDialogClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    },
    [closeMenu]
  );

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      closeMenu();

      if (href === "/" && isHome) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (href.startsWith("#") || (isHome && href.startsWith("/#"))) {
        const targetId = href.split("#")[1];
        const targetEl = targetId ? document.getElementById(targetId) : null;
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -84 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    },
    [closeMenu, isHome, lenis]
  );

  if (isHidden) return null;

  return (
    <>
      <header
        className={`${styles.header} ${scrolledPastHero ? styles.scrolled : ""}`}
        data-nav-theme={navTheme}
        data-over-cover={overHeroCover ? "true" : undefined}
      >
        <div className={styles.inner}>
          <div className={styles.brandGroup}>
            <Link
              href="/"
              className={styles.brand}
              aria-current={isHome ? "page" : undefined}
              onClick={(e) => handleLinkClick(e, "/")}
            >
              Yu Hang
            </Link>
            {contextLabel && (
              <span className={styles.contextGroup} aria-hidden="true">
                <span className={styles.contextDivider}>/</span>
                <span className={styles.contextLabel}>{contextLabel}</span>
              </span>
            )}
          </div>

          <nav className={styles.nav} aria-label="Primary navigation">
            <ul className={styles.navList}>
              {INLINE_NAV_LINKS.map((item) => {
                const isActive =
                  item.href === pathname ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(e) => handleLinkClick(e, item.href)}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className={styles.menuTrigger}
              onClick={openMenu}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="site-menu-dialog"
              aria-label="Open navigation menu"
            >
              <span className={styles.menuTriggerLabel}>Menu</span>
              <span className={styles.menuBars} aria-hidden="true">
                <span className={styles.menuBarTop} />
                <span className={styles.menuBarBottom} />
              </span>
            </button>
          </nav>
        </div>
      </header>

      <dialog
        id="site-menu-dialog"
        ref={dialogRef}
        aria-label="Site navigation"
        className={styles.menuDialog}
        data-dialog-theme={isDarkRoute ? "dark" : "light"}
        onClose={handleDialogClose}
        onClick={handleDialogClick}
      >
        <div ref={scrollerRef} className={styles.drawerScroller}>
          <nav
            ref={sheetRef}
            className={styles.drawerSheet}
            aria-label="Site navigation"
          >
            <div className={styles.drawerTop}>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeMenu}
                aria-label="Close navigation menu"
                autoFocus
              >
                <span className={styles.closeBtnLabel}>Close</span>
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <ul className={styles.drawerList}>
              {NAV_LINKS.map((item) => {
                const isExternal =
                  item.href.startsWith("http") ||
                  item.href.startsWith("mailto:");
                const isActive =
                  item.href === pathname ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href} className={styles.drawerItem}>
                    {isExternal ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={styles.drawerLink}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`${styles.drawerLink} ${
                          isActive ? styles.activeLink : ""
                        }`.trim()}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className={styles.drawerFooter}>
              <a
                href="mailto:contact@yuhangang.com"
                className={styles.socialLink}
                onClick={closeMenu}
              >
                Email
              </a>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={closeMenu}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
