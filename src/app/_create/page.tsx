import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
};

import CreateContact from "@/components/create/CreateContact/CreateContact";
import CreateHero from "@/components/create/CreateHero/CreateHero";
import CreateServices from "@/components/create/CreateServices/CreateServices";
import ServiceIntro from "@/components/create/ServiceIntro/ServiceIntro";
import SloganScroll from "@/components/create/SloganScroll/SloganScroll";

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
   
       
        <SloganScroll />
      </div>
      {/* Light theme projects and services sections   <div data-theme="dark">
        <Portfolio />
      </div> */}

      <CreateServices />

      {/* Contact section */}
      <div data-theme="dark">
        <CreateContact />
      </div>
    </main>
  );
}
