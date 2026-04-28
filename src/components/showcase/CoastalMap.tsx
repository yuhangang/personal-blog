"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./CoastalMap.css";
import { Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  COASTAL_LOCATIONS,
  ATTRACTIONS,
  CoastalLocation,
  Attraction,
  AttractionCategory,
} from "../../app/pantai-timor/data";

export interface CoastalMapProps {
  onImageClick?: (src: string) => void;
}

const EAST_COAST_BOUNDS: [[number, number], [number, number]] = [
  [101.22, 3.92],
  [104.48, 6.72],
];

// ── Palette ─────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  AttractionCategory,
  { label: string; color: string; glow: string }
> = {
  island: { label: "Island", color: "#f4ead6", glow: "rgba(244,234,214,0.42)" },
  beach: { label: "Beach", color: "#e7d2a5", glow: "rgba(231,210,165,0.38)" },
  lake: { label: "Lake", color: "#d8e4d2", glow: "rgba(216,228,210,0.34)" },
  waterfall: { label: "Waterfall", color: "#d7dfdf", glow: "rgba(215,223,223,0.34)" },
  museum: { label: "Museum", color: "#ead8bd", glow: "rgba(234,216,189,0.36)" },
  heritage: { label: "Heritage", color: "#efd7c9", glow: "rgba(239,215,201,0.36)" },
  nature: { label: "Nature", color: "#d5dfc3", glow: "rgba(213,223,195,0.34)" },
};

const ICON_STROKE = "#10110F";
const iconLine = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconSvg({ children, size = 34 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function IslandIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <path d="M7 29.5C12.4 27.1 19.6 27 25 29.5C28.1 30.9 32.5 31.1 36 29.7" {...iconLine} strokeWidth="1.65" />
      <path d="M9 33C15.8 31.5 23.5 31.5 32 33" {...iconLine} strokeWidth="1.15" opacity="0.5" />
      <path d="M19.6 27.3C18.2 22.6 18.8 17.8 21.5 13" {...iconLine} strokeWidth="1.65" />
      <path d="M21.5 13C17.5 10.2 13.3 10.7 9.3 13.8" {...iconLine} strokeWidth="1.45" />
      <path d="M21.5 13C20.2 9.3 17.6 7.1 13.6 6.5" {...iconLine} strokeWidth="1.45" />
      <path d="M21.5 13C25.8 10.6 30.2 10.8 34.1 13.7" {...iconLine} strokeWidth="1.45" />
      <path d="M21.5 13C24.1 9.9 27.4 8.4 31.4 8.5" {...iconLine} strokeWidth="1.45" />
      <path d="M28.6 19.5C31.1 17.1 34 16.2 37.1 16.8" {...iconLine} strokeWidth="1.2" opacity="0.62" />
      <path d="M31.7 18.6C31.8 20.8 31.4 23.1 30.4 25.3" {...iconLine} strokeWidth="1.2" opacity="0.62" />
    </IconSvg>
  );
}

function BeachIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <circle cx="8.5" cy="10" r="2.8" {...iconLine} strokeWidth="1.55" />
      <path d="M5 20.5C9.2 18.8 13.6 18.8 18 20.5" {...iconLine} strokeWidth="1.35" />
      <path d="M5.5 25.1C10.2 23.5 15 23.5 20 25.1" {...iconLine} strokeWidth="1.35" />
      <path d="M24.4 27.5C24.9 23.3 23.7 19.8 20.6 17" {...iconLine} strokeWidth="1.65" />
      <path d="M20.6 17C24.6 14.7 28.8 14.5 33.4 16.4" {...iconLine} strokeWidth="1.45" />
      <path d="M20.6 17C18.6 13.7 15.6 12.1 11.8 12.3" {...iconLine} strokeWidth="1.45" />
      <path d="M21 30.8H34.5C32.9 27.1 28.7 25.8 24.4 27.5" {...iconLine} strokeWidth="1.65" />
      <path d="M24.2 10.5L31.8 6.6L35.8 14.4" {...iconLine} strokeWidth="1.25" opacity="0.62" />
      <path d="M31.8 6.6L31 14.2" {...iconLine} strokeWidth="1.05" opacity="0.62" />
    </IconSvg>
  );
}

function LakeIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <path d="M5.5 18.8L12.2 7.5L18.5 16.1L23.4 10.8L31.3 20.2" {...iconLine} strokeWidth="1.6" />
      <path d="M10 25C14.1 23.2 18.3 23.2 22.5 25C26.5 26.7 30.6 26.8 34.8 25.2" {...iconLine} strokeWidth="1.45" />
      <path d="M8.4 29.4C12.7 28.1 17 28.1 21.3 29.4C25.9 30.8 30.1 30.8 34 29.4" {...iconLine} strokeWidth="1.15" opacity="0.55" />
      <path d="M14 22V18.5H23.2V22" {...iconLine} strokeWidth="1.35" />
      <path d="M15.7 18.5L18.5 15.9L21.5 18.5" {...iconLine} strokeWidth="1.35" />
      <path d="M23.2 20.1H28.4L30.8 22.6" {...iconLine} strokeWidth="1.2" opacity="0.7" />
    </IconSvg>
  );
}

function WaterfallIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <path d="M7.5 11.5C13 8.7 18.2 8.7 23.1 11.5C26.7 13.6 30.4 13.5 34.3 11.2" {...iconLine} strokeWidth="1.45" />
      <path d="M10.6 12.8V23.7C10.6 26.5 8.9 28 7.2 30" {...iconLine} strokeWidth="1.45" />
      <path d="M17.2 12.2V29.3" {...iconLine} strokeWidth="1.85" />
      <path d="M23.8 13.2V29.1" {...iconLine} strokeWidth="1.85" />
      <path d="M30.5 12.9V22.9C30.5 26.1 32.1 27.9 34.5 30" {...iconLine} strokeWidth="1.45" />
      <path d="M9.2 32.8C13.6 30.7 18 30.7 22.5 32.8C26 34.4 29.7 34.4 33.5 32.8" {...iconLine} strokeWidth="1.2" opacity="0.58" />
      <path d="M6.8 25.5C9.3 24.2 11.4 24.2 13 25.4" {...iconLine} strokeWidth="1.05" opacity="0.55" />
    </IconSvg>
  );
}

function MuseumIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <path d="M5.2 17.4L21 8L36.8 17.4" {...iconLine} strokeWidth="1.6" />
      <path d="M9.2 17.4H32.8" {...iconLine} strokeWidth="1.45" />
      <path d="M10.8 17.4V30.7H31.2V17.4" {...iconLine} strokeWidth="1.45" />
      <path d="M15.2 30.7V20.8H20.7V30.7" {...iconLine} strokeWidth="1.2" />
      <path d="M23.5 22.2H27.6M23.5 25.3H27.6" {...iconLine} strokeWidth="1.05" opacity="0.72" />
      <path d="M14.8 14.1L21 10.3L27.2 14.1" {...iconLine} strokeWidth="1.05" opacity="0.65" />
      <path d="M7.5 34H34.5" {...iconLine} strokeWidth="1.5" />
      <path d="M18 7.2L21 4.8L24 7.2" {...iconLine} strokeWidth="1.15" opacity="0.75" />
    </IconSvg>
  );
}

function HeritageIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <path d="M8 17.4L16.9 9.4L27.8 17.4H8Z" {...iconLine} strokeWidth="1.55" />
      <path d="M10.4 17.4V29.8H28.1V17.4" {...iconLine} strokeWidth="1.45" />
      <path d="M14.2 29.8V21.3H20.3V29.8" {...iconLine} strokeWidth="1.25" />
      <path d="M23 21.6H26.1M23 24.8H26.1" {...iconLine} strokeWidth="1.05" opacity="0.7" />
      <path d="M9 33.8H30" {...iconLine} strokeWidth="1.35" />
      <path d="M29.5 29.8L35.2 34M31 31.2H35.4M32.7 32.5H36.1" {...iconLine} strokeWidth="1.15" opacity="0.75" />
      <path d="M27 12C28.7 8.7 31.3 7.3 34.8 8" {...iconLine} strokeWidth="1.15" opacity="0.66" />
      <path d="M32.3 8.2C32.3 10.1 31.8 12.1 30.8 14.1" {...iconLine} strokeWidth="1.05" opacity="0.66" />
      <path d="M13.8 13.8H20.8" {...iconLine} strokeWidth="1.05" opacity="0.58" />
    </IconSvg>
  );
}

