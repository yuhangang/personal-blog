export interface GalleryProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
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
      "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08235.jpg",
    href: "/pantai-timor",
    cta: "Open Gallery",
    location: "East Coast, Malaysia",
    year: "2026",
  },
];
