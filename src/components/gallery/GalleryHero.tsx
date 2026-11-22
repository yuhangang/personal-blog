import type { GalleryChapter } from "@/config/gallery";
import styles from "./GalleryHero.module.scss";

interface GalleryHeroProps {
  locations: GalleryChapter[];
}

export default function GalleryHero({ locations }: GalleryHeroProps) {
  return (
    <header
      id="editorial-lead"
      className={styles.hero}
      aria-labelledby="gallery-hero-heading"
    >
      <div className={styles.inner}>
        <p className={styles.kicker}>Photography · Archive</p>

        <h1 id="gallery-hero-heading" className={styles.title}>
          Visual <em>Index.</em>
        </h1>

        <p className={styles.subtitle}>
          Selected photographs and visual essays anchored to where they were
          taken.
        </p>

        {locations.length > 0 && (
          <div className={styles.locationsRow}>
            <span className={styles.locationsLabel}>Locations</span>
            <ul className={styles.locationsList}>
              {locations.map((chapter) => (
                <li key={chapter.id} className={styles.locationItem}>
                  {chapter.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