function NatureIcon({ size }: { size?: number }) {
  return (
    <IconSvg size={size}>
      <path d="M4.8 27L11.8 14.4L17.6 23.2L24.2 9.5L36.8 27" {...iconLine} strokeWidth="1.55" />
      <path d="M7.2 27C12.4 24.8 17.6 24.8 22.8 27C27.1 28.8 31.2 28.8 35.2 27" {...iconLine} strokeWidth="1.35" />
      <path d="M12.5 29.5C13.3 32.3 12.7 34.7 10.8 36.6" {...iconLine} strokeWidth="1.1" opacity="0.68" />
      <path d="M17 29.5C18 32.1 17.8 34.6 16.3 36.7" {...iconLine} strokeWidth="1.1" opacity="0.68" />
      <path d="M28.5 28.8C29.4 31.3 28.8 33.7 26.8 36" {...iconLine} strokeWidth="1.1" opacity="0.68" />
      <path d="M25 9.7C27 7.4 29.7 6.9 33.2 8.2" {...iconLine} strokeWidth="1.05" opacity="0.62" />
      <path d="M9.6 17.9C11.4 16.3 13.3 16 15.3 17.2" {...iconLine} strokeWidth="1.05" opacity="0.55" />
    </IconSvg>
  );
}

function AttractionIcon({ category, size }: { category: AttractionCategory; size?: number }) {
  switch (category) {
    case "island":    return <IslandIcon size={size} />;
    case "beach":     return <BeachIcon size={size} />;
    case "lake":      return <LakeIcon size={size} />;
    case "waterfall": return <WaterfallIcon size={size} />;
    case "museum":    return <MuseumIcon size={size} />;
    case "heritage":  return <HeritageIcon size={size} />;
    case "nature":    return <NatureIcon size={size} />;
  }
}

function LegendLogo() {
  return (
    <span
      className="flex h-8 w-[3.6rem] shrink-0 items-center justify-center rounded-[0.45rem] border border-[#e3e1da]/16 bg-[#e3e1da]/6 text-[#e3e1da]/76"
      aria-hidden="true"
    >
      <svg
        width="43"
        height="22"
        viewBox="0 0 43 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.6 16.3C6.5 14.7 10.6 14.7 14.6 16.3C18.3 17.8 21.9 17.8 25.5 16.3C29.4 14.7 33.4 14.7 37.7 16.3" stroke="currentColor" strokeWidth="1.12" strokeLinecap="round" />
        <path d="M5.4 18.9C10.9 17.7 16.1 17.7 21.1 18.9C25.9 20.1 30.8 20.1 35.8 18.9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.52" />
        <path d="M25.2 14.5V9.6H35.3V14.6" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23.5 9.6L30.2 4.2L37.4 9.6" stroke="currentColor" strokeWidth="1.12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28.6 14.5V11H32.4V14.5" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31.2 5L33.7 9.4M29.3 6.5H34.1" stroke="currentColor" strokeWidth="0.76" strokeLinecap="round" opacity="0.62" />
        <path d="M13.6 14.2C14.1 10.4 13.3 7.6 10.8 5.4" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
        <path d="M10.8 5.4C7.7 5.3 5.4 6.4 3.8 8.8" stroke="currentColor" strokeWidth="0.96" strokeLinecap="round" />
        <path d="M10.8 5.4C9.4 3.2 7.5 2.2 5 2.5" stroke="currentColor" strokeWidth="0.96" strokeLinecap="round" />
        <path d="M10.8 5.4C13.5 3.7 16.2 3.4 19 4.7" stroke="currentColor" strokeWidth="0.96" strokeLinecap="round" />
        <path d="M10.8 5.4C13.1 5.7 15.1 7 16.8 9.1" stroke="currentColor" strokeWidth="0.96" strokeLinecap="round" />
        <path d="M39.2 7.4C40 6.8 40.8 6.8 41.6 7.4" stroke="currentColor" strokeWidth="0.72" strokeLinecap="round" opacity="0.54" />
      </svg>
    </span>
  );
}

