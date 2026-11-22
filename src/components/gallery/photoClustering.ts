import type { GalleryMapPhoto } from "@/config/gallery";

export interface PhotoSpot {
  id: string;
  lat: number;
  lng: number;
  placeName: string;
  region: string;
  photos: GalleryMapPhoto[];
  coverPhoto: GalleryMapPhoto;
  hasFeatured: boolean;
}

export interface PhotoCluster {
  id: string;
  lat: number;
  lng: number;
  label: string;
  subLabel: string;
  photos: GalleryMapPhoto[];
  spots: PhotoSpot[];
  coverPhoto: GalleryMapPhoto;
  isMultiSpot: boolean;
  hasActivePhoto: boolean;
}

export function groupPhotosBySpot(photos: GalleryMapPhoto[]): PhotoSpot[] {
  const buckets = new Map<string, GalleryMapPhoto[]>();

  for (const photo of photos) {
    const key = `${photo.lat.toFixed(5)},${photo.lng.toFixed(5)}`;
    const list = buckets.get(key);
    if (list) {
      list.push(photo);
    } else {
      buckets.set(key, [photo]);
    }
  }

  return Array.from(buckets.entries()).map(([key, spotPhotos]) => {
    const coverPhoto =
      spotPhotos.find((photo) => photo.featured) ?? spotPhotos[0];

    return {
      id: key,
      lat: coverPhoto.lat,
      lng: coverPhoto.lng,
      placeName: coverPhoto.placeName,
      region: coverPhoto.region,
      photos: spotPhotos,
      coverPhoto,
      hasFeatured: spotPhotos.some((photo) => photo.featured),
    };
  });
}

function getClusterRadiusPx(zoom: number): number {
  if (zoom < 4.5) return 108;
  if (zoom < 7.2) return 84;
  if (zoom < 9.8) return 72;
  if (zoom < 12.2) return 58;
  if (zoom < 13.6) return 40;
  return 0;
}

function isOnVisibleHemisphere(
  lng: number,
  lat: number,
  centerLng: number,
  centerLat: number,
  zoom: number,
): boolean {
  if (zoom >= 5.5) return true;

  const degToRad = Math.PI / 180;
  const lat1 = lat * degToRad;
  const lng1 = lng * degToRad;
  const lat2 = centerLat * degToRad;
  const lng2 = centerLng * degToRad;

  const dot =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng1 - lng2);

  return dot > 0.12;
}

export function clusterPhotoSpots(params: {
  spots: PhotoSpot[];
  zoom: number;
  center: { lng: number; lat: number };
  viewport: { width: number; height: number };
  project: (lngLat: [number, number]) => { x: number; y: number };
  activePhotoId: string | null;
}): PhotoCluster[] {
  const { spots, zoom, center, viewport, project, activePhotoId } = params;
  const radius = getClusterRadiusPx(zoom);
  const pad = 160;

  const projected: Array<{
    spot: PhotoSpot;
    x: number;
    y: number;
    hasActive: boolean;
  }> = [];

  for (const spot of spots) {
    if (!isOnVisibleHemisphere(spot.lng, spot.lat, center.lng, center.lat, zoom)) {
      continue;
    }

    const pt = project([spot.lng, spot.lat]);
    if (!Number.isFinite(pt.x) || !Number.isFinite(pt.y)) {
      continue;
    }

    if (
      pt.x < -pad ||
      pt.y < -pad ||
      pt.x > viewport.width + pad ||
      pt.y > viewport.height + pad
    ) {
      continue;
    }

    projected.push({
      spot,
      x: pt.x,
      y: pt.y,
      hasActive: activePhotoId
        ? spot.photos.some((p) => p.id === activePhotoId)
        : false,
    });
  }

  // Prioritize active spot, then featured spots, then multi-photo spots
  projected.sort((a, b) => {
    if (a.hasActive !== b.hasActive) return a.hasActive ? -1 : 1;
    if (a.spot.hasFeatured !== b.spot.hasFeatured) {
      return a.spot.hasFeatured ? -1 : 1;
    }
    return b.spot.photos.length - a.spot.photos.length;
  });

  const clusters: Array<{
    anchorX: number;
    anchorY: number;
    spots: PhotoSpot[];
  }> = [];

  for (const item of projected) {
    if (radius === 0) {
      clusters.push({
        anchorX: item.x,
        anchorY: item.y,
        spots: [item.spot],
      });
      continue;
    }

    let matched: (typeof clusters)[number] | null = null;
    let bestDistSq = radius * radius;

    for (const cluster of clusters) {
      const dx = item.x - cluster.anchorX;
      const dy = item.y - cluster.anchorY;
      const distSq = dx * dx + dy * dy;
      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        matched = cluster;
      }
    }

    if (matched) {
      matched.spots.push(item.spot);
    } else {
      clusters.push({
        anchorX: item.x,
        anchorY: item.y,
        spots: [item.spot],
      });
    }
  }

  return clusters.map((cluster) => {
    const allPhotos = cluster.spots.flatMap((s) => s.photos);
    const activeMatch = activePhotoId
      ? allPhotos.find((p) => p.id === activePhotoId)
      : undefined;
    const coverPhoto =
      activeMatch ??
      allPhotos.find((p) => p.featured) ??
      cluster.spots[0].coverPhoto;

    // Anchor on the cover spot if multi-spot, or exact average? Using coverPhoto's
    // coordinate keeps the pin planted on a real photo site instead of floating in the ocean.
    const isMultiSpot = cluster.spots.length > 1;
    const uniqueRegions = Array.from(
      new Set(cluster.spots.map((s) => s.region)),
    );

    const label = isMultiSpot
      ? uniqueRegions.length === 1
        ? zoom < 6.2
          ? uniqueRegions[0]
          : coverPhoto.placeName
        : `${uniqueRegions.length} Regions`
      : coverPhoto.placeName;

    const subLabel =
      allPhotos.length === 1
        ? coverPhoto.frameCode
        : `${allPhotos.length} frames`;

    return {
      id: cluster.spots.map((s) => s.id).join("|"),
      lat: coverPhoto.lat,
      lng: coverPhoto.lng,
      label,
      subLabel,
      photos: allPhotos,
      spots: cluster.spots,
      coverPhoto,
      isMultiSpot,
      hasActivePhoto: Boolean(activeMatch),
    };
  });
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir} · ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

export interface PhotoBounds {
  centerLng: number;
  centerLat: number;
  sw: [number, number];
  ne: [number, number];
  isPoint: boolean;
}

export function computePhotoBounds(photos: GalleryMapPhoto[]): PhotoBounds | null {
  if (photos.length === 0) return null;

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const photo of photos) {
    if (photo.lng < minLng) minLng = photo.lng;
    if (photo.lng > maxLng) maxLng = photo.lng;
    if (photo.lat < minLat) minLat = photo.lat;
    if (photo.lat > maxLat) maxLat = photo.lat;
  }

  return {
    centerLng: (minLng + maxLng) / 2,
    centerLat: (minLat + maxLat) / 2,
    sw: [minLng, minLat],
    ne: [maxLng, maxLat],
    isPoint: maxLng - minLng < 0.005 && maxLat - minLat < 0.005,
  };
}
