import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
};

import CreateHero from "@/components/create/CreateHero/CreateHero";
import SloganScroll from "@/components/create/SloganScroll/SloganScroll";
import CreateServices from "@/components/create/CreateServices/CreateServices";
import Portfolio from "@/components/create/Portfolio/Portfolio";
import CreateContact from "@/components/create/CreateContact/CreateContact";

export const metadata: Metadata = {
  title: "Portfolio | Yu Hang Ang",
  description:
    "Showcase of my projects involving AI, web development, and design.",
};

export default function PortfolioPage() {
  return (
    <main>
      {/* Dark theme hero section */}
      <div data-theme="dark">
        <CreateHero />
        <SloganScroll />
      </div>
      {/* Light theme projects and services sections */}
      <div data-theme="dark">
        <Portfolio />
      </div>
      <div data-theme="dark">
        <CreateServices />
      </div>
      {/* Contact section */}
      <div data-theme="dark">
        <CreateContact />
      </div>
    </main>
  );
}
