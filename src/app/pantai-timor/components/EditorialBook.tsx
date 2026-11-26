"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useLenis } from "@/components/common/SmoothScroll/SmoothScroll";
import { ptTrack } from "@/utils/ga-events";
import { PANTAI_TIMOR_COPY } from "../config";
import { STORY_CHAPTERS, STORY_PLATES, type StoryChapterId, type StoryPlate } from "../story";
import styles from "../pantai-timor.module.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const CDN = "https://cdn.yuhangang.com/pantai-timor/";

interface EditorialBookProps {
  onOpenPlate: (index: number) => void;
  isLightboxOpen: boolean;
  heroProgressMV: MotionValue<number>;
  spacerRef: RefObject<HTMLDivElement | null>;
  onVideoReady: () => void;
}

type RailKey =
  | "cover"
  | "almanac"
  | "prologue"
  | "bachok"
  | "p0"
  | "p1"
  | "p2"
  | "p3"
  | "village"
  | "memory"
  | "besut-setiu"
  | "besut-road"
  | "p4"
  | "p5"
  | "kuala-terengganu"
  | "p6"
  | "p7"
  | "p8"
  | "p9"
  | "dungun"
  | "p10"
  | "p11"
  | "p12"
  | "epilogue";

interface PanelMeasure {
  left: number;
  width: number;
}

interface HorizontalTimeline {
  maxTranslate: number;
  viewportWidth: number;
  totalScrollPx: number;
  xInput: number[];
  xOutput: number[];
  heroRange: [number, number];
  almanacRange: [number, number];
  pzRange: [number, number];
  memoryRange: [number, number];
  folioRevealRange: [number, number];
  panels: Record<string, PanelMeasure>;
}

const DEFAULT_TIMELINE: HorizontalTimeline = {
  maxTranslate: 14000,
  viewportWidth: 1440,
  totalScrollPx: 18000,
  xInput: [0, 0.08, 0.14, 0.24, 0.34, 0.46, 0.62, 0.7, 1],
  xOutput: [0, 0, -1440, -1440, -3200, -3200, -9000, -9000, -14000],
  heroRange: [0, 0.08],
  almanacRange: [0.14, 0.24],
  pzRange: [0.34, 0.46],
  memoryRange: [0.62, 0.7],
  folioRevealRange: [0.08, 0.14],
  panels: {},
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const plateByFile = (file: string): StoryPlate => {
  const plate = STORY_PLATES.find((p) => p.src === `${CDN}${file}`);
  if (!plate) throw new Error(`EditorialBook: missing plate ${file}`);
  return plate;
};

/**
 * Builds a piecewise scroll timeline where horizontal translation (`x`) pauses
 * on flat sticky-dwell plateaus for Hero, CoastalAlmanac, ParallaxZoom, and Memory
 * — faithfully preserving the original vertical sticky parallax sessions inside
 * a single unified horizontal rail.
 */
function buildHorizontalTimeline(
  panels: Record<string, PanelMeasure>,
  maxTranslate: number,
  viewportWidth: number,
  viewportHeight: number
): HorizontalTimeline {
  const safeMax = Math.max(1, maxTranslate);
  const slideScale = 0.85;

  // Ordered sticky dwell anchors along the horizontal rail
  const stops: Array<{ id: "hero" | "almanac" | "pz" | "memory"; x: number; dwellPx: number }> = [
    { id: "hero", x: 0, dwellPx: Math.round(viewportHeight * 1.15) },
  ];

  const alm = panels["almanac"];
  if (alm) {
    stops.push({
      id: "almanac",
      x: Math.min(safeMax, Math.max(0, alm.left)),
      dwellPx: Math.round(viewportHeight * 1.85),
    });
  }

  const pz = panels["bachok"];
  if (pz) {
    stops.push({
      id: "pz",
      x: Math.min(safeMax, Math.max(0, pz.left)),
      dwellPx: Math.round(viewportHeight * 2.5),
    });
  }

  const mem = panels["memory"];
  if (mem) {
    stops.push({
      id: "memory",
      x: Math.min(safeMax, Math.max(0, mem.left)),
      dwellPx: Math.round(viewportHeight * 1.45),
    });
  }

  // Build cumulative scroll-distance keyframes (sPx, xPos)
  const rawPoints: Array<{ s: number; x: number }> = [{ s: 0, x: 0 }];
  const ranges: Record<string, [number, number]> = {};
  let cursorS = 0;
  let cursorX = 0;

  for (const stop of stops) {
    const slideDist = Math.max(0, stop.x - cursorX);
    if (slideDist > 1) {
      cursorS += slideDist * slideScale;
      cursorX = stop.x;
      rawPoints.push({ s: cursorS, x: cursorX });
    }
    const dwellStartS = cursorS;
    cursorS += stop.dwellPx;
    rawPoints.push({ s: cursorS, x: cursorX });
    ranges[stop.id] = [dwellStartS, cursorS];
  }

  const remainingSlide = Math.max(0, safeMax - cursorX);
  if (remainingSlide > 1) {
    cursorS += remainingSlide * slideScale;
    cursorX = safeMax;
    rawPoints.push({ s: cursorS, x: cursorX });
  }

  const totalScrollPx = Math.max(1, cursorS);
  const xInput: number[] = [];
  const xOutput: number[] = [];

  for (let i = 0; i < rawPoints.length; i++) {
    let p = rawPoints[i].s / totalScrollPx;
    if (i > 0 && p <= xInput[i - 1]) {
      p = Math.min(1, xInput[i - 1] + 1e-5);
    }
    xInput.push(p);
    xOutput.push(-rawPoints[i].x);
  }
  xInput[0] = 0;
  xInput[xInput.length - 1] = 1;

  const normRange = (id: string, fallback: [number, number]): [number, number] => {
    const r = ranges[id];
    if (!r) return fallback;
    const a = clamp01(r[0] / totalScrollPx);
    const b = clamp01(r[1] / totalScrollPx);
    return b > a + 1e-4 ? [a, b] : fallback;
  };

  const heroRange = normRange("hero", [0, 0.08]);
  const almanacRange = normRange("almanac", [0.14, 0.24]);
  const pzRange = normRange("pz", [0.34, 0.46]);
  const memoryRange = normRange("memory", [0.62, 0.7]);
  const folioRevealRange: [number, number] = [
    heroRange[1],
    Math.min(1, Math.max(heroRange[1] + 0.01, almanacRange[0])),
  ];

  return {
    maxTranslate: safeMax,
    viewportWidth,
    totalScrollPx,
    xInput,
    xOutput,
    heroRange,
    almanacRange,
    pzRange,
    memoryRange,
    folioRevealRange,
    panels,
  };
}

/** Evaluate horizontal offset `x >= 0` at a given scroll progress `p` in `[0..1]`. */
function evaluateXAtProgress(timeline: HorizontalTimeline, p: number): number {
  const { xInput, xOutput } = timeline;
  const clamped = clamp01(p);
  for (let i = 0; i < xInput.length - 1; i++) {
    const p0 = xInput[i];
    const p1 = xInput[i + 1];
    if (clamped >= p0 && clamped <= p1) {
      const span = p1 - p0;
      const t = span > 0 ? (clamped - p0) / span : 0;
      return -(xOutput[i] + (xOutput[i + 1] - xOutput[i]) * t);
    }
  }
  return -xOutput[xOutput.length - 1];
}

/** Invert the piecewise curve: find scroll progress `p` that lands at horizontal offset `targetLeft`. */
function progressForX(timeline: HorizontalTimeline, targetLeft: number): number {
  const { xInput, xOutput, maxTranslate } = timeline;
  const target = Math.min(maxTranslate, Math.max(0, targetLeft));
  if (target <= 0.5) return 0;

  for (let i = 0; i < xInput.length - 1; i++) {
    const x0 = -xOutput[i];
    const x1 = -xOutput[i + 1];
    if (target >= x0 - 0.5 && target <= x1 + 0.5) {
      const dx = x1 - x0;
      if (dx <= 0.5) {
        // Land at the start of a sticky dwell plateau
        return xInput[i];
      }
      const t = clamp01((target - x0) / dx);
      return xInput[i] + (xInput[i + 1] - xInput[i]) * t;
    }
  }
  return 1;
}

/** Scroll progress window `[enter, exit]` when a normal sliding panel passes through the viewport. */
function panelVisibilityRange(
  timeline: HorizontalTimeline,
  key: RailKey,
  fallback: [number, number]
): [number, number] {
  const m = timeline.panels[key];
  if (!m) return fallback;
  const start = progressForX(timeline, Math.max(0, m.left - timeline.viewportWidth));
  const end = progressForX(timeline, Math.min(timeline.maxTranslate, m.left + m.width));
  return end > start + 1e-4 ? [start, end] : fallback;
}

/** Concentric water ripples from the original CoastalAlmanac prologue. */
const AlmanacRipples = () => (
  <div className={styles["ripple-container"]} aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.5], opacity: [0, 0.5, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: i * 3.3,
          ease: "easeInOut",
        }}
        className={styles["ripple-circle"]}
      />
    ))}
  </div>
);

