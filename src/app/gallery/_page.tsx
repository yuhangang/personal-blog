import type { Metadata } from "next";
import { GALLERY_CHAPTERS, GALLERY_PROJECTS } from "@/config/gallery";
import GalleryHero from "@/components/gallery/GalleryHero";
import EarthGalleryMap from "@/components/gallery/EarthGalleryMap";
import CollectionCard from "@/components/gallery/CollectionCard";
import styles from "./gallery.module.scss";

export const metadata: Metadata = {
  title: "Gallery | Yu Hang Ang",
  description: "Interactive photo map and galleries by Yu Hang Ang.",
};

const FEATURED_LOCATIONS = GALLERY_CHAPTERS.filter(
  (chapter) => chapter.id !== "all" && chapter.id !== "orbit",
);

export default function GalleryPage() {
  return (
    <main className={styles.page} data-theme="dark">
      <GalleryHero locations={FEATURED_LOCATIONS} />

      <section id="map-atlas" className={styles.mapSection}>
        <div className={styles.mapFrame}>
          <EarthGalleryMap />
        </div>
      </section>

      <section
        id="collections-index"
        className={styles.collectionsSection}
        aria-labelledby="collections-heading"
      >
        <div className={styles.sectionHeader}>
          <p className={styles.sectionKicker}>02 · Collections</p>
          <h2 id="collections-heading" className={styles.sectionTitle}>
            Selected <em>Series.</em>
          </h2>
          <p className={styles.sectionCopy}>
            Long-form photographic essays and visual stories from the archive.
          </p>
        </div>

        <div className={styles.bandsStack}>
          {GALLERY_PROJECTS.map((project, index) => (
            <CollectionCard
              key={project.id}
              {...project}
              index={index}
              variant="band"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
