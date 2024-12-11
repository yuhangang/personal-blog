import React from "react";
import InfiniteGallery from "./gallery";
import styles from "./galleryPage.module.scss";

export default function Gallery(): JSX.Element {
  return (
    <main className={styles.galleryMain}>
      <InfiniteGallery />
      <nav className={styles.galleryNavbar}>
        <div>Gallery</div>
        <div className={styles.galleryNavbarIcon}>🌙</div>
      </nav>
    </main>
  );
}