interface RailPlateProps {
  panelKey: RailKey;
  plate: StoryPlate;
  timeline: HorizontalTimeline;
  fallbackRange: [number, number];
  scrollYProgress: MotionValue<number>;
  parallaxEnabled: boolean;
  sizes: string;
  priority?: boolean;
  onOpen: (index: number) => void;
  onFocusPanel: (key: RailKey) => void;
}

/** True-aspect-ratio clickable plate on the horizontal rail. */
const RailPlate = ({
  panelKey,
  plate,
  timeline,
  fallbackRange,
  scrollYProgress,
  parallaxEnabled,
  sizes,
  priority = false,
  onOpen,
  onFocusPanel,
}: RailPlateProps) => {
  const [start, end] = panelVisibilityRange(timeline, panelKey, fallbackRange);
  const x = useTransform(scrollYProgress, [start, end], ["-1.6%", "1.6%"]);

  return (
    <figure
      data-rail-panel={panelKey}
      className={`${styles["rail-panel"]} ${styles["rail-plate-panel"]}`}
      style={{ "--plate-ratio": plate.ratio } as CSSProperties}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        className={styles["book-plate-btn"]}
        onClick={() => onOpen(plate.index)}
        onFocus={() => onFocusPanel(panelKey)}
      >
        <span className={styles["book-plate-media"]}>
          <motion.span
            className={styles["book-parallax-inner"]}
            style={parallaxEnabled ? { x, scale: 1.035 } : undefined}
          >
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              priority={priority}
              sizes={sizes}
              className={styles["book-plate-img"]}
            />
          </motion.span>
          <span className={styles["book-plate-scrim"]} aria-hidden="true" />
        </span>
      </button>
      <figcaption className={styles["book-caption"]}>
        <span className={styles["book-caption-code"]}>{plate.frameCode}</span>
        <span>{plate.caption}</span>
      </figcaption>
    </figure>
  );
};

interface ChapterDividerProps {
  id: StoryChapterId;
  panelKey: RailKey;
  numeral: string;
  title: string;
  note: string;
  insetSrc?: string;
  insetAlt?: string;
  insetCaption?: string;
  timeline: HorizontalTimeline;
  fallbackRange: [number, number];
  scrollYProgress: MotionValue<number>;
  parallaxEnabled: boolean;
}