function countAttractionsInBounds(
  attractions: Attraction[],
  bounds: maplibregl.LngLatBounds,
) {
  const west = bounds.getWest();
  const east = bounds.getEast();
  const south = bounds.getSouth();
  const north = bounds.getNorth();
  const crossesDateLine = west > east;

  return attractions.filter((attr) => {
    const isWithinLongitude = crossesDateLine
      ? attr.lng >= west || attr.lng <= east
      : attr.lng >= west && attr.lng <= east;

    return isWithinLongitude && attr.lat >= south && attr.lat <= north;
  }).length;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CoastalMap({ onImageClick }: CoastalMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [hoveredLocation, setHoveredLocation]   = useState<string | null>(null);
  const [hoveredAttraction, setHoveredAttraction] = useState<string | null>(null);
  const categoryEntries = Object.entries(CATEGORY_META) as [
    AttractionCategory,
    typeof CATEGORY_META[AttractionCategory],
  ][];
  const [activeCategories, setActiveCategories] = useState<AttractionCategory[]>(
    categoryEntries.map(([category]) => category),
  );
  const activeCategorySet = new Set(activeCategories);
  const visibleAttractions = ATTRACTIONS.filter((attr) => activeCategorySet.has(attr.category));
  const allCategoriesActive = activeCategories.length === categoryEntries.length;
  const [visibleSiteCount, setVisibleSiteCount] = useState(visibleAttractions.length);

  const updateVisibleSiteCount = () => {
    const bounds = mapRef.current?.getBounds();
    if (!bounds) {
      setVisibleSiteCount(visibleAttractions.length);
      return;
    }

    setVisibleSiteCount(countAttractionsInBounds(visibleAttractions, bounds));
  };

  const toggleCategory = (category: AttractionCategory) => {
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  useEffect(() => {
    const bounds = mapRef.current?.getBounds();
    setVisibleSiteCount(
      bounds ? countAttractionsInBounds(visibleAttractions, bounds) : visibleAttractions.length,
    );
  }, [visibleAttractions]);

  return (
    <div className="pantai-coastal-map w-full h-full relative group overflow-hidden bg-[#12130f]">


      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: 102.86,
          latitude: 5.42,
          zoom: 7.45,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        maxBounds={EAST_COAST_BOUNDS}
        minZoom={7.45}
        maxZoom={13}
        attributionControl={false}
        cooperativeGestures={true}
        onLoad={updateVisibleSiteCount}
        onMove={updateVisibleSiteCount}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* ── Photo archive markers ─────────────────────────────────────── */}
        {COASTAL_LOCATIONS.map((loc: CoastalLocation) => (
          <Marker
            key={loc.name}
            longitude={loc.lng}
            latitude={loc.lat}
            anchor="bottom"
          >
            <div
              role={loc.image ? "button" : undefined}
              tabIndex={loc.image ? 0 : undefined}
              aria-label={loc.image ? `Open photo from ${loc.name}` : loc.name}
              className="relative cursor-pointer outline-none"
              onMouseEnter={() => setHoveredLocation(loc.name)}
              onMouseLeave={() => setHoveredLocation(null)}
              onFocus={() => setHoveredLocation(loc.name)}
              onBlur={() => setHoveredLocation(null)}
              onClick={() => loc.image && onImageClick?.(loc.image)}
              onKeyDown={(event) => {
                if (!loc.image || (event.key !== "Enter" && event.key !== " ")) return;
                event.preventDefault();
                onImageClick?.(loc.image);
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: hoveredLocation === loc.name ? 1.28 : 1,
                }}
                className="flex items-center justify-center"
              >
                <div className="w-4 h-4 bg-[#e3e1da] border border-[#10110F] shadow-[0_0_0_5px_rgba(227,225,218,0.07),0_8px_18px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#10110F]" />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {hoveredLocation === loc.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 z-50 mb-6 w-[17rem] -translate-x-1/2 overflow-hidden border border-[#e3e1da]/15 bg-[#151612]/95 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {loc.image && (
                      <div className="relative w-full aspect-[3/2] group/img overflow-hidden">
                        <Image
                          src={loc.image}
                          alt={loc.imageAlt || loc.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                        <button
                          type="button"
                          aria-label={`Expand ${loc.name} photo`}
                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[#10110F]/50 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100 focus:opacity-100"
                          onClick={() => onImageClick?.(loc.image!)}
                        >
                          <span className="flex h-11 w-11 items-center justify-center border border-[#e3e1da]/30 bg-[#10110F]/70 text-[#e3e1da] backdrop-blur-sm">
                            <Maximize2 className="h-4 w-4" />
                          </span>
                        </button>
                      </div>
                    )}
                    <div className="!p-5">
                      <h4 className="font-sans !mb-2 !text-[0.68rem] font-black uppercase !tracking-[0.25em] !text-[#e3e1da]">
                        {loc.name}
                      </h4>
                      <p className="font-sans !mb-0 !text-[0.68rem] !leading-[1.85] !text-[#e3e1da]/58">
                        {loc.description}
                      </p>
                    </div>
                    <div className="absolute left-1/2 top-full -mt-px h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#e3e1da]/15 bg-[#151612]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Marker>
        ))}

        {/* ── Attraction markers ────────────────────────────────────────── */}
        {visibleAttractions.map((attr: Attraction) => {
          const meta = CATEGORY_META[attr.category];
          const isHovered = hoveredAttraction === attr.name;
          return (
            <Marker
              key={attr.name}
              longitude={attr.lng}
              latitude={attr.lat}
              anchor="center"
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={attr.name}
                className="relative cursor-default outline-none"
                onMouseEnter={() => setHoveredAttraction(attr.name)}
                onMouseLeave={() => setHoveredAttraction(null)}
                onFocus={() => setHoveredAttraction(attr.name)}
                onBlur={() => setHoveredAttraction(null)}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                    y: isHovered ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  style={{
                    backgroundColor: "rgba(227,225,218,0.92)",
                    borderColor: isHovered ? "rgba(227,225,218,0.92)" : "rgba(227,225,218,0.58)",
                    boxShadow: isHovered
                      ? "0 10px 24px rgba(0,0,0,0.36), 0 0 0 1px rgba(16,17,15,0.28)"
                      : "0 6px 14px rgba(0,0,0,0.24), 0 0 0 1px rgba(16,17,15,0.16)",
                  }}
                  className="relative z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[0.45rem] border text-[#10110F]"
                >
                  <div className="relative z-10">
                    <AttractionIcon category={attr.category} />
                  </div>
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full left-1/2 z-50 mb-4 w-[17rem] -translate-x-1/2 pointer-events-none"
                    >
                      {/* Category badge + name bar */}
                      <div
                        style={{ borderColor: `${meta.color}30` }}
                        className="overflow-hidden border bg-[#0e0f0c]/96 shadow-[0_24px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
                      >
                        {/* Coloured accent top stripe */}
                        <div
                          style={{ background: `linear-gradient(90deg, ${meta.color}30, transparent)` }}
                          className="h-[2px] w-full"
                        />
                        <div className="!px-5 !py-4">
                          <div className="flex items-center gap-2.5 !mb-3">
                            <span
                              style={{ color: meta.color, borderColor: `${meta.color}40`, backgroundColor: `${meta.color}12` }}
                              className="font-sans !text-[0.5rem] font-black uppercase tracking-[0.28em] border !px-2 !py-1"
                            >
                              {meta.label}
                            </span>
                          </div>
                          <h4 className="font-sans !mb-1 !text-[0.72rem] font-black uppercase !tracking-[0.22em] !text-[#f2f0ea] !leading-tight">
                            {attr.name}
                          </h4>
                          {attr.nameMalay && attr.nameMalay !== attr.name && (
                            <p
                              style={{ color: meta.color }}
                              className="font-sans !mb-3 !text-[0.58rem] font-bold uppercase !tracking-[0.2em] opacity-70"
                            >
                              {attr.nameMalay}
                            </p>
                          )}
                          <p className="font-sans !mb-0 !text-[0.68rem] !leading-[1.8] !text-[#e3e1da]/55">
                            {attr.description}
                          </p>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div
                        style={{ borderColor: `${meta.color}30`, backgroundColor: "#0e0f0c" }}
                        className="absolute left-1/2 top-full -mt-px h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* ── Vignette overlay ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_66%_38%,transparent_0,rgba(16,17,15,0.04)_36%,rgba(16,17,15,0.42)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 pointer-events-none bg-gradient-to-b from-[#10110F]/55 to-transparent" />

      {/* ── Top editorial rail ───────────────────────────────────────────── */}
      <div className="absolute left-4 right-4 top-4 z-20 pointer-events-none flex items-start justify-between gap-4 md:left-6 md:right-6 md:top-6">
        <div className="rounded-full border border-[#e3e1da]/12 bg-[#10110F]/72 !px-4 !py-2.5 backdrop-blur-xl shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
          <p className="!mb-0 font-sans !text-[0.5rem] font-black uppercase !tracking-[0.24em] !text-[#e3e1da]/52">
            Kelantan / Terengganu
          </p>
        </div>
      </div>

      {/* ── Interactive legend ───────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none !p-4 md:!p-6">
        <div className="pointer-events-auto ml-auto flex max-w-[44rem] flex-col gap-3 rounded-[1rem] border border-[#e3e1da]/12 bg-[#10110F]/86 !p-3 shadow-[0_26px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:!p-3.5">
          <div className="flex items-center justify-between gap-4 !px-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <LegendLogo />
              <p className="!mb-0 font-sans !text-[0.55rem] font-black uppercase !tracking-[0.26em] !text-[#e3e1da]/56">
                LEGEND
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="hidden !mb-0 rounded-full border border-[#e3e1da]/10 bg-[#e3e1da]/5 !px-3 !py-1.5 font-sans !text-[0.5rem] font-black uppercase !tracking-[0.22em] !text-[#e3e1da]/42 sm:block">
                {visibleSiteCount} sites in view
              </p>
              <button
                type="button"
                aria-pressed={allCategoriesActive}
                className="rounded-full border border-[#e3e1da]/12 bg-[#e3e1da]/5 !px-3 !py-1.5 font-sans !text-[0.5rem] font-black uppercase !tracking-[0.22em] !text-[#e3e1da]/58 transition-colors hover:bg-[#e3e1da]/10 hover:!text-[#e3e1da] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3e1da]/30"
                onClick={() =>
                  setActiveCategories(allCategoriesActive ? [] : categoryEntries.map(([category]) => category))
                }
              >
                {allCategoriesActive ? "Clear" : "All"}
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-7">
            {categoryEntries.map(([cat, meta]) => {
              const isActive = activeCategorySet.has(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggleCategory(cat)}
                  className="group flex min-h-10 min-w-[7rem] items-center justify-start gap-2 rounded-full border !px-3 !py-2 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3e1da]/30 sm:min-w-0"
                  style={{
                    borderColor: isActive ? `${meta.color}70` : "rgba(227,225,218,0.1)",
                    backgroundColor: isActive ? `${meta.color}14` : "rgba(227,225,218,0.035)",
                    color: isActive ? "#f2f0ea" : "rgba(227,225,218,0.42)",
                  }}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: isActive ? `${meta.color}24` : "rgba(227,225,218,0.08)",
                      color: isActive ? meta.color : "rgba(227,225,218,0.32)",
                      boxShadow: isActive ? `0 0 12px ${meta.glow}` : "none",
                    }}
                  >
                    <AttractionIcon category={cat} size={16} />
                  </span>
                  <span className="font-sans !text-[0.48rem] font-black uppercase tracking-[0.19em]">
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {visibleAttractions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-1/2 top-1/2 z-20 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[1rem] border border-[#e3e1da]/12 bg-[#10110F]/86 !p-5 text-center shadow-[0_26px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
          >
            <p className="!mb-2 font-sans !text-[0.55rem] font-black uppercase !tracking-[0.26em] !text-[#e3e1da]/62">
              No types selected
            </p>
            <button
              type="button"
              className="font-sans !text-[0.55rem] font-black uppercase !tracking-[0.22em] !text-[#e3e1da] underline decoration-[#e3e1da]/24 underline-offset-4"
              onClick={() => setActiveCategories(categoryEntries.map(([category]) => category))}
            >
              Restore legend
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
