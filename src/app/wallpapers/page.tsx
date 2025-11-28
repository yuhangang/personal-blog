import React from 'react';
import InfiniteCanvas from '@/components/InfiniteCanvas/InfiniteCanvas';
import styles from './page.module.scss';

export const metadata = {
  title: 'Wallpapers | Yu Hang Ang',
  description: 'An infinite collection of high-quality, immersive wallpapers.',
};

export default function WallpapersPage() {
  return (
    <main className={styles.main}>
      <div className={styles.overlayUI}>
        <h1 className={styles.title}>Infinite Wall</h1>
        <p className={styles.subtitle}>Drag to explore</p>
      </div>
      
      <InfiniteCanvas />
    </main>
  );
}
