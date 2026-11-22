"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import styles from "./Navigation.module.scss";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { NAV_LINKS } from "@/config/navigation";
import { SOCIAL_LINKS } from "@/config/social";

const HOME_SECTION_LABELS: Record<string, string> = {
  photography: "Photography",
};

const HIDDEN_ROUTES = new Set(["/pantai-timor", "/terengganu"]);

const INLINE_NAV_LINKS = NAV_LINKS.filter((item) => item.href !== "/");

let supportsDisplayTransition: boolean | undefined;

function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  void getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(window.CSS?.supports?.("overlay", "auto")) &&
    canTransitionDisplay()
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [overDarkSurface, setOverDarkSurface] = useState(false);
  const [overHeroCover, setOverHeroCover] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [homeSectionLabel, setHomeSectionLabel] = useState<string | null>(null);

  const isHidden = HIDDEN_ROUTES.has(pathname);
  const isGallery = pathname.startsWith("/gallery");
  const isHome = pathname === "/";

  const navTheme: "light" | "dark" = isGallery
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
        const threshold = Math.max(coverEl.offsetHeight * 0.65, 240);
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

  const closeMenu = useCallback(async () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    if (!supportsTopLayerExit()) {
      if (dialog.hasAttribute("data-closing")) return;
      dialog.setAttribute("data-closing", "");
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      }
      if (!dialog.hasAttribute("data-closing")) return;
      dialog.removeAttribute("data-closing");
    }

    if (dialog.open) {
      dialog.close();
    }
  }, []);

  // Route native cancel (Escape / light dismiss) through closeMenu for exit animation,
  // and provide a progressive light-dismiss fallback for browsers missing closedby="any".
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      if (!supportsTopLayerExit()) {
        event.preventDefault();
        void closeMenu();
      }
    };
    dialog.addEventListener("cancel", onCancel);

    if ("closedBy" in HTMLDialogElement.prototype) {
      return () => {
        dialog.removeEventListener("cancel", onCancel);
      };
    }

    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        void closeMenu();
      }
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", onPointerDown);
    dialog.addEventListener("pointerup", onPointerUp);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("pointerdown", onPointerDown);
      dialog.removeEventListener("pointerup", onPointerUp);
    };
  }, [isHidden, closeMenu]);

  const openMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.removeAttribute("data-closing");
    dialog.showModal();
    setMenuOpen(true);
    lenis?.stop();
  }, [lenis]);

  const handleDialogClose = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.returnValue = "";
      dialogRef.current.removeAttribute("data-closing");
    }
    setMenuOpen(false);
    lenis?.start();
  }, [lenis]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      void closeMenu();

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
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="site-menu-title"
        className={styles.menuDialog}
        data-dialog-theme={isGallery ? "dark" : "light"}
        onClose={handleDialogClose}
      >
        <div className={styles.dialogHeader}>
          <div className={styles.dialogHeadingGroup}>
            <span className={styles.dialogKicker}>Index</span>
            <h2 id="site-menu-title" className={styles.dialogTitle}>
              Navigation
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => void closeMenu()}
            aria-label="Close navigation menu"
            autoFocus
          >
            <X size={17} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.dialogNav} aria-label="Site index">
          <ul className={styles.dialogList}>
            {NAV_LINKS.map((item, idx) => {
              const isExternal =
                item.href.startsWith("http") || item.href.startsWith("mailto:");
              const isActive =
                item.href === pathname ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              const indexNumber = String(idx + 1).padStart(2, "0");

              const rowContent = (
                <>
                  <span className={styles.rowLead}>
                    <span className={styles.rowIndex} aria-hidden="true">
                      {indexNumber}
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowLabel}>{item.label}</span>
                      {item.meta && (
                        <span className={styles.rowMeta}>{item.meta}</span>
                      )}
                    </span>
                  </span>
                  <span className={styles.rowIcon} aria-hidden="true">
                    {isExternal ? (
                      <ArrowUpRight size={15} strokeWidth={1.6} />
                    ) : (
                      <ArrowRight size={15} strokeWidth={1.6} />
                    )}
                  </span>
                </>
              );

              return (
                <li key={item.href} className={styles.dialogItem}>
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
                      className={styles.dialogRow}
                      onClick={() => void closeMenu()}
                    >
                      {rowContent}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`${styles.dialogRow} ${
                        isActive ? styles.activeRow : ""
                      }`.trim()}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {rowContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.dialogFooter}>
          <span className={styles.dialogCaption}>Connect</span>
          <div className={styles.socialLinks}>
            <a
              href="mailto:contact@yuhangang.com"
              className={styles.socialLink}
              onClick={() => void closeMenu()}
            >
              <span>Email</span>
              <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
            </a>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                onClick={() => void closeMenu()}
              >
                <span>{social.platform}</span>
                <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