const ChapterDivider = ({
  id,
  panelKey,
  numeral,
  title,
  note,
  insetSrc,
  insetAlt,
  insetCaption,
  timeline,
  fallbackRange,
  scrollYProgress,
  parallaxEnabled,
}: ChapterDividerProps) => {
  const [start, end] = panelVisibilityRange(timeline, panelKey, fallbackRange);
  const titleX = useTransform(scrollYProgress, [start, end], [24, -24]);
  const insetX = useTransform(scrollYProgress, [start, end], ["2%", "-2%"]);

  return (
    <section
      id={id}
      data-rail-panel={panelKey}
      aria-label={`Chapter ${numeral}: ${title}`}
      className={`${styles["rail-panel"]} ${styles["rail-chapter-panel"]}`}
    >
      <motion.header
        className={styles["book-chapter-header"]}
        style={parallaxEnabled ? { x: titleX } : undefined}
      >
        <span className={`${cormorant.className} ${styles["book-chapter-numeral"]}`}>
          {numeral}
        </span>
        <h2 className={`${cormorant.className} ${styles["book-chapter-title"]}`}>{title}</h2>
        <p className={styles["book-chapter-note"]}>{note}</p>
      </motion.header>

      {insetSrc && (
        <figure className={styles["rail-chapter-inset"]}>
          <div className={styles["book-static-media"]}>
            <motion.div
              className={styles["book-parallax-inner"]}
              style={parallaxEnabled ? { x: insetX, scale: 1.045 } : undefined}
            >
              <Image
                src={insetSrc}
                alt={insetAlt ?? title}
                fill
                sizes="(min-width: 768px) 34vw, 92vw"
                className={styles["book-plate-img"]}
              />
            </motion.div>
            {insetCaption && <span className={styles["book-plate-scrim"]} aria-hidden="true" />}
          </div>
          {insetCaption && (
            <figcaption className={styles["book-caption"]}>
              <span>{insetCaption}</span>
            </figcaption>
          )}
        </figure>
      )}
    </section>
  );
};

const CHAPTER_RAIL_KEYS: { id: StoryChapterId; key: RailKey }[] = [
  { id: "bachok", key: "bachok" },
  { id: "besut-setiu", key: "besut-setiu" },
  { id: "kuala-terengganu", key: "kuala-terengganu" },
  { id: "dungun", key: "dungun" },
];

const PLATE_KEYS: RailKey[] = [
  "p0",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
  "p11",
  "p12",
];

/**
 * Single unified horizontal gallery rail starting with the Hero cover inline
 * alongside CoastalAlmanac, ParallaxZoom, the four chapters (every photograph
 * at its true original aspect ratio), and the Epilogue.
 *
 * On desktop, a piecewise scroll curve pins horizontal translation on Hero,
 * CoastalAlmanac, ParallaxZoom, and Memory so their original sticky parallax
 * choreography plays in place before gliding smoothly to the next panel.
 */
