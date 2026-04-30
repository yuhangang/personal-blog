import ThreeHero from "@/components/home/ThreeHero/ThreeHero";

import ServiceIntro from "@/components/create/ServiceIntro/ServiceIntro";
// [Removed unused HomeSlogan]
import About from "@/components/home/About/About";
import HomeGallery from "@/components/home/HomeGallery/HomeGallery";

export default function Home() {
  return (
    <main>
      <div id="home" data-theme="dark">
        <ThreeHero />
      </div>

      <div data-theme="dark">
        <About />
      </div>

      <HomeGallery />

      {/* New Compact Slogans */}
      <div id="identity" data-theme="dark">
        <ServiceIntro
          ctaText="Explore Creation"
          ctaLink="/create"
          variant="fullscreen"
          title="Software  Development"
          description="I built website and applications, every detail reflects who you are and what you stand for. Opening for new projects and collaborations"
        />
      </div>
    </main>
  );
}
