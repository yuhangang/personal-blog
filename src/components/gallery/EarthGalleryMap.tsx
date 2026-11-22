"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs";
import Map, { type MapRef, type ViewStateChangeEvent } from "react-map-gl/maplibre";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Layers,
  LocateFixed,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import {
  GALLERY_CHAPTERS,
  GALLERY_MAP_PHOTOS,
  type GalleryChapter,
  type GalleryChapterId,
  type GalleryMapPhoto,
} from "@/config/gallery";
import {
  clusterPhotoSpots,
  computePhotoBounds,
  formatCoordinates,
  groupPhotosBySpot,
  type PhotoCluster,
} from "./photoClustering";
import PhotoLabelMarker from "./PhotoLabelMarker";
import PhotoLightboxDialog from "./PhotoLightboxDialog";
import { useHorizontalScrollHints } from "./useHorizontalScrollHints";
import styles from "./EarthGalleryMap.module.scss";

type SurfaceMode = "satellite" | "night";

if (typeof window !== "undefined") {
  try {
    maplibregl.setWorkerUrl(
      new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href,
    );
  } catch {
    // Fallback to MapLibre default worker resolution
  }
}

const EARTH_STYLE: React.ComponentProps<typeof Map>["mapStyle"] = {
  version: 8,
  projection: {
    type: "globe",
  },
  sky: {
    "sky-color": "#05070c",
    "sky-horizon-blend": 0.62,
    "horizon-color": "#1a334d",
    "horizon-fog-blend": 0.65,
    "fog-color": "#0b111a",
    "fog-ground-blend": 0.35,
    "atmosphere-blend": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      1,
      5,
      0.72,
      9,
      0.18,
    ],
  },
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 18,
      attribution: "Esri, Maxar, Earthstar Geographics",
    },
    "night-chart": {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      maxzoom: 18,
      attribution: "CARTO",
    },
    "terrain-dem": {
      type: "raster-dem",
      tiles: [
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      maxzoom: 15,
      encoding: "terrarium",
    },
  },
  layers: [
    {
      id: "satellite-layer",
      type: "raster",
      source: "satellite",
      layout: {
        visibility: "visible",
      },
      paint: {
        "raster-saturation": -0.06,
        "raster-contrast": 0.08,
        "raster-brightness-max": 0.94,
      },
    },
    {
      id: "night-chart-layer",
      type: "raster",
      source: "night-chart",
      layout: {
        visibility: "none",
      },
      paint: {
        "raster-contrast": 0.12,
      },
    },
  ],
  terrain: {
    source: "terrain-dem",
    exaggeration: 1.4,
  },
};

const ALL_PHOTO_BOUNDS = computePhotoBounds(GALLERY_MAP_PHOTOS);

const ORBIT_VIEW = {
  longitude: ALL_PHOTO_BOUNDS?.centerLng ?? 102.92,
  latitude: ALL_PHOTO_BOUNDS?.centerLat ?? 5.46,
  zoom: 2.85,
  pitch: 14,
  bearing: -6,
};

const COAST_VIEW = {
  longitude: ALL_PHOTO_BOUNDS?.centerLng ?? 102.92,
  latitude: ALL_PHOTO_BOUNDS?.centerLat ?? 5.46,
  zoom: 7.45,
  pitch: 44,
  bearing: -16,
};