export const EditorialBook = ({
  onOpenPlate,
  isLightboxOpen,
  heroProgressMV,
  spacerRef,
  onVideoReady,
}: EditorialBookProps) => {
  const { lenis } = useLenis();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isDesktopHorizontal, setIsDesktopHorizontal] = useState(false);
  const [timeline, setTimeline] = useState<HorizontalTimeline>(DEFAULT_TIMELINE);
  const [sectionHeight, setSectionHeight] = useState<number | undefined>(undefined);
  const [activeChapter, setActiveChapter] = useState<StoryChapterId | "prologue">("prologue");
  const [activePlateNumber, setActivePlateNumber] = useState(1);
  const [pastCover, setPastCover] = useState(false);

  // Fallback readiness in case cover video takes too long or is already cached
  useEffect(() => {
    const timer = window.setTimeout(() => onVideoReady(), 5000);
    if (videoRef.current && videoRef.current.readyState >= 3) {
      onVideoReady();
      window.clearTimeout(timer);
    }
    return () => window.clearTimeout(timer);
  }, [onVideoReady]);

  const chapters = useMemo(
    () => ({
      bachok: STORY_CHAPTERS.find((c) => c.id === "bachok")!,
      besut: STORY_CHAPTERS.find((c) => c.id === "besut-setiu")!,
      kt: STORY_CHAPTERS.find((c) => c.id === "kuala-terengganu")!,
      dungun: STORY_CHAPTERS.find((c) => c.id === "dungun")!,
    }),
    []
  );

  const plates = useMemo(
    () => ({
      p0: plateByFile("DSC00756_2.JPG"),
      p1: plateByFile("DSC00854.JPG"),
      p2: plateByFile("DSC00649.JPG"),
      p3: plateByFile("DSC00710.JPG"),
      p4: plateByFile("DSC00032.jpg"),
      p5: plateByFile("DSC08014.jpg"),
      p6: plateByFile("DSC00052.jpg"),
      p7: plateByFile("DSC01109.jpg"),
      p8: plateByFile("DSC07705.jpg"),
      p9: plateByFile("DSC08133_1.jpg"),
      p10: plateByFile("DSC07670_1.jpg"),
      p11: plateByFile("DSC08235.jpg"),
      p12: plateByFile("DSC07665_1.jpg"),
    }),
    []
  );

  // Measure every panel and rebuild the piecewise sticky-dwell horizontal timeline
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const desktopMode = vw >= 768 && !reduceMotion;
      setIsDesktopHorizontal(desktopMode);

      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const viewportWidth = viewport.clientWidth || vw;
      const maxTranslate = Math.max(1, track.scrollWidth - viewportWidth);

      const panels: Record<string, PanelMeasure> = {};
      track.querySelectorAll<HTMLElement>("[data-rail-panel]").forEach((el) => {
        const key = el.dataset.railPanel;
        if (!key) return;
        panels[key] = { left: el.offsetLeft, width: el.offsetWidth };
      });

      const nextTimeline = buildHorizontalTimeline(panels, maxTranslate, viewportWidth, vh);
      setTimeline(nextTimeline);

      if (desktopMode) {
        setSectionHeight(Math.round(vh + nextTimeline.totalScrollPx));
      } else {
        setSectionHeight(undefined);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    const settleTimer = window.setTimeout(measure, 150);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(settleTimer);
    };
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Piecewise horizontal track position with flat sticky dwells on Hero, Almanac, ParallaxZoom, Memory
  const trackX = useTransform(scrollYProgress, timeline.xInput, timeline.xOutput);
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0.03, 1]);

  // ── SESSION 0: Cover (Hero) compositor-only horizontal parallax ──────────────
  // Uses `clip-path: inset(...)` instead of animating `width`/`height` across
  // mismatched CSS units so the video element never resizes or glitches aspect ratio.
  const heroClipY = useTransform(heroProgressMV, [0, 1], [18, 0]);
  const heroClipX = useTransform(heroProgressMV, [0, 1], [20, 0]);
  const heroClipRadius = useTransform(heroProgressMV, [0, 1], [40, 0]);
  const heroClipPath = useMotionTemplate`inset(${heroClipY}% ${heroClipX}% ${heroClipY}% ${heroClipX}% round ${heroClipRadius}px)`;

  // cover.mp4 has 100/1280 (~7.81%) baked-in black pillarbox bars on each side;
  // keeping scale >= 1.30 and horizontal pan within [-3.5%, +8%] guarantees the
  // pillarbox never enters the frame while gliding horizontally into CoastalAlmanac.
  const heroExitProgress = useTransform(scrollYProgress, timeline.folioRevealRange, [0, 1]);
  const heroVideoX = useTransform(
    [heroProgressMV, heroExitProgress],
    ([dwell, exit]: number[]) => `${-3.5 + dwell * 7 + exit * 4.5}%`
  );
  const heroVideoScale = useTransform(
    [heroProgressMV, heroExitProgress],
    ([dwell, exit]: number[]) => 1.3 + dwell * 0.14 + exit * 0.04
  );
  const heroImageOpacity = useTransform(heroExitProgress, [0, 1], [1, 0.62]);
  const heroScrollCueOpacity = useTransform(heroProgressMV, [0, 0.4], [1, 0]);
  const heroScrollCueX = useTransform(heroProgressMV, [0, 0.4], [0, -32]);

  // Bottom running folio bar slides cleanly into view once you leave the Hero cover
  const folioOpacity = useTransform(scrollYProgress, timeline.folioRevealRange, [0, 1]);
  const folioY = useTransform(scrollYProgress, timeline.folioRevealRange, [48, 0]);

  // ── SESSION 1: CoastalAlmanac sticky horizontal pan + cross-fade + ripples ──
  const [almStart, almEnd] = timeline.almanacRange;
  const almanacProgress = useTransform(scrollYProgress, [almStart, almEnd], [0, 1]);
  const almanacX = useTransform(almanacProgress, (p) => `calc(${p} * var(--almanac-x-travel))`);
  const almanacOpacity1 = useTransform(almanacProgress, [0, 0.45, 0.55], [1, 1, 0]);
  const almanacOpacity2 = useTransform(almanacProgress, [0, 0.45, 0.55, 1], [0, 0, 1, 1]);

  // ── SESSION 2: ParallaxZoom (Chapter I Bachok) sticky 1→3× zoom dissolve ───
  const [pzStart, pzEnd] = timeline.pzRange;
  const pzProgress = useTransform(scrollYProgress, [pzStart, pzEnd], [0, 1]);
  const pzFgScale = useTransform(pzProgress, [0, 0.54], [1, 3]);
  const pzFgOpacity = useTransform(pzProgress, [0.36, 0.54], [1, 0]);
  const pzBgScale = useTransform(pzProgress, [0.36, 0.82], [1.02, 1.2]);
  const pzBgOpacity = useTransform(pzProgress, [0.36, 0.54], [0, 1]);
  const pzTitleOpacity = useTransform(pzProgress, [0, 0.25, 0.65, 0.9], [1, 1, 0.7, 0.35]);

  // ── VillageRhythms (Bachok): counter-parallax 3:2 stack ────────────────────
  const [vilStart, vilEnd] = panelVisibilityRange(timeline, "village", [0.5, 0.62]);
  const villageTopX = useTransform(scrollYProgress, [vilStart, vilEnd], ["-3.5%", "3.5%"]);
  const villageBottomX = useTransform(scrollYProgress, [vilStart, vilEnd], ["3.5%", "-3.5%"]);

  // ── Memory (Leaving Bachok): sticky darkroom blur/brightness/saturate pull ─
  const [memStart, memEnd] = timeline.memoryRange;
  const memProgress = useTransform(scrollYProgress, [memStart, memEnd], [0, 1]);
  const memBlur = useTransform(memProgress, [0, 0.14, 0.28, 0.72, 0.86, 1], [8, 4, 0, 0, 4, 8]);
  const memBrightness = useTransform(
    memProgress,
    [0, 0.14, 0.28, 0.72, 0.86, 1],
    [0.12, 0.35, 1.18, 1.18, 0.35, 0.12]
  );
  const memSaturate = useTransform(
    memProgress,
    [0, 0.14, 0.28, 0.72, 0.86, 1],
    [0, 35, 145, 145, 35, 0]
  );
  const memoryFilter = useMotionTemplate`blur(${memBlur}px) brightness(${memBrightness}) saturate(${memSaturate}%)`;
  const memoryScale = useTransform(memProgress, [0, 0.28, 0.72, 1], [1.1, 1, 1, 1.1]);

  // ── Besut & Setiu Road Frame (DSC01024): subtle push-in pan ────────────────
  const [roadStart, roadEnd] = panelVisibilityRange(timeline, "besut-road", [0.68, 0.78]);
  const roadX = useTransform(scrollYProgress, [roadStart, roadEnd], ["-2.2%", "2.2%"]);
  const roadScale = useTransform(scrollYProgress, [roadStart, roadEnd], [1.07, 1.02]);

  // Update active chapter, plate counter, and cover visibility from horizontal x
  const updateActiveFromX = useCallback(
    (scrollX: number) => {
      const almanacLeft = timeline.panels["almanac"]?.left ?? timeline.viewportWidth * 0.6;
      setPastCover((prev) => {
        const next = scrollX > almanacLeft * 0.35;
        return prev === next ? prev : next;
      });

      const centerX = scrollX + timeline.viewportWidth * 0.42;
      let currentChap: StoryChapterId | "prologue" = "prologue";
      for (const ch of CHAPTER_RAIL_KEYS) {
        const panel = timeline.panels[ch.key];
        if (panel && centerX >= panel.left) {
          currentChap = ch.id;
        }
      }
      setActiveChapter((prev) => (prev === currentChap ? prev : currentChap));

      let closestPlate = 1;
      let minDist = Infinity;
      PLATE_KEYS.forEach((key, idx) => {
        const panel = timeline.panels[key];
        if (!panel) return;
        const dist = Math.abs(panel.left - scrollX);
        if (dist < minDist) {
          minDist = dist;
          closestPlate = idx + 1;
        }
      });
      setActivePlateNumber((prev) => (prev === closestPlate ? prev : closestPlate));
    },
    [timeline]
  );

  // Sync heroProgressMV + active nav state on desktop scroll
  useEffect(() => {
    if (!isDesktopHorizontal) return;
    const sync = (latest: number) => {
      const [hStart, hEnd] = timeline.heroRange;
      const hp = clamp01((latest - hStart) / Math.max(1e-4, hEnd - hStart));
      heroProgressMV.set(hp);
      updateActiveFromX(evaluateXAtProgress(timeline, latest));
    };
    sync(scrollYProgress.get());
    return scrollYProgress.on("change", sync);
  }, [heroProgressMV, isDesktopHorizontal, scrollYProgress, timeline, updateActiveFromX]);

  // Sync heroProgressMV + active nav state on mobile / reduced-motion native horizontal scroll
  useEffect(() => {
    if (isDesktopHorizontal) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleNativeScroll = () => {
      const vw = Math.max(1, viewport.clientWidth);
      heroProgressMV.set(clamp01(viewport.scrollLeft / (vw * 0.7)));
      updateActiveFromX(viewport.scrollLeft);
    };

    handleNativeScroll();
    viewport.addEventListener("scroll", handleNativeScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleNativeScroll);
  }, [heroProgressMV, isDesktopHorizontal, updateActiveFromX]);

  // Scroll to any panel by key (pixel-exact across sticky dwells and slides)
  const scrollToPanel = useCallback(
    (key: RailKey, instant = false) => {
      const panel = timeline.panels[key];
      const targetLeft = panel ? Math.min(timeline.maxTranslate, Math.max(0, panel.left)) : 0;

      if (!isDesktopHorizontal) {
        const viewport = viewportRef.current;
        if (!viewport) return;
        viewport.scrollTo({
          left: targetLeft,
          behavior: instant || reduceMotion ? "auto" : "smooth",
        });
        return;
      }

      const section = sectionRef.current;
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const targetProgress = key === "cover" ? 0 : progressForX(timeline, targetLeft);
      const targetY = top + scrollable * clamp01(targetProgress);

      if (lenis) {
        lenis.scrollTo(targetY, instant ? { immediate: true } : { duration: 1.0 });
      } else {
        window.scrollTo({ top: targetY, behavior: instant ? "auto" : "smooth" });
      }
    },
    [isDesktopHorizontal, lenis, reduceMotion, timeline]
  );

  const stepRail = useCallback(
    (direction: -1 | 1) => {
      const currentIdx = Math.max(0, activePlateNumber - 1);
      const nextIdx = Math.min(PLATE_KEYS.length - 1, Math.max(0, currentIdx + direction));
      scrollToPanel(PLATE_KEYS[nextIdx]);
    },
    [activePlateNumber, scrollToPanel]
  );

  // Map horizontal trackpad swipes onto vertical scroll when pinned on desktop
  useEffect(() => {
    if (!isDesktopHorizontal) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      if (isLightboxOpen) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || e.deltaX === 0) return;

      e.preventDefault();
      const nextY = window.scrollY + e.deltaX * 1.15;
      if (lenis) {
        lenis.scrollTo(nextY, { immediate: true });
      } else {
        window.scrollBy(0, e.deltaX * 1.15);
      }
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isDesktopHorizontal, isLightboxOpen, lenis]);

  // Arrow keys step plates horizontally when the lightbox is closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      e.preventDefault();
      stepRail(e.key === "ArrowRight" ? 1 : -1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, stepRail]);

  const backToCover = () => scrollToPanel("cover");

  // Subtle background blur overlay on Hero video expansion
  const heroBgDim = useMotionTemplate`rgba(16, 17, 15, ${useTransform(heroProgressMV, [0, 1], [0, 0.35])})`;

  return (
    <section
      ref={sectionRef}
      id="editorial-book"
      aria-label="Pantai Timor horizontal gallery"
      className={`${styles["book-section"]} ${
        isDesktopHorizontal ? styles["book-section-desktop"] : styles["book-section-native"]
      }`}
      style={sectionHeight ? { height: `${sectionHeight}px` } : undefined}
    >
      <div
        className={styles["book-viewport-shell"]}
        style={{ "--vp-w": `${timeline.viewportWidth}px` } as CSSProperties}
      >
        <div
          ref={viewportRef}
          className={`${styles["book-scroller"]} ${
            isDesktopHorizontal ? styles["book-scroller-sticky"] : styles["book-scroller-native"]
          }`}
        >
          <motion.div
            ref={trackRef}
            className={styles["rail-track"]}
            style={isDesktopHorizontal ? { x: trackX } : undefined}
          >
            {/* ── SESSION 0: Cover (Hero) inline on the same horizontal rail ── */}
            <section
              id="cover"
              data-rail-panel="cover"
              aria-label="Pantai Timor cover"
              className={`${styles["rail-panel"]} ${styles["rail-hero-panel"]}`}
            >
              <div
                style={{ paddingTop: "calc(140px + env(safe-area-inset-top, 0px))" }}
                className={styles["rail-hero-content"]}
              >
                <div className={styles["rail-hero-stage"]}>
                  <motion.div
                    style={
                      isDesktopHorizontal
                        ? {
                            clipPath: heroClipPath,
                            opacity: heroImageOpacity,
                          }
                        : undefined
                    }
                    className={styles["rail-hero-clip"]}
                  >
                    <motion.div
                      className={styles["rail-hero-video-parallax"]}
                      style={
                        isDesktopHorizontal
                          ? { x: heroVideoX, scale: heroVideoScale }
                          : { scale: 1.24 }
                      }
                    >
                      <video
                        ref={videoRef}
                        src="https://cdn.yuhangang.com/pantai-timor/cover.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onCanPlay={onVideoReady}
                        className={styles["hero-video"]}
                      />
                    </motion.div>
                    <motion.div
                      className={styles["rail-hero-dim"]}
                      style={{ backgroundColor: heroBgDim }}
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>

                <div className={styles["hero-title-wrapper"]}>
                  <div ref={spacerRef} className={styles["hero-spacer"]}>
                    <h1 className={`${cormorant.className} ${styles["hero-title"]}`}>
                      {PANTAI_TIMOR_COPY.hero.title}
                    </h1>
                  </div>
                </div>

                <motion.div
                  style={
                    isDesktopHorizontal
                      ? { opacity: heroScrollCueOpacity, x: heroScrollCueX }
                      : undefined
                  }
                  className={styles["rail-scroll-indicator"]}
                >
                  <span className={styles["scroll-text"]}>{PANTAI_TIMOR_COPY.hero.scroll}</span>
                  <div className={styles["rail-scroll-line"]}>
                    <div className={styles["rail-scroll-line-animated"]} />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── SESSION 1: Original Sticky CoastalAlmanac (Prologue) ──────── */}
            <section
              id="almanac"
              data-rail-panel="almanac"
              aria-label="Coastal Almanac prologue"
              className={`${styles["rail-panel"]} ${styles["rail-almanac-panel"]}`}
            >
              <div className={styles["rail-almanac-bg"]}>
                <Image
                  src={`${CDN}DSC07670_1.jpg`}
                  alt=""
                  fill
                  className={styles["almanac-background-image"]}
                  sizes="100vw"
                />
                <div className={styles["almanac-background-overlay"]} />
              </div>

              <div className={styles["rail-almanac-stage"]}>
                <div className={styles["rail-almanac-window"]}>
                  <motion.div
                    className={styles["rail-almanac-pan-layer"]}
                    style={
                      isDesktopHorizontal
                        ? { x: almanacX, opacity: almanacOpacity1 }
                        : undefined
                    }
                  >
                    <Image
                      src={`${CDN}DSC07763_1.jpg`}
                      alt="Fishing Boat"
                      fill
                      priority
                      className={styles["almanac-image"]}
                      sizes="(min-width: 768px) 70vh, 150vh"
                    />
                  </motion.div>

                  {isDesktopHorizontal && (
                    <motion.div
                      className={styles["rail-almanac-pan-layer"]}
                      style={{ x: almanacX, opacity: almanacOpacity2 }}
                    >
                      <Image
                        src={`${CDN}DSC00590.JPG`}
                        alt="Coastal Horizon"
                        fill
                        className={styles["almanac-image"]}
                        sizes="(min-width: 768px) 70vh, 150vh"
                      />
                    </motion.div>
                  )}

                  {!reduceMotion && <AlmanacRipples />}
                </div>
              </div>
            </section>

            {/* ── PROLOGUE: 1960s Magazine Contents Column ──────────────────── */}
            <section
              id="prologue"
              data-rail-panel="prologue"
              aria-label="Contents"
              className={`${styles["rail-panel"]} ${styles["rail-toc-panel"]}`}
            >
              <div className={styles["book-page-top"]}>
                <span className={styles["book-folio-num"]}>01</span>
                <span className={styles["book-running-place"]}>East Coast, Malaysia</span>
              </div>

              <div className={styles["book-toc-block"]}>
                <h2 className={`${cormorant.className} ${styles["book-toc-heading"]}`}>
                  North to South
                </h2>
                <ol className={styles["book-toc-list"]}>
                  {STORY_CHAPTERS.map((chapter) => (
                    <li key={chapter.id} className={styles["book-toc-item"]}>
                      <button
                        type="button"
                        className={styles["book-toc-btn"]}
                        onClick={() => scrollToPanel(chapter.id)}
                        onFocus={() => scrollToPanel("prologue")}
                      >
                        <span className={`${cormorant.className} ${styles["book-toc-numeral"]}`}>
                          {chapter.numeral}
                        </span>
                        <span className={styles["book-toc-name"]}>{chapter.title}</span>
                        <span className={styles["book-toc-meta"]}>
                          {chapter.kmFromPrevious === null
                            ? chapter.region
                            : `${chapter.kmFromPrevious} km`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <p className={styles["book-page-footnote"]}>
                Scroll or swipe across · {STORY_PLATES.length} plates
              </p>
            </section>

            {/* ── SESSION 2: Original Sticky ParallaxZoom (Chapter I Bachok) ── */}
            <section
              id="bachok"
              data-rail-panel="bachok"
              aria-label="Chapter I: Bachok"
              className={`${styles["rail-panel"]} ${styles["rail-pz-panel"]}`}
            >
              <div className={styles["book-pz-stage"]}>
                {/* Image 2: Background layer revealed as Image 1 zooms & fades */}
                <motion.div
                  className={styles["book-pz-layer"]}
                  style={
                    isDesktopHorizontal
                      ? { opacity: pzBgOpacity, scale: pzBgScale }
                      : { opacity: 1 }
                  }
                >
                  <Image
                    src={`${CDN}DSC00590.JPG`}
                    alt="Horizon at Pantai Irama, Bachok"
                    fill
                    priority
                    sizes="100vw"
                    className={styles["book-plate-img"]}
                  />
                </motion.div>

                {/* Image 1: Foreground layer — zooms 1→3× & dissolves while pinned */}
                {isDesktopHorizontal && (
                  <motion.div
                    className={`${styles["book-pz-layer"]} ${styles["book-pz-fg"]}`}
                    style={{ opacity: pzFgOpacity, scale: pzFgScale }}
                  >
                    <Image
                      src={`${CDN}DSC00465.JPG`}
                      alt="Arrival along the shore of Bachok"
                      fill
                      sizes="100vw"
                      className={styles["book-plate-img"]}
                    />
                  </motion.div>
                )}

                <div className={styles["book-pz-vignette"]} aria-hidden="true" />

                <motion.header
                  className={styles["book-pz-title-card"]}
                  style={isDesktopHorizontal ? { opacity: pzTitleOpacity } : undefined}
                >
                  <span className={`${cormorant.className} ${styles["book-chapter-numeral"]}`}>
                    {chapters.bachok.numeral}
                  </span>
                  <h2 className={`${cormorant.className} ${styles["book-pz-heading"]}`}>
                    {chapters.bachok.title}
                  </h2>
                  <p className={styles["book-pz-note"]}>{chapters.bachok.region}</p>
                </motion.header>
              </div>
            </section>

            {/* ── CHAPTER I PLATES (True 3:2 aspect ratios) ─────────────────── */}
            <RailPlate
              panelKey="p0"
              plate={plates.p0}
              timeline={timeline}
              fallbackRange={[0.42, 0.5]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p1"
              plate={plates.p1}
              timeline={timeline}
              fallbackRange={[0.46, 0.54]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p2"
              plate={plates.p2}
              timeline={timeline}
              fallbackRange={[0.5, 0.58]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p3"
              plate={plates.p3}
              timeline={timeline}
              fallbackRange={[0.54, 0.62]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />

            {/* ── CHAPTER I: VillageRhythms (Two stacked true-3:2 frames, counter-parallax) */}
            <div
              data-rail-panel="village"
              className={`${styles["rail-panel"]} ${styles["rail-stack-panel"]}`}
            >
              <figure className={styles["rail-stack-item"]}>
                <div className={styles["book-static-media"]}>
                  <motion.div
                    className={styles["book-parallax-inner"]}
                    style={isDesktopHorizontal ? { x: villageTopX, scale: 1.08 } : undefined}
                  >
                    <Image
                      src={`${CDN}DSC00645.JPG`}
                      alt="Village life in Bachok"
                      fill
                      sizes="(min-width: 768px) 75vh, 100vw"
                      className={styles["book-plate-img"]}
                    />
                  </motion.div>
                  <span className={styles["book-plate-scrim"]} aria-hidden="true" />
                </div>
                <figcaption className={styles["book-caption"]}>
                  <span>Pantai Irama, Bachok</span>
                </figcaption>
              </figure>

              <figure className={styles["rail-stack-item"]}>
                <div className={styles["book-static-media"]}>
                  <motion.div
                    className={styles["book-parallax-inner"]}
                    style={isDesktopHorizontal ? { x: villageBottomX, scale: 1.08 } : undefined}
                  >
                    <Image
                      src={`${CDN}DSC00788.JPG`}
                      alt="Coastal timber house in Bachok"
                      fill
                      sizes="(min-width: 768px) 75vh, 100vw"
                      className={styles["book-plate-img"]}
                    />
                  </motion.div>
                </div>
              </figure>
            </div>

            {/* ── CHAPTER I CODA: Original Sticky Memory Focus Pull (3:2 ratio) */}
            <figure
              data-rail-panel="memory"
              className={`${styles["rail-panel"]} ${styles["rail-memory-panel"]}`}
              style={{ "--plate-ratio": 3 / 2 } as CSSProperties}
            >
              <div className={styles["rail-memory-frame"]}>
                <motion.div
                  className={styles["book-parallax-inner"]}
                  style={
                    isDesktopHorizontal
                      ? {
                          filter: memoryFilter,
                          scale: memoryScale,
                          willChange: "filter, transform",
                        }
                      : undefined
                  }
                >
                  <Image
                    src={`${CDN}DSC00679.JPG`}
                    alt="Dashboard reflection leaving Bachok"
                    fill
                    sizes="(min-width: 768px) 140vh, 100vw"
                    className={styles["book-plate-img"]}
                  />
                </motion.div>
                <span className={styles["book-plate-scrim"]} aria-hidden="true" />
              </div>
              <figcaption className={styles["book-caption"]}>
                <span>Pantai Melawi, Bachok</span>
              </figcaption>
            </figure>

            {/* ── CHAPTER II: Besut & Setiu ─────────────────────────────────── */}
            <ChapterDivider
              id="besut-setiu"
              panelKey="besut-setiu"
              numeral={chapters.besut.numeral}
              title={chapters.besut.title}
              note={`${chapters.besut.region}, ${chapters.besut.kmFromPrevious} km south`}
              insetSrc={`${CDN}DSC01061.jpg`}
              insetAlt="Motorbike passing coconut palms along the coastal road in Setiu"
              insetCaption="Pantai Penarik, Setiu"
              timeline={timeline}
              fallbackRange={[0.68, 0.75]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
            />

            <figure
              data-rail-panel="besut-road"
              className={`${styles["rail-panel"]} ${styles["rail-plate-panel"]}`}
              style={{ "--plate-ratio": 3 / 2 } as CSSProperties}
            >
              <div className={styles["book-static-media"]}>
                <motion.div
                  className={styles["book-parallax-inner"]}
                  style={isDesktopHorizontal ? { x: roadX, scale: roadScale } : undefined}
                >
                  <Image
                    src={`${CDN}DSC01024.jpg`}
                    alt="Yellow car along the sandy coastal track through headless palms at Pantai Penarik"
                    fill
                    sizes="(min-width: 768px) 140vh, 100vw"
                    className={styles["book-plate-img"]}
                  />
                </motion.div>
                <span className={styles["book-plate-scrim"]} aria-hidden="true" />
              </div>
              <figcaption className={styles["book-caption"]}>
                <span>Pantai Penarik, Setiu</span>
              </figcaption>
            </figure>

            <RailPlate
              panelKey="p4"
              plate={plates.p4}
              timeline={timeline}
              fallbackRange={[0.72, 0.8]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p5"
              plate={plates.p5}
              timeline={timeline}
              fallbackRange={[0.75, 0.83]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 75vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />

            {/* ── CHAPTER III: Kuala Terengganu ─────────────────────────────── */}
            <ChapterDivider
              id="kuala-terengganu"
              panelKey="kuala-terengganu"
              numeral={chapters.kt.numeral}
              title={chapters.kt.title}
              note={`${chapters.kt.region}, ${chapters.kt.kmFromPrevious} km south`}
              insetSrc={`${CDN}DSC01218.jpg`}
              insetAlt="White mosque reflected in still water at Kuala Terengganu"
              insetCaption="Kuala Terengganu"
              timeline={timeline}
              fallbackRange={[0.78, 0.85]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
            />

            <RailPlate
              panelKey="p6"
              plate={plates.p6}
              timeline={timeline}
              fallbackRange={[0.8, 0.87]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p7"
              plate={plates.p7}
              timeline={timeline}
              fallbackRange={[0.83, 0.9]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p8"
              plate={plates.p8}
              timeline={timeline}
              fallbackRange={[0.85, 0.92]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p9"
              plate={plates.p9}
              timeline={timeline}
              fallbackRange={[0.88, 0.95]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />

            {/* ── CHAPTER IV: Dungun ────────────────────────────────────────── */}
            <ChapterDivider
              id="dungun"
              panelKey="dungun"
              numeral={chapters.dungun.numeral}
              title={chapters.dungun.title}
              note={`${chapters.dungun.region}, ${chapters.dungun.kmFromPrevious} km south`}
              timeline={timeline}
              fallbackRange={[0.9, 0.96]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
            />

            <RailPlate
              panelKey="p10"
              plate={plates.p10}
              timeline={timeline}
              fallbackRange={[0.92, 0.97]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p11"
              plate={plates.p11}
              timeline={timeline}
              fallbackRange={[0.94, 0.99]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 140vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />
            <RailPlate
              panelKey="p12"
              plate={plates.p12}
              timeline={timeline}
              fallbackRange={[0.95, 1]}
              scrollYProgress={scrollYProgress}
              parallaxEnabled={isDesktopHorizontal}
              sizes="(min-width: 768px) 165vh, 100vw"
              onOpen={onOpenPlate}
              onFocusPanel={scrollToPanel}
            />

            {/* ── EPILOGUE: Clean Editorial Colophon Column ─────────────────── */}
            <nav
              id="epilogue"
              data-rail-panel="epilogue"
              aria-label="End of Pantai Timor"
              className={`${styles["rail-panel"]} ${styles["rail-epilogue-panel"]}`}
            >
              <div className={styles["book-page-top"]}>
                <span className={styles["book-folio-num"]}>Fin</span>
                <span className={styles["book-running-place"]}>Kuala Dungun</span>
              </div>

              <div className={styles["rail-epilogue-links"]}>
                <Link
                  href="/gallery"
                  className={styles["rail-epilogue-link"]}
                  onClick={() => ptTrack.navClick("gallery")}
                  onFocus={() => scrollToPanel("epilogue")}
                >
                  ← Back to gallery
                </Link>
                <button
                  type="button"
                  className={styles["rail-epilogue-link"]}
                  onClick={backToCover}
                  onFocus={() => scrollToPanel("epilogue")}
                >
                  Back to cover ↑
                </button>
              </div>
            </nav>
          </motion.div>
        </div>

        {/* ── 1960s Running Folio Bar (fades in once you leave the Cover) ──── */}
        <motion.footer
          className={styles["book-folio-bar"]}
          aria-label="Gallery navigation"
          style={
            isDesktopHorizontal
              ? { opacity: folioOpacity, y: folioY, pointerEvents: pastCover ? "auto" : "none" }
              : { opacity: pastCover ? 1 : 0, pointerEvents: pastCover ? "auto" : "none" }
          }
        >
          <div className={styles["book-folio-chapters"]}>
            {STORY_CHAPTERS.map((chapter) => {
              const isActive = activeChapter === chapter.id;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  className={`${styles["book-folio-tab"]} ${
                    isActive ? styles["book-folio-tab-active"] : ""
                  }`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => scrollToPanel(chapter.id)}
                >
                  <span className={cormorant.className}>{chapter.numeral}</span>
                  <span className={styles["book-folio-tab-label"]}>{chapter.title}</span>
                </button>
              );
            })}
          </div>

          <div className={styles["book-folio-right"]}>
            <div className={styles["book-folio-controls"]}>
              <button
                type="button"
                className={styles["book-folio-step"]}
                aria-label="Previous plate"
                disabled={activePlateNumber <= 1}
                onClick={() => stepRail(-1)}
              >
                ←
              </button>
              <span className={styles["book-folio-pages"]} aria-live="polite">
                {String(activePlateNumber).padStart(2, "0")} / {STORY_PLATES.length}
              </span>
              <button
                type="button"
                className={styles["book-folio-step"]}
                aria-label="Next plate"
                disabled={activePlateNumber >= STORY_PLATES.length}
                onClick={() => stepRail(1)}
              >
                →
              </button>
            </div>
          </div>

          <div className={styles["book-progress-track"]} aria-hidden="true">
            {isDesktopHorizontal ? (
              <motion.span
                className={styles["book-progress-fill"]}
                style={{ scaleX: progressScaleX }}
              />
            ) : (
              <span
                className={styles["book-progress-fill"]}
                style={{ transform: `scaleX(${activePlateNumber / STORY_PLATES.length})` }}
              />
            )}
          </div>
        </motion.footer>
      </div>
    </section>
  );
};
