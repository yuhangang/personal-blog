import { GALLERY_MAP_PHOTOS, type GalleryMapPhoto } from "@/config/gallery";

/**
 * The route reads as a drive down the east coast, north to south: a prologue,
 * then four chapters by place. Chapters hold the photographs the archive marks
 * as featured; place names and coordinates come from the geotagged archive in
 * `@/config/gallery`, so nothing here restates a location by hand.
 */

export type StoryChapterId = "bachok" | "besut-setiu" | "kuala-terengganu" | "dungun";

export interface StoryPlate {
  /** Position in the lightbox sequence (story order). */
  index: number;
  src: string;
  thumb: string;
  alt: string;
  /** Width over height of the photograph, so plates are never cropped. */
  ratio: number;
  /** Plain place name for the caption, e.g. "Pantai Irama, Bachok". */
  caption: string;
  /** Archive frame code, e.g. "PT · 19". */
  frameCode: string;
  placeName: string;
  lat: number;
  lng: number;
}

export interface StoryChapter {
  id: StoryChapterId;
  numeral: string;
  title: string;
  region: string;
  /** Plates grouped into rows: one plate is a wide frame, two share a row. */
  rows: StoryPlate[][];
  /** Straight-line km from the previous chapter's last frame; null for the first. */
  kmFromPrevious: number | null;
}

const CDN = "https://cdn.yuhangang.com/pantai-timor/";

// North to south within each chapter, so the whole sequence keeps heading
// down the coast. Rows are [wide] or [left, right].
const CHAPTER_LAYOUT: {
  id: StoryChapterId;
  numeral: string;
  title: string;
  region: string;
  rows: string[][];
}[] = [
  {
    id: "bachok",
    numeral: "I",
    title: "Bachok",
    region: "Kelantan",
    rows: [["DSC00756_2.JPG"], ["DSC00854.JPG", "DSC00649.JPG"], ["DSC00710.JPG"]],
  },
  {
    id: "besut-setiu",
    numeral: "II",
    title: "Besut & Setiu",
    region: "Terengganu",
    rows: [["DSC00032.jpg", "DSC08014.jpg"]],
  },
  {
    id: "kuala-terengganu",
    numeral: "III",
    title: "Kuala Terengganu",
    region: "Terengganu",
    rows: [["DSC00052.jpg"], ["DSC01109.jpg", "DSC08133_1.jpg"]],
  },
  {
    id: "dungun",
    numeral: "IV",
    title: "Dungun",
    region: "Terengganu",
    rows: [["DSC07670_1.jpg", "DSC08235.jpg"], ["DSC07665_1.jpg"]],
  },
];

// Most frames are the camera's 3:2; these were shot or cropped otherwise.
const PLATE_RATIOS: Record<string, number> = {
  "DSC08014.jpg": 3 / 4,
  "DSC07665_1.jpg": 1500 / 843,
};

const photoBySrc = new Map<string, GalleryMapPhoto>(
  GALLERY_MAP_PHOTOS.map((photo) => [photo.image, photo])
);

const findPhoto = (file: string) => {
  const photo = photoBySrc.get(`${CDN}${file}`);
  if (!photo) throw new Error(`Pantai Timor story: no archive photo for ${file}`);
  return photo;
};

// Haversine distance, rounded to 5 km: these are markers, not directions.
const kmBetween = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  const km = 2 * 6371 * Math.asin(Math.sqrt(h));
  return Math.max(5, Math.round(km / 5) * 5);
};

let plateIndex = 0;

const chaptersWithoutDistance = CHAPTER_LAYOUT.map((chapter) => ({
  id: chapter.id,
  numeral: chapter.numeral,
  title: chapter.title,
  region: chapter.region,
  rows: chapter.rows.map((row) =>
    row.map((file): StoryPlate => {
      const photo = findPhoto(file);
      return {
        index: plateIndex++,
        src: photo.image,
        thumb: photo.thumb,
        alt: `Photograph at ${photo.placeName}, ${photo.region}`,
        ratio: PLATE_RATIOS[file] ?? 3 / 2,
        caption: photo.placeName.replace(" · ", ", "),
        frameCode: photo.frameCode,
        placeName: photo.placeName,
        lat: photo.lat,
        lng: photo.lng,
      };
    })
  ),
}));

export const STORY_CHAPTERS: StoryChapter[] = chaptersWithoutDistance.map((chapter, i) => {
  const previous = chaptersWithoutDistance[i - 1];
  const previousPlate = previous?.rows.at(-1)?.at(-1);
  const firstPlate = chapter.rows[0][0];
  return {
    ...chapter,
    kmFromPrevious: previousPlate ? kmBetween(previousPlate, firstPlate) : null,
  };
});

/** Every plate in story order: the viewer and its contact sheet use these. */
export const STORY_PLATES: StoryPlate[] = STORY_CHAPTERS.flatMap((chapter) => chapter.rows.flat());
