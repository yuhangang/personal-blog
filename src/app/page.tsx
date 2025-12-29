import ThreeHero from '@/components/home/ThreeHero/ThreeHero';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#ffffff',
};
import HomePortfolio from '@/components/home/HomePortfolio/HomePortfolio';
import HomeSlogan from '@/components/home/HomeSlogan/HomeSlogan';
import About from '@/components/home/About/About';


export default function Home() {
  return (
    <main>
      <div data-theme="dark">
        <ThreeHero />
      </div>
       <div data-theme="dark">
        <About />
      </div>
      
      {/* New Compact Slogans */}
      <div data-theme="dark">
         <HomeSlogan />
      </div>

      <div data-theme="dark">
        <HomePortfolio />
      </div>
     

    </main>
  );
}