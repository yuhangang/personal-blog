import ThreeHero from '@/components/ThreeHero/ThreeHero';
import HomePortfolio from '@/components/HomePortfolio/HomePortfolio';
import About from '@/components/About/About';
import BlogGrid from '@/components/BlogGrid/BlogGrid';

export default function Home() {
  return (
    <main>
      <div data-theme="dark">
        <ThreeHero />
      </div>
      <div data-theme="light">
        <HomePortfolio />
      </div>
      <div data-theme="light">
        <About />
      </div>
      <div data-theme="light">
          <BlogGrid />
      </div>
    </main>
  );
}