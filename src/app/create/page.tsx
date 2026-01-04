import { Metadata, Viewport } from 'next';
import Link from 'next/link';

export const viewport: Viewport = {
  themeColor: '#000000',
};
import Image from 'next/image';
import styles from '@/components/create/Portfolio/Portfolio.module.scss';
import CreateHero from '@/components/create/CreateHero/CreateHero';
import SloganScroll from '@/components/create/SloganScroll/SloganScroll';
import CreateServices from '@/components/create/CreateServices/CreateServices';

export const metadata: Metadata = {
  title: 'Portfolio | Yu Hang Ang',
  description: 'Showcase of my projects involving AI, web development, and design.',
};


import Portfolio from '@/components/create/Portfolio/Portfolio';
import CreateContact from '@/components/create/CreateContact/CreateContact';

export default function PortfolioPage() {
  return (
    <main className={styles.container}>
      <div data-theme="dark">
        <CreateHero />
        <SloganScroll />
      </div>
      
      <div data-theme="dark" className={styles.contentWrapper}>
          <div className={styles.gridHeader}>
              <h2>Projects</h2>
          </div>
          
          <Portfolio />
    
          <CreateServices />
      </div>
     <div data-theme="light">
      <CreateContact />
    </div>
    </main>
  );
}
