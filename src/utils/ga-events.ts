import { sendGAEvent } from "@next/third-parties/google";

/**
 * Custom events for the Gallery projects
 */
export const GA_EVENTS = {
  LIGHTBOX_OPEN: "gallery_lightbox_open",
  LIGHTBOX_IMAGE_CHANGE: "gallery_lightbox_image_change",
  LIGHTBOX_TOGGLE_GRID: "gallery_lightbox_toggle_grid",
  LIGHTBOX_CLOSE: "gallery_lightbox_close",
  SECTION_VIEW: "gallery_section_view",
  CAROUSEL_INTERACT: "gallery_carousel_interact",
  NAV_CLICK: "gallery_nav_click",
  HERO_INTERACT: "gallery_hero_interact",
} as const;

type GAEventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Base tracking function
 */
export const trackGalleryEvent = (
  eventName: string, 
  project: string,
  eventParams?: GAEventParams
) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
    sendGAEvent({
      event: eventName,
      project,
      ...eventParams,
    });
  } else {
    console.log(`[GA Event] ${eventName}`, { project, ...eventParams });
  }
};

/**
 * Factory function to create project-specific trackers
 */
export const createProjectTracker = (project: string) => ({
  // Lightbox
  lightboxOpen: (index: number, src: string) => 
    trackGalleryEvent(GA_EVENTS.LIGHTBOX_OPEN, project, { image_index: index, image_src: src }),
  
  lightboxClose: () => 
    trackGalleryEvent(GA_EVENTS.LIGHTBOX_CLOSE, project),
  
  lightboxImageChange: (from: number, to: number, src: string) => 
    trackGalleryEvent(GA_EVENTS.LIGHTBOX_IMAGE_CHANGE, project, { from_index: from, to_index: to, image_src: src }),
  
  lightboxToggleGrid: (isGrid: boolean) => 
    trackGalleryEvent(GA_EVENTS.LIGHTBOX_TOGGLE_GRID, project, { is_grid: isGrid }),

  // Carousel
  carouselClickImage: (index: number, src: string) => 
    trackGalleryEvent(GA_EVENTS.CAROUSEL_INTERACT, project, { action: "click_image", image_index: index, image_src: src }),
  
  carouselViewArchive: () => 
    trackGalleryEvent(GA_EVENTS.CAROUSEL_INTERACT, project, { action: "view_all_archive" }),

  // Navigation
  navClick: (id: string) => 
    trackGalleryEvent(GA_EVENTS.NAV_CLICK, project, { label: id.toUpperCase(), section_id: id }),
  
  navMenuOpen: () => 
    trackGalleryEvent(GA_EVENTS.NAV_CLICK, project, { action: "open_menu" }),
  
  navMenuClose: () => 
    trackGalleryEvent(GA_EVENTS.NAV_CLICK, project, { action: "close_menu" }),

  // Hero
  heroInteract: (action: string) => 
    trackGalleryEvent(GA_EVENTS.HERO_INTERACT, project, { action }),
});

/**
 * Specialized tracking functions for Pantai Timor
 */
export const ptTrack = createProjectTracker("pantai-timor");
