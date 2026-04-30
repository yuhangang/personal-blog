"use client";

import { useRef } from "react";
// [Removed unused useScroll]
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IdentityText from "./IdentityText";
import FilmNoiseOverlay from "./FilmNoiseOverlay";
import styles from "./ServiceIntro.module.scss";
import { IDENTITY_CONFIG } from "../SloganScroll/sloganConfig";

interface Props {
  ctaText?: string;
  ctaLink?: string;
  variant?: "scroll" | "fullscreen";
  description?: string;
  title?: string;
  image?: string;
  showIdentity?: boolean;
}

export default function ServiceIntro({
  ctaText = "See Selected Works",
  ctaLink = "#projects",
  variant = "scroll",
  description = IDENTITY_CONFIG.desc,
  title,
  image = "/images/service-intro.webp",
  showIdentity = true,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null!);
  const router = useRouter();

  const handleSectionClick = () => {
    if (variant === "fullscreen" && ctaLink) {
      router.push(ctaLink);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={
        variant === "fullscreen" ? styles.sectionFullscreen : styles.section
      }
    >
      <div className={styles.stickyContent}>
        {title && <h2 className={styles.header}>{title}</h2>}
        <div
          className={styles.visualContainer}
          onClick={handleSectionClick}
          style={variant === "fullscreen" ? { cursor: "pointer" } : undefined}
        >
          <div className={styles.frame}>
            <Image
              src={image}
              alt={title || "Service Intro Background"}
              fill
              className={styles.bgImage}
              priority
            />
            <FilmNoiseOverlay />

            <div
              className={styles.textOverlay}
              style={{ flexDirection: "column" }}
            >
              {showIdentity && (
                <IdentityText
                  mode={variant === "fullscreen" ? "hero" : "label"}
                />
              )}
              {!showIdentity && title && (
                <h3 className={styles.featuredTitle}>{title}</h3>
              )}
              {description && (
                <p
                  className={
                    variant === "fullscreen"
                      ? styles.heroDescription
                      : styles.description
                  }
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className={styles.buttonPosition}>
            <Link href={ctaLink} className={styles.ctaButton}>
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
