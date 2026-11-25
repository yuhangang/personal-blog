"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import styles from "./CinematicCover.module.scss";

export interface CinematicCoverSource {
  src: string;
  type?: string;
  /** Media query for art-directed sources, e.g. a portrait crop on phones. */
  media?: string;
}

interface CinematicCoverProps {
  id?: string;
  /**
   * "cover" opens a page: h1 headline, eager poster, letterbox parts on load.
   * "section" sits mid-page: h2 headline, letterbox parts as it scrolls in.
   */
  variant?: "cover" | "section";
  sources: CinematicCoverSource[];
  /** First frame of the loop, shown until playback starts. */
  poster: string;
  headline: ReactNode;
  kicker?: ReactNode;
  subtitle?: ReactNode;
  credit?: string;
  /** "start" anchors text bottom-left; "center" sets it in the middle. */
  align?: "start" | "center";
  /** "display" sets a short title (e.g. "Gallery") much larger. */
  headlineSize?: "default" | "display";
  /** CSS color for the headline, ideally a token, e.g. "var(--retro-yellow)". */
  headlineColor?: string;
  /** Internal link under the subtitle, e.g. from a teaser to its page. */
  action?: { label: string; href: string };
}

/** "auto" follows motion/data preferences; the others are explicit user choices. */
type PlaybackIntent = "auto" | "play" | "pause";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getAutoplayAllowed() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return !connection?.saveData;
}

export default function CinematicCover({
  id,
  variant = "section",
  sources,
  poster,
  headline,
  kicker,
  subtitle,
  credit,
  align = "start",
  headlineSize = "default",
  headlineColor,
  action,
}: CinematicCoverProps) {
  const headingId = useId();
  const isCover = variant === "cover";
  const Heading = isCover ? "h1" : "h2";
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [intent, setIntent] = useState<PlaybackIntent>("auto");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Server render assumes no autoplay, so nothing plays before hydration.
  const autoplayAllowed = useSyncExternalStore(
    subscribeReducedMotion,
    getAutoplayAllowed,
    () => false
  );

  const shouldPlay =
    inView && (intent === "play" || (intent === "auto" && autoplayAllowed));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // preload="none" keeps the file off the network until the first play().
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.muted = true;
      // Autoplay can still be refused (e.g. iOS Low Power Mode); the button
      // then reads "Play" because no `playing` event arrives.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      setIntent("pause");
      video.pause();
    } else {
      setIntent("play");
      video.muted = true;
      video.play().catch(() => {});
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={[
        styles.section,
        isCover ? styles.cover : styles.scrollReveal,
        align === "center" ? styles.alignCenter : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        headlineColor
          ? ({ "--cinematic-headline": headlineColor } as CSSProperties)
          : undefined
      }
      aria-labelledby={headingId}
      // Navigation switches to its dark chrome over [data-theme="dark"].
      data-theme="dark"
      // Lets Navigation stay transparent over the cover, as with PageCover.
      data-nav-cover={isCover ? "" : undefined}
    >
      <div className={styles.frame}>
        <div className={styles.media}>
          <Image
            src={poster}
            alt=""
            fill
            // On portrait phones the 16:9 poster fills a 3:4 frame by height,
            // so it renders at roughly 240vw wide.
            sizes="(max-width: 768px) and (orientation: portrait) 240vw, 100vw"
            loading={isCover ? "eager" : undefined}
            fetchPriority={isCover ? "high" : undefined}
            className={styles.poster}
          />
          <video
            ref={videoRef}
            className={`${styles.video} ${hasStarted ? styles.videoVisible : ""}`}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => {
              setIsPlaying(true);
              setHasStarted(true);
            }}
            onPause={() => setIsPlaying(false)}
          >
            {sources.map((source) => (
              <source
                key={source.src}
                src={source.src}
                type={source.type ?? "video/mp4"}
                media={source.media}
              />
            ))}
          </video>
          {/* Scrims and bars belong to the picture, so they follow it when the
              phone layout stacks the text above a 3:4 frame. */}
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.scrimTop} aria-hidden="true" />
          <div className={styles.scrimBottom} aria-hidden="true" />
          <div className={styles.letterboxTop} aria-hidden="true" />
          <div className={styles.letterboxBottom} aria-hidden="true" />
        </div>

        <div className={styles.overlay}>
          <div className={styles.header}>
            {kicker && <p className={styles.kicker}>{kicker}</p>}
            <Heading
              id={headingId}
              className={`${styles.headline} ${
                headlineSize === "display" ? styles.headlineDisplay : ""
              }`}
            >
              {headline}
            </Heading>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {action && (
              <Link href={action.href} className={styles.action}>
                <span className={styles.actionLabel}>{action.label}</span>
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            )}
          </div>

          <div className={styles.bottomRow}>
            {credit && <span className={styles.credit}>{credit}</span>}
            <button
              type="button"
              className={styles.playback}
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause size={14} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Play size={14} strokeWidth={1.75} aria-hidden="true" />
              )}
              <span className={styles.playbackLabel}>
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
