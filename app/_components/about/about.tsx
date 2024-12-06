"use client";
import Head from "next/head";
import { Container, Main } from "../sharedstyles";
import Navbar from "../common/navbar/navbar";
import ImageCarousel from "./imageCarousel/imageCarousel";
import { NavbarSpacer } from "../common/constraint";
import { Spacer } from "../common/layout/center";
import TimeLine from "./timeline/timeline";
import Bio from "./bio/bio";
import SEO, {
  aboutCarouselSlides,
  bioBrief,
  timelineItems,
} from "./about.config";

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