export default function EarthGalleryMap() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef | null>(null);
  const cameraDockRef = useRef<HTMLDivElement>(null);
  const chapterRailRef = useRef<HTMLElement>(null);
  const filmstripTrackRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);
  const hasAutoCenteredRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>("satellite");
  const [activeChapterId, setActiveChapterId] =
    useState<GalleryChapterId>("all");
  const [activePhotoId, setActivePhotoId] = useState<string | null>(
    () => GALLERY_MAP_PHOTOS.find((p) => p.featured)?.id ?? GALLERY_MAP_PHOTOS[0]?.id ?? null,
  );
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);
  const [filmstripOpen, setFilmstripOpen] = useState(true);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [isVisibleOnScreen, setIsVisibleOnScreen] = useState(true);

  const [lightboxPhotos, setLightboxPhotos] = useState<GalleryMapPhoto[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryMapPhoto | null>(
    null,
  );

  const [viewState, setViewState] = useState(() =>
    prefersReducedMotion ? COAST_VIEW : ORBIT_VIEW,
  );

  const allSpots = useMemo(
    () => groupPhotosBySpot(GALLERY_MAP_PHOTOS),
    [],
  );

  const featuredTourPhotos = useMemo(() => {
    const featured = GALLERY_MAP_PHOTOS.filter((p) => p.featured);
    return featured.length > 0 ? featured : GALLERY_MAP_PHOTOS;
  }, []);

  const filmstripPhotos = useMemo(() => {
    if (activeChapterId === "all" || activeChapterId === "orbit") {
      return GALLERY_MAP_PHOTOS;
    }
    const filtered = GALLERY_MAP_PHOTOS.filter(
      (p) => p.chapterId === activeChapterId,
    );
    return filtered.length > 0 ? filtered : GALLERY_MAP_PHOTOS;
  }, [activeChapterId]);

  const activePhoto = useMemo(
    () =>
      GALLERY_MAP_PHOTOS.find((p) => p.id === activePhotoId) ??
      GALLERY_MAP_PHOTOS[0] ??
      null,
    [activePhotoId],
  );

  const [clusters, setClusters] = useState<PhotoCluster[]>([]);

  const recomputeClusters = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const canvas = map.getCanvas();
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const center = map.getCenter();
    const zoom = map.getZoom();

    const next = clusterPhotoSpots({
      spots: allSpots,
      zoom,
      center: { lng: center.lng, lat: center.lat },
      viewport: { width, height },
      project: (lngLat) => map.project(lngLat),
      activePhotoId,
    });

    setClusters(next);
  }, [activePhotoId, allSpots]);

  useEffect(() => {
    if (mapLoaded) {
      recomputeClusters();
    }
  }, [mapLoaded, recomputeClusters]);

  useHorizontalScrollHints(chapterRailRef, {
    moreStartClass: styles.moreStart,
    moreEndClass: styles.moreEnd,
    refreshKey: activeChapterId,
  });

  useHorizontalScrollHints(filmstripTrackRef, {
    moreStartClass: styles.moreStart,
    moreEndClass: styles.moreEnd,
    refreshKey: `${filmstripOpen}-${filmstripPhotos.length}`,
  });

  // Set declarative focusgroup when supported; otherwise provide roving tabindex for arrow keys
  useEffect(() => {
    const dock = cameraDockRef.current;
    if (!dock) return;

    dock.setAttribute("focusgroup", "toolbar wrap block");
    if ("focusGroup" in HTMLElement.prototype) return;

    const getButtons = () =>
      Array.from(
        dock.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
      );

    const buttons = getButtons();
    if (buttons.length === 0) return;

    buttons.forEach((btn, idx) => {
      btn.tabIndex = idx === 0 ? 0 : -1;
    });

    const handleFocusIn = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("button");
      if (!target || !dock.contains(target)) return;
      for (const btn of getButtons()) {
        btn.tabIndex = btn === target ? 0 : -1;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentButtons = getButtons();
      const activeEl = document.activeElement as HTMLButtonElement | null;
      const idx = activeEl ? currentButtons.indexOf(activeEl) : -1;
      if (idx === -1) return;

      let nextIdx: number | null = null;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIdx = (idx + 1) % currentButtons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIdx = (idx - 1 + currentButtons.length) % currentButtons.length;
      } else if (event.key === "Home") {
        nextIdx = 0;
      } else if (event.key === "End") {
        nextIdx = currentButtons.length - 1;
      }

      if (nextIdx === null) return;
      event.preventDefault();
      currentButtons.forEach((btn, i) => {
        btn.tabIndex = i === nextIdx ? 0 : -1;
      });
      currentButtons[nextIdx]?.focus();
    };

    dock.addEventListener("focusin", handleFocusIn);
    dock.addEventListener("keydown", handleKeyDown);
    return () => {
      dock.removeEventListener("focusin", handleFocusIn);
      dock.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Center the active thumbnail cleanly within the horizontal filmstrip without scrolling the page
  useEffect(() => {
    const track = filmstripTrackRef.current;
    if (!track || !filmstripOpen || !activePhotoId) return;
    if (track.scrollWidth <= track.clientWidth) return;

    const thumb = track.querySelector<HTMLElement>(
      `[data-photo-id="${CSS.escape(activePhotoId)}"]`,
    );
    if (!thumb) {
      track.scrollTo({
        left: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      return;
    }

    const centeredLeft =
      thumb.offsetLeft - track.clientWidth / 2 + thumb.offsetWidth / 2;
    const clampedLeft = Math.max(
      0,
      Math.min(centeredLeft, track.scrollWidth - track.clientWidth),
    );
    track.scrollTo({
      left: clampedLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activePhotoId, filmstripOpen, filmstripPhotos.length, prefersReducedMotion]);

  const fitToPhotos = useCallback(
    (
      photos: GalleryMapPhoto[],
      options?: {
        pitch?: number;
        bearing?: number;
        duration?: number;
        maxZoom?: number;
      },
    ) => {
      const map = mapRef.current?.getMap();
      const bounds = computePhotoBounds(photos);
      if (!map || !bounds) return;

      const duration = prefersReducedMotion ? 0 : (options?.duration ?? 1600);
      const pitch = options?.pitch ?? 44;
      const bearing = options?.bearing ?? -16;

      if (bounds.isPoint) {
        map.flyTo({
          center: [bounds.centerLng, bounds.centerLat],
          zoom: options?.maxZoom ?? 13.4,
          pitch,
          bearing,
          duration,
          essential: true,
        });
        return;
      }

      const canvas = map.getCanvas();
      const width = canvas.clientWidth || stageRef.current?.clientWidth || 960;
      const height = canvas.clientHeight || stageRef.current?.clientHeight || 600;
      const isMobile = width < 768;

      const padding = {
        top: Math.min(isMobile ? 96 : 92, Math.floor(height * 0.2)),
        bottom: Math.min(
          isMobile ? (filmstripOpen ? 182 : 84) : (filmstripOpen ? 168 : 88),
          Math.floor(height * 0.34),
        ),
        left: Math.min(isMobile ? 28 : 48, Math.floor(width * 0.14)),
        right: Math.min(isMobile ? 64 : 76, Math.floor(width * 0.24)),
      };

      map.fitBounds([bounds.sw, bounds.ne], {
        padding,
        pitch,
        bearing,
        maxZoom: options?.maxZoom ?? 13.4,
        duration,
      });
    },
    [filmstripOpen, prefersReducedMotion],
  );

  // Auto-center to all available coordinates on load (orbital descent unless reduced-motion)
  useEffect(() => {
    if (
      !mapLoaded ||
      hasAutoCenteredRef.current ||
      userInteractedRef.current
    ) {
      return;
    }

    hasAutoCenteredRef.current = true;

    if (prefersReducedMotion) {
      fitToPhotos(GALLERY_MAP_PHOTOS, { duration: 0 });
      return;
    }

    const timer = window.setTimeout(() => {
      if (userInteractedRef.current) return;
      fitToPhotos(GALLERY_MAP_PHOTOS, { duration: 2200 });
    }, 320);

    return () => window.clearTimeout(timer);
  }, [fitToPhotos, mapLoaded, prefersReducedMotion]);

  // Keep MapLibre canvas synchronized with rounded-rect card dimensions
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    ro.observe(stageEl);

    return () => ro.disconnect();
  }, []);

  // Pause background tour when off-screen (content-visibility / IntersectionObserver / tab visibility)
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisibleOnScreen(false);
      } else {
        setIsVisibleOnScreen(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if ("contentVisibility" in document.documentElement.style) {
      const onAutoState = (event: Event) => {
        const skipped = Boolean((event as Event & { skipped?: boolean }).skipped);
        setIsVisibleOnScreen(!skipped);
      };
      stageEl.addEventListener("contentvisibilityautostatechange", onAutoState);
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        stageEl.removeEventListener(
          "contentvisibilityautostatechange",
          onAutoState,
        );
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisibleOnScreen(entry.isIntersecting);
        });
      },
      { rootMargin: "120px" },
    );
    observer.observe(stageEl);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  const flyToView = useCallback(
    (target: {
      lng: number;
      lat: number;
      zoom: number;
      pitch: number;
      bearing?: number;
      duration?: number;
    }) => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({
        center: [target.lng, target.lat],
        zoom: target.zoom,
        pitch: target.pitch,
        bearing: target.bearing ?? viewState.bearing,
        duration: prefersReducedMotion ? 0 : (target.duration ?? 1500),
        essential: true,
      });
    },
    [prefersReducedMotion, viewState.bearing],
  );

  const flyToPhoto = useCallback(
    (photo: GalleryMapPhoto) => {
      userInteractedRef.current = true;
      setActivePhotoId(photo.id);
      setActiveChapterId(photo.chapterId);
      flyToView({
        lng: photo.lng,
        lat: photo.lat,
        zoom: Math.max(viewState.zoom, 13.6),
        pitch: 54,
        bearing: photo.index % 2 === 0 ? -18 : 14,
        duration: 1650,
      });
    },
    [flyToView, viewState.zoom],
  );

  // Guided flyover tour timer
  useEffect(() => {
    if (!tourPlaying || !isVisibleOnScreen || lightboxPhoto || prefersReducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      const currentIdx = featuredTourPhotos.findIndex(
        (p) => p.id === activePhotoId,
      );
      const nextPhoto =
        featuredTourPhotos[(currentIdx + 1) % featuredTourPhotos.length];
      if (!nextPhoto) return;

      setActivePhotoId(nextPhoto.id);
      setActiveChapterId(nextPhoto.chapterId);
      mapRef.current?.flyTo({
        center: [nextPhoto.lng, nextPhoto.lat],
        zoom: 12.6,
        pitch: 52,
        bearing: nextPhoto.index % 2 === 0 ? -22 : 18,
        duration: 2400,
        essential: true,
      });
    }, 5400);

    return () => window.clearInterval(interval);
  }, [
    activePhotoId,
    featuredTourPhotos,
    isVisibleOnScreen,
    lightboxPhoto,
    prefersReducedMotion,
    tourPlaying,
  ]);

  const handleToggleSurface = () => {
    const next: SurfaceMode = surfaceMode === "satellite" ? "night" : "satellite";
    setSurfaceMode(next);
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.setLayoutProperty(
      "satellite-layer",
      "visibility",
      next === "satellite" ? "visible" : "none",
    );
    map.setLayoutProperty(
      "night-chart-layer",
      "visibility",
      next === "night" ? "visible" : "none",
    );
  };

  const handleSelectChapter = (chapter: GalleryChapter) => {
    userInteractedRef.current = true;
    setTourPlaying(false);
    setActiveChapterId(chapter.id);

    if (chapter.id === "orbit") {
      flyToView({
        lng: chapter.lng,
        lat: chapter.lat,
        zoom: chapter.zoom,
        pitch: chapter.pitch,
        bearing: chapter.bearing,
        duration: 1600,
      });
      return;
    }

    const targetPhotos =
      chapter.id === "all"
        ? GALLERY_MAP_PHOTOS
        : GALLERY_MAP_PHOTOS.filter((p) => p.chapterId === chapter.id);

    if (targetPhotos.length > 0) {
      fitToPhotos(targetPhotos, {
        pitch: chapter.pitch,
        bearing: chapter.bearing,
        duration: 1600,
      });
      return;
    }

    flyToView({
      lng: chapter.lng,
      lat: chapter.lat,
      zoom: chapter.zoom,
      pitch: chapter.pitch,
      bearing: chapter.bearing,
      duration: 1600,
    });
  };

  const handleActivateCluster = (cluster: PhotoCluster) => {
    userInteractedRef.current = true;
    setTourPlaying(false);
    setActivePhotoId(cluster.coverPhoto.id);

    if (cluster.isMultiSpot) {
      const map = mapRef.current?.getMap();
      const lngs = cluster.spots.map((s) => s.lng);
      const lats = cluster.spots.map((s) => s.lat);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      if (map && (maxLng - minLng > 0.012 || maxLat - minLat > 0.012)) {
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: { top: 96, bottom: 168, left: 48, right: 64 },
            pitch: 48,
            maxZoom: 13.4,
            duration: prefersReducedMotion ? 0 : 1400,
          },
        );
      } else {
        flyToView({
          lng: cluster.lng,
          lat: cluster.lat,
          zoom: Math.min(14.5, Math.max(viewState.zoom + 2.4, 12.6)),
          pitch: 52,
          duration: 1300,
        });
      }
      return;
    }

    // Single GPS spot (1 photo or stack at exact GPS point) -> open native dialog viewer
    const collectionForDialog =
      cluster.photos.length > 1 ? cluster.photos : GALLERY_MAP_PHOTOS;
    setLightboxPhotos(collectionForDialog);
    setLightboxPhoto(cluster.coverPhoto);
  };

  const handleTogglePitch = () => {
    userInteractedRef.current = true;
    setTourPlaying(false);
    const nextPitch = viewState.pitch > 20 ? 0 : 50;
    mapRef.current?.easeTo({
      pitch: nextPitch,
      duration: prefersReducedMotion ? 0 : 750,
    });
  };

  const handleZoomDelta = (delta: number) => {
    userInteractedRef.current = true;
    setTourPlaying(false);
    mapRef.current?.easeTo({
      zoom: Math.max(1.8, Math.min(17.5, viewState.zoom + delta)),
      duration: prefersReducedMotion ? 0 : 420,
    });
  };

  const handleMapMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
    recomputeClusters();
  };

  const isTilted3D = viewState.pitch > 20;

  return (
    <>
      <div
        ref={stageRef}
        className={styles.mapStage}
        role="region"
        aria-labelledby="map-atlas-heading"
      >
        <div id="earth-map-canvas" className={styles.mapCanvas}>
          <Map
            ref={mapRef}
            mapLib={maplibregl}
            workerUrl={maplibreWorkerUrl}
            initialViewState={prefersReducedMotion ? COAST_VIEW : ORBIT_VIEW}
            mapStyle={EARTH_STYLE}
            style={{ width: "100%", height: "100%" }}
            minZoom={1.6}
            maxZoom={17.5}
            maxPitch={68}
            cooperativeGestures
            attributionControl={{ compact: true }}
            onLoad={() => {
              setMapLoaded(true);
              const map = mapRef.current?.getMap();
              if (map) {
                try {
                  map.setProjection({ type: "globe" });
                } catch {
                  // Already set in style specification
                }
              }
            }}
            onMove={handleMapMove}
            onDragStart={() => {
              userInteractedRef.current = true;
              if (tourPlaying) setTourPlaying(false);
            }}
            onWheel={() => {
              userInteractedRef.current = true;
              if (tourPlaying) setTourPlaying(false);
            }}
          >
            {clusters.map((cluster) => (
              <PhotoLabelMarker
                key={cluster.id}
                cluster={cluster}
                onActivate={handleActivateCluster}
                onHoverChange={setHoveredClusterId}
              />
            ))}
          </Map>
        </div>

        <div className={styles.vignetteTop} aria-hidden="true" />
        <div className={styles.vignetteBottom} aria-hidden="true" />
        <div className={styles.cardBorderOverlay} aria-hidden="true" />

        {/* Top editorial title overlay */}
        <div className={styles.hudTop}>
          <div className={styles.titleBlock}>
            <p className={styles.kicker}>
              01 · {GALLERY_MAP_PHOTOS.length} Photos
            </p>
            <h2 id="map-atlas-heading" className={styles.title}>
              Photo <em>Map.</em>
            </h2>
          </div>

          <div className={styles.telemetryPill} aria-live="polite">
            <span className={styles.telemetryDot} aria-hidden="true" />
            <span>
              {hoveredClusterId
                ? clusters.find((c) => c.id === hoveredClusterId)?.label ??
                  "All Locations"
                : formatCoordinates(viewState.latitude, viewState.longitude)}
            </span>
            <span className={styles.telemetryDivider} aria-hidden="true">
              ·
            </span>
            <span>Z{viewState.zoom.toFixed(1)}</span>
          </div>
        </div>

        {/* Top-right vertical Liquid Glass camera toolbar */}
        <div
          ref={cameraDockRef}
          className={styles.cameraDock}
          role="toolbar"
          aria-orientation="vertical"
          aria-label="Map view controls"
          aria-controls="earth-map-canvas"
        >
          <div
            className={styles.controlGroup}
            role="group"
            aria-label="Camera projection"
          >
            <button
              type="button"
              className={styles.controlBtn}
              aria-label="Center on all photo coordinates"
              title="Center on all coordinates"
              onClick={() =>
                handleSelectChapter(
                  GALLERY_CHAPTERS.find((c) => c.id === "all")!,
                )
              }
            >
              <LocateFixed size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>

            <button
              type="button"
              className={styles.controlBtn}
              aria-pressed={isTilted3D}
              aria-label={
                isTilted3D ? "Switch to 2D top view" : "Switch to 3D tilted view"
              }
              title={isTilted3D ? "2D Top View" : "3D Terrain Tilt"}
              onClick={handleTogglePitch}
            >
              <span className={styles.controlGlyph}>{isTilted3D ? "3D" : "2D"}</span>
            </button>

            <button
              type="button"
              className={styles.controlBtn}
              aria-pressed={surfaceMode === "night"}
              aria-label={
                surfaceMode === "satellite"
                  ? "Switch to dark base map"
                  : "Switch to satellite imagery"
              }
              title={
                surfaceMode === "satellite"
                  ? "Dark Map"
                  : "Satellite Imagery"
              }
              onClick={handleToggleSurface}
            >
              <Layers size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <div
            className={styles.controlGroup}
            role="group"
            aria-label="Map zoom"
          >
            <button
              type="button"
              className={styles.controlBtn}
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => handleZoomDelta(1.25)}
            >
              <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => handleZoomDelta(-1.25)}
            >
              <Minus size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Bottom floating Liquid Glass chapters & filmstrip dock */}
        <div className={styles.bottomDock}>
          <div className={styles.dockToolbar}>
            <nav
              ref={chapterRailRef}
              className={styles.chapterRail}
              aria-label="Map regions"
            >
              {GALLERY_CHAPTERS.map((chapter) => {
                const isActive = activeChapterId === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    aria-pressed={isActive}
                    className={styles.chapterChip}
                    onClick={() => handleSelectChapter(chapter)}
                  >
                    {chapter.shortLabel}
                  </button>
                );
              })}
            </nav>

            <div className={styles.utilityRow}>
              <div
                className={styles.utilityCapsule}
                role="group"
                aria-label="Playback and strip controls"
              >
                {!prefersReducedMotion && (
                  <>
                    <button
                      type="button"
                      className={`${styles.utilityBtn} ${
                        tourPlaying ? styles.utilityBtnActive : ""
                      }`}
                      aria-label={tourPlaying ? "Pause flyover tour" : "Play flyover tour"}
                      onClick={() => setTourPlaying((prev) => !prev)}
                    >
                      {tourPlaying ? (
                        <Pause size={14} strokeWidth={1.9} aria-hidden="true" />
                      ) : (
                        <Play size={14} strokeWidth={1.9} aria-hidden="true" />
                      )}
                      <span className={styles.pillLabelDesktop}>
                        {tourPlaying ? "Pause" : "Flyover"}
                      </span>
                    </button>
                    <span className={styles.utilityDivider} aria-hidden="true" />
                  </>
                )}

                <button
                  type="button"
                  className={styles.utilityBtn}
                  aria-expanded={filmstripOpen}
                  aria-label={
                    filmstripOpen ? "Hide photo strip" : "Show photo strip"
                  }
                  onClick={() => setFilmstripOpen((prev) => !prev)}
                >
                  {filmstripOpen ? (
                    <ChevronDown size={15} strokeWidth={1.9} aria-hidden="true" />
                  ) : (
                    <ChevronUp size={15} strokeWidth={1.9} aria-hidden="true" />
                  )}
                  <span className={styles.pillLabelDesktop}>Strip</span>
                </button>
              </div>

              {activePhoto && (
                <button
                  type="button"
                  className={styles.mobileInspectBtn}
                  aria-label={`Open active photo ${activePhoto.placeName}`}
                  onClick={() => {
                    setTourPlaying(false);
                    setLightboxPhotos(GALLERY_MAP_PHOTOS);
                    setLightboxPhoto(activePhoto);
                  }}
                >
                  <span className={styles.mobileInspectLabel}>
                    {activePhoto.placeName}
                  </span>
                  <Maximize2 size={14} strokeWidth={1.85} aria-hidden="true" />
                </button>
              )}

              <Link
                href={activePhoto?.collectionHref ?? "#collections-index"}
                className={styles.galleryLinkPill}
                aria-label={
                  activePhoto
                    ? `Open ${activePhoto.collectionTitle} essay`
                    : "Browse collections"
                }
              >
                <span className={styles.pillLabelDesktop}>Open Essay</span>
                <span className={styles.pillLabelMobile}>Essay</span>
                <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {filmstripOpen && (
            <div className={styles.filmstripShell}>
              <div
                ref={filmstripTrackRef}
                className={styles.filmstripTrack}
                role="region"
                aria-label="Photo archive filmstrip"
              >
                {filmstripPhotos.map((photo) => {
                  const isSelected = photo.id === activePhotoId;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      data-photo-id={photo.id}
                      className={styles.filmThumb}
                      aria-label={`${photo.frameCode}, ${photo.placeName}. ${
                        isSelected
                          ? "Activate again to open photo"
                          : "Fly camera to this location"
                      }`}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setTourPlaying(false);
                        if (isSelected) {
                          setLightboxPhotos(GALLERY_MAP_PHOTOS);
                          setLightboxPhoto(photo);
                        } else {
                          flyToPhoto(photo);
                        }
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.thumb}
                        alt=""
                        className={styles.filmThumbImage}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>

              {activePhoto && (
                <div className={styles.activeInspector}>
                  <div className={styles.inspectorMeta}>
                    <p className={styles.inspectorPlace}>
                      {activePhoto.placeName}
                    </p>
                    <p className={styles.inspectorCoord}>
                      {activePhoto.frameCode} · {activePhoto.region}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.inspectBtn}
                    aria-label={`Open photo ${activePhoto.frameCode}`}
                    onClick={() => {
                      setTourPlaying(false);
                      setLightboxPhotos(GALLERY_MAP_PHOTOS);
                      setLightboxPhoto(activePhoto);
                    }}
                  >
                    <Maximize2 size={15} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PhotoLightboxDialog
        photos={lightboxPhotos.length > 0 ? lightboxPhotos : GALLERY_MAP_PHOTOS}
        activePhoto={lightboxPhoto}
        onSelectPhoto={(photo) => {
          setLightboxPhoto(photo);
          setActivePhotoId(photo.id);
        }}
        onClose={() => setLightboxPhoto(null)}
        onFlyToPhoto={(photo) => flyToPhoto(photo)}
      />
    </>
  );
}
