"use client";

import React from "react";
import Link from "next/link";
import styles from "./footer.module.scss";
import { SocialLink } from "./footer.config";

interface SocialLinkItemProps {
  link: SocialLink;
  location: "Header" | "Footer";
}

export default function SocialLinkItem({
  link,
  location,
}: SocialLinkItemProps) {
  const handleLinkClick = () => {
    // Client-side tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "link_click", {
        event_category: "Social Link",
        event_action: location,
        event_label: link.url,
        value: 1,
      });
    }
  };

  return (
    <Link
      key={link.name}
      href={link.url}
      target="_blank"
      aria-label={link.name}
      rel="noopener noreferrer"
      className={styles.socialLink}
      onClick={handleLinkClick}
    >
      <div className={styles.socialIconWrapper}>
        <div className={styles.iconCircle} style={{ fontSize: link.iconSize }}>
          {link.icon}
        </div>
        <span className={styles.socialText}>{link.name}</span>
      </div>
    </Link>
  );
}
