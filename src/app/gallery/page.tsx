import type { Metadata } from "next";
import CinematicCover from "@/components/common/CinematicCover/CinematicCover";
import CollectionCard from "@/components/gallery/CollectionCard";
import { GALLERY_PROJECTS } from "@/config/gallery";
import { GALLERY_REEL } from "@/config/galleryReel";
import styles from "./gallery.module.scss";

export const metadata: Metadata = {
  title: "Gallery | Yu Hang Ang",
  description: "Photographs and films from the road by Yu Hang Ang.",
};

// The previous atlas layout is kept, unrouted, in _page.tsx.
export default function GalleryPage() {
  return (
    <main className={styles.page} data-theme="dark">
      <CinematicCover
        variant="cover"
        align="center"
        headlineSize="display"
        headlineColor="var(--retro-yellow)"
        sources={GALLERY_REEL.sources}
        poster={GALLERY_REEL.poster}
        headline="Gallery"
        subtitle="Photographs and films from the road."
      />

      <section
        id="collections-index"
        className={styles.collectionsSection}
        aria-labelledby="collections-heading"
      >
        <div className={styles.sectionHeader}>
          <p className={styles.sectionKicker}>Collections</p>
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
