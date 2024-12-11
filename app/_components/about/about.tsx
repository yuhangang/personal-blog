"use client";

import { NavbarSpacer } from "../common/constraint";
import { Spacer } from "../common/layout/center";
import { Container, Main } from "../common/sharedstyles";
import SEO, {
  aboutCarouselSlides,
  bioBrief,
  timelineItems,
} from "./about.config";
import Bio from "./bio/bio";
import ImageCarousel from "./imageCarousel/imageCarousel";
import TimeLine from "./timeline/timeline";

export default function Home() {
  return (
    <Container>
      <SEO />
      <Main>
        {/* <NavBar/> */}
        <ImageCarousel slides={aboutCarouselSlides} />
        <section id="about">
          <NavbarSpacer />

          <Bio {...bioBrief} />
        </section>
        <Spacer size={32} />
        <TimeLine title="My Journey" items={timelineItems} />
        <Spacer size={32} />
      </Main>
    </Container>
  );
}
