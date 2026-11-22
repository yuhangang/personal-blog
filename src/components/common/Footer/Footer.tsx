"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.scss";
import { FOOTER_EXPLORE_LINKS } from "@/config/navigation";
import { SOCIAL_LINKS } from "@/config/social";

const HIDDEN_ROUTES = new Set([
  "/terengganu",
  "/pantai-timor",
]);

export default function Footer() {
  const pathname = usePathname();

  if (HIDDEN_ROUTES.has(pathname)) return null;

  const isGallery = pathname.startsWith("/gallery");

  return (
    <footer
      id="site-footer"
      className={styles.footer}
      data-footer-theme={isGallery ? "dark" : "light"}
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.identityCol}>
            <p className={styles.tagline}>
              Software engineer based in Kuala Lumpur, Malaysia.
            </p>
          </div>

          <div className={styles.linkCol}>
            <h3 className={styles.colHeading}>Pages</h3>
            <ul className={styles.linkList}>
              {FOOTER_EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h3 className={styles.colHeading}>Connect</h3>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="mailto:contact@yuhangang.com"
                  className={styles.link}
                >
                  <span>Email</span>
                  <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
                </a>
              </li>
              {SOCIAL_LINKS.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span>{social.platform}</span>
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.colophon}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Yu Hang Ang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
