"use client";

import React, { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COASTAL_LOCATIONS, CoastalLocation } from "../../app/pantai-timor/data";

interface CoastalMapProps {
  onImageClick?: (src: string) => void;
}

const EAST_COAST_BOUNDS: [[number, number], [number, number]] = [
  [101.22, 3.92],
  [104.48, 6.72],
];

export default function CoastalMap({ onImageClick }: CoastalMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="pantai-coastal-map w-full h-full relative group bg-[#12130f]">
      <style>{`
        .pantai-coastal-map .maplibregl-ctrl-top-right {
          top: 1rem;
          right: 1rem;
        }

        .pantai-coastal-map .maplibregl-ctrl-group {
          overflow: hidden;
          border-radius: 0;
          border: 1px solid rgba(227, 225, 218, 0.16);
          background: rgba(16, 17, 15, 0.78);
          box-shadow: none;
          backdrop-filter: blur(18px);
        }

        .pantai-coastal-map .maplibregl-ctrl button {
          width: 2.6rem;
          height: 2.6rem;
          background-color: transparent;
          color: #e3e1da;
        }

        .pantai-coastal-map .maplibregl-ctrl button:hover {
          background-color: rgba(227, 225, 218, 0.12);
        }

        .pantai-coastal-map .maplibregl-ctrl button + button {
          border-top: 1px solid rgba(227, 225, 218, 0.12);
        }

        .pantai-coastal-map .maplibregl-ctrl-icon {
          filter: invert(92%) sepia(9%) saturate(188%) hue-rotate(4deg) brightness(96%);
        }

        .pantai-coastal-map .maplibregl-ctrl-attrib {
          display: none;
        }

        .pantai-coastal-map .maplibregl-cooperative-gestures-screen {
          background: rgba(16, 17, 15, 0.7) !important;
          backdrop-filter: blur(8px);
          color: #e3e1da !important;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-size: 0.65rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          line-height: 1.8;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.6s ease, visibility 0.6s ease;
          pointer-events: none;
          z-index: 10;
        }

        .pantai-coastal-map:hover .maplibregl-cooperative-gestures-screen {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
      <Map
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
      >
        <NavigationControl position="top-right" showCompass={false} />
        
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
                  color: hoveredLocation === loc.name ? "#f2f0ea" : "#e3e1da"
                }}
                className="flex items-center justify-center"
              >
                <div className="w-5 h-5 bg-[#e3e1da] border border-[#10110F] shadow-[0_0_0_6px_rgba(227,225,218,0.08),0_18px_34px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#10110F]" />
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
                        <img 
                          src={loc.image} 
                          alt={loc.imageAlt || loc.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
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
      </Map>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_68%_42%,transparent_0,rgba(16,17,15,0.02)_32%,rgba(16,17,15,0.34)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 pointer-events-none flex items-end justify-between gap-6 !p-5 md:!p-7">
        <div className="border border-[#e3e1da]/10 bg-[#10110F]/72 !px-4 !py-3 backdrop-blur-xl">
          <p className="!mb-0 font-sans !text-[0.55rem] font-black uppercase !tracking-[0.24em] !text-[#e3e1da]/48">
            Kelantan / Terengganu
          </p>
        </div>
       
      </div>
      
      <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[#e3e1da]/10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#e3e1da]/10 pointer-events-none" />
    </div>
  );
}
