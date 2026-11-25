import {
  CAROUSEL_IMAGES,
  COASTAL_LOCATIONS,
  getThumbnailUrl,
} from "@/app/pantai-timor/config";

export interface GalleryProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  video?: string;
  /**
   * Black bars baked into each side of `video`, as a share of its width
   * (e.g. 100 / 1280). The card crops them off so only the picture shows.
   */
  videoPillarbox?: number;
  href: string;
  cta: string;
  location: string;
  year: string;
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "pantai-timor",
    title: "Pantai Timor",
    category: "Photography",
    description: "Photographs from Malaysia's east coast.",
    image: "https://cdn.yuhangang.com/pantai-timor/DSC00552.JPG",
    video: "https://cdn.yuhangang.com/pantai-timor/cover.mp4",
    // cover.mp4 is 1280×720 with a 1080×720 (3:2) picture: 100px of black
    // each side for the whole clip.
    videoPillarbox: 100 / 1280,
    href: "/pantai-timor",
    cta: "Open Gallery",
    location: "East Coast, Malaysia",
    year: "2026",
  },
];

export type GalleryChapterId =
  | "all"
  | "orbit"
  | "bachok"
  | "besut-setiu"
  | "kuala-terengganu"
  | "dungun";

export interface GalleryChapter {
  id: GalleryChapterId;
  label: string;
  shortLabel: string;
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export const GALLERY_CHAPTERS: GalleryChapter[] = [
  {
    id: "all",
    label: "All Locations",
    shortLabel: "All",
    lng: 102.92,
    lat: 5.46,
    zoom: 7.45,
    pitch: 44,
    bearing: -16,
  },
  {
    id: "orbit",
    label: "Globe Orbit",
    shortLabel: "Orbit",
    lng: 103.5,
    lat: 5.15,
    zoom: 2.75,
    pitch: 14,
    bearing: -6,
  },
  {
    id: "bachok",
    label: "Bachok · Kelantan",
    shortLabel: "Bachok",
    lng: 102.426,
    lat: 6.006,
    zoom: 11.8,
    pitch: 52,
    bearing: 16,
  },
  {
    id: "besut-setiu",
    label: "Besut & Setiu",
    shortLabel: "Besut",
    lng: 102.71,
    lat: 5.71,
    zoom: 10.1,
    pitch: 48,
    bearing: -22,
  },
  {
    id: "kuala-terengganu",
    label: "Kuala Terengganu",
    shortLabel: "K. Terengganu",
    lng: 103.13,
    lat: 5.33,
    zoom: 10.6,
    pitch: 50,
    bearing: -28,
  },
  {
    id: "dungun",
    label: "Rantau Abang · Dungun",
    shortLabel: "Dungun",
    lng: 103.38,
    lat: 4.89,
    zoom: 11.1,
    pitch: 52,
    bearing: -18,
  },
];

export interface GalleryMapPhoto {
  id: string;
  index: number;
  frameCode: string;
  title: string;
  placeName: string;
  region: "Kelantan" | "Terengganu";
  chapterId: Exclude<GalleryChapterId, "all" | "orbit">;
  lat: number;
  lng: number;
  image: string;
  thumb: string;
  alt: string;
  description: string;
  featured: boolean;
  isPortrait: boolean;
  collectionId: string;
  collectionTitle: string;
  collectionHref: string;
}

function resolvePlaceMeta(lat: number): {
  placeName: string;
  region: "Kelantan" | "Terengganu";
  chapterId: Exclude<GalleryChapterId, "all" | "orbit">;
} {
  if (lat >= 6.026) {
    return {
      placeName: "Pantai Irama · Bachok",
      region: "Kelantan",
      chapterId: "bachok",
    };
  }
  if (lat >= 5.96) {
    return {
      placeName: "Pantai Melawi · Bachok",
      region: "Kelantan",
      chapterId: "bachok",
    };
  }
  if (lat >= 5.8) {
    return {
      placeName: "Kuala Besut",
      region: "Terengganu",
      chapterId: "besut-setiu",
    };
  }
  if (lat >= 5.7) {
    return {
      placeName: "Bukit Keluang · Besut",
      region: "Terengganu",
      chapterId: "besut-setiu",
    };
  }
  if (lat >= 5.58) {
    return {
      placeName: "Pantai Penarik · Setiu",
      region: "Terengganu",
      chapterId: "besut-setiu",
    };
  }
  if (lat >= 5.38) {
    return {
      placeName: "Mengabang Telipot",
      region: "Terengganu",
      chapterId: "kuala-terengganu",
    };
  }
  if (lat >= 5.26) {
    return {
      placeName: "Kuala Terengganu",
      region: "Terengganu",
      chapterId: "kuala-terengganu",
    };
  }
  if (lat >= 5.15) {
    return {
      placeName: "Marang Coast",
      region: "Terengganu",
      chapterId: "kuala-terengganu",
    };
  }
  if (lat >= 4.9) {
    return {
      placeName: "Rantau Abang",
      region: "Terengganu",
      chapterId: "dungun",
    };
  }
  return {
    placeName: "Kuala Dungun",
    region: "Terengganu",
    chapterId: "dungun",
  };
}

const portraitBySrc = new Map<string, boolean>(
  CAROUSEL_IMAGES.map((item) => [item.src, Boolean(item.isPortrait)]),
);

export const GALLERY_MAP_PHOTOS: GalleryMapPhoto[] = COASTAL_LOCATIONS.filter(
  (loc): loc is typeof loc & { image: string } => Boolean(loc.image),
).map((loc, index) => {
  const place = resolvePlaceMeta(loc.lat);
  const num = String(index + 1).padStart(2, "0");

  return {
    id: `pt-${num}`,
    index,
    frameCode: `PT · ${num}`,
    title: loc.name,
    placeName: place.placeName,
    region: place.region,
    chapterId: place.chapterId,
    lat: loc.lat,
    lng: loc.lng,
    image: loc.image,
    thumb: getThumbnailUrl(loc.image),
    alt: loc.imageAlt || `${place.placeName} photograph`,
    description: loc.description.startsWith("A frozen whisper of the monsoon")
      ? ""
      : loc.description,
    featured: Boolean(loc.featured),
    isPortrait: portraitBySrc.get(loc.image) ?? false,
    collectionId: "pantai-timor",
    collectionTitle: "Pantai Timor",
    collectionHref: "/pantai-timor",
  };
});
