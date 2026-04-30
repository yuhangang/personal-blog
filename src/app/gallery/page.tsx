import type { Metadata } from "next";
import { GALLERY_PROJECTS } from "@/config/gallery";
import GalleryHero from "@/components/gallery/GalleryHero";
import CollectionCard from "@/components/gallery/CollectionCard";
import styles from "./gallery.module.scss";

export const metadata: Metadata = {
  title: "Gallery | Yu Hang Ang",
  description: "Photographic galleries and visual stories by Yu Hang Ang.",
};

export default function GalleryPage() {
  return (
    <main className={styles.page} data-theme="dark">
      <div className={styles.backgroundLayer} />
      <GalleryHero />

      <section className={styles.galleryGrid} aria-label="Gallery collections">
        <div className={styles.gridContainer}>
          {GALLERY_PROJECTS.map((project, index) => (
            <CollectionCard 
              key={project.id} 
              {...project} 
              index={index}
              size={index % 3 === 0 ? 'large' : 'medium'}
            />
          ))}
          
        </div>
      </section>
    </main>
  );
}
