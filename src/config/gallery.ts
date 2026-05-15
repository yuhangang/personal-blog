export interface GalleryProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  video?: string;
  href: string;
  cta: string;
  location: string;
  year: string;
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "pantai-timor",
    title: "Pantai Timor",
    category: "Photographic Editorial",
    description:
      "Documenting the soul of the East Coast through maritime heritage, village rhythms, and coastal light.",
    image:
      "https://cdn.yuhangang.com/pantai-timor/DSC00552.JPG",
    video: "https://cdn.yuhangang.com/pantai-timor/cover.mp4",
    href: "/pantai-timor",
    cta: "Open Gallery",
    location: "East Coast, Malaysia",
    year: "2026",
  },
];
