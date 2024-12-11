"use client";
import React from "react";
import styles from "./footer.module.scss";
import { SocialLink, socialLinks } from "./footer.config";
import Link from "next/link";

const Footer: React.FC = () => {
  const handleLinkClick = (props: {
    link: SocialLink;
    location: "Header" | "Footer";
  }) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "link_click", {
        event_category: "Social Link",
        event_action: location,
        event_label: props.link.url,
        value: 1,
      });
    }
  };

  return (
    <footer className={styles.footerContainer}>
      <h2 className={styles.footerTitle}>Work in Progress ...</h2>

      <hr className={styles.divider} />

      <div className={styles.socialLinks}>
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            aria-label={link.name}
            rel="noopener noreferrer"
            className={styles.socialLink}
            onClick={() => handleLinkClick({ link: link, location: "Footer" })}
          >
            <div className={styles.socialIconWrapper}>
              <div
                className={styles.iconCircle}
                style={{ fontSize: link.iconSize }}
              >
                {link.icon}
              </div>
              <span className={styles.socialText}>{link.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <p className={styles.footerText}>
        © {new Date().getFullYear()} Yu Hang Ang. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
