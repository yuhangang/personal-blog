"use client";

import React from "react";
import { Marker } from "react-map-gl/maplibre";
import { formatCoordinates, type PhotoCluster } from "./photoClustering";
import styles from "./PhotoLabelMarker.module.scss";

interface PhotoLabelMarkerProps {
  cluster: PhotoCluster;
  onActivate: (cluster: PhotoCluster) => void;
  onHoverChange?: (clusterId: string | null) => void;
}

export default function PhotoLabelMarker({
  cluster,
  onActivate,
  onHoverChange,
}: PhotoLabelMarkerProps) {
  const { coverPhoto, photos, isMultiSpot, hasActivePhoto } = cluster;
  const count = photos.length;
  const isStacked = count > 1;
  const shortPlace = cluster.label.split("·")[0].trim();

  const ariaLabel = isMultiSpot
    ? `${cluster.label}, ${count} photographs. Activate to zoom into this area.`
    : `${coverPhoto.placeName}, ${count === 1 ? "1 photograph" : `${count} photographs`}. Activate to open viewer.`;

  return (
    <Marker
      longitude={cluster.lng}
      latitude={cluster.lat}
      anchor="bottom"
      style={{ zIndex: hasActivePhoto ? 24 : isStacked ? 6 : 4 }}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        className={`${styles.markerRoot} ${
          !isStacked && coverPhoto.isPortrait ? styles.isPortrait : ""
        } ${hasActivePhoto ? styles.isActive : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onActivate(cluster);
        }}
        onMouseEnter={() => onHoverChange?.(cluster.id)}
        onMouseLeave={() => onHoverChange?.(null)}
        onFocus={() => onHoverChange?.(cluster.id)}
        onBlur={() => onHoverChange?.(null)}
      >
        <div className={styles.hoverCard} aria-hidden="true">
          <p className={styles.hoverMeta}>
            {formatCoordinates(cluster.lat, cluster.lng)}
          </p>
          <p className={styles.hoverTitle}>{cluster.label}</p>
          <p className={styles.hoverHint}>
            {isMultiSpot
              ? `${count} photos · Zoom in`
              : count > 1
                ? `${count} photos · Open`
                : `${coverPhoto.frameCode} · Open`}
          </p>
        </div>

        <div className={styles.frameStack}>
          {isStacked && (
            <>
              <span className={styles.stackLayerOne} aria-hidden="true" />
              {count > 2 && (
                <span className={styles.stackLayerTwo} aria-hidden="true" />
              )}
            </>
          )}

          <div className={styles.frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPhoto.thumb}
              alt={coverPhoto.alt}
              className={styles.thumb}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>

          {isStacked && (
            <span className={styles.countBadge} aria-hidden="true">
              {count}
            </span>
          )}
        </div>

        <div className={styles.captionPill}>
          <span className={styles.placeLabel}>{shortPlace}</span>
        </div>

        <span className={styles.stem} aria-hidden="true" />
        <span className={styles.anchorDot} aria-hidden="true" />
      </button>
    </Marker>
  );
}
