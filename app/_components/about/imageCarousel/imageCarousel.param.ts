export type ImageCarouselEntry = {
  title: string;
  description: string;
  image: string;
  link: string;
  location?: ImageCarouselLocation;
};

export type ImageCarouselLocation = {
  description: string;
  mapsLink: string;
};
