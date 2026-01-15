import ThreeHero from "@/components/home/ThreeHero/ThreeHero";

import HomeSlogan from "@/components/home/HomeSlogan/HomeSlogan";
import About from "@/components/home/About/About";

export default function Home() {
  return (
    <main>
      <div id="home" data-theme="dark">
        <ThreeHero />
      </div>
      <div data-theme="dark">
        <About />
      </div>

      {/* New Compact Slogans */}
      <div id="identity" data-theme="dark">
        <HomeSlogan />
      </div>
    </main>
  );
}
