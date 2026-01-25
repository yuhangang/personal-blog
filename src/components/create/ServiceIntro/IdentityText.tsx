"use client";

import { useEffect, useState } from "react";
import styles from "./ServiceIntro.module.scss";
import { IDENTITY_CONFIG } from "../SloganScroll/sloganConfig";

interface Props {
  mode?: "hero" | "label";
}

export default function IdentityText({ mode = "hero" }: Props) {
  const alternateTitles = IDENTITY_CONFIG.alternateTitles || [];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % alternateTitles.length);
    }, 150);
    return () => clearInterval(interval);
  }, [alternateTitles.length]);

  const currentTitleObj = alternateTitles[titleIndex];

  // Common dynamic styles
  // For Label mode (Create page), we want to enforce a stable line-height
  // to preventing vertical shifting.
  const isLabelMode = mode === "label";

  const dynamicStyle = {
    color: currentTitleObj.color,
    fontFamily: currentTitleObj.fontFamily,
    // HERO mode uses config line-height. LABEL mode uses standardized CSS line-height.
    lineHeight: isLabelMode ? undefined : currentTitleObj.lineHeight || "1.0",
    fontWeight: currentTitleObj.lang === "jv" ? 700 : 600,
    direction: currentTitleObj.lang === "jv" ? "rtl" : "ltr",

    "--lang-scale":
      currentTitleObj.lang === "ta"
        ? 0.85
        : currentTitleObj.lang === "jv"
          ? 0.9
          : 1.0,
  } as React.CSSProperties; // Explicit cast to help TS

  if (mode === "label") {
    // --- CREATE PAGE STYLE (Small Header) ---
    return (
      <div className={styles.identityHeader}>
        {/* Small Static Top Title */}
        <h2 className={styles.labelStatic}>YOUR</h2>

        {/* Small Dynamic Text */}
        <h2 className={styles.labelDynamic} style={dynamicStyle}>
          {currentTitleObj.text}
        </h2>
      </div>
    );
  }

  // --- HOME PAGE STYLE (Large Hero Grid) ---
  return (
    <div className={styles.identityGrid}>
      {/* Static "Your" */}
      <h2 className={styles.heroStatic}>Your</h2>

      {/* Large Dynamic "Identity" */}
      <h2 className={styles.heroDynamic} style={dynamicStyle}>
        {currentTitleObj.text}
      </h2>
    </div>
  );
}
