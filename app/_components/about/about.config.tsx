import { desc } from "framer-motion/client";
import RetroList from "./timeline/components/RetroList.style";

import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Yu Hang Ang | Software Engineer",
  description = "26-year-old software engineer based in Kuala Lumpur, Malaysia. Experienced in mobile app development, open for new opportunities and collaborations.",
  image = "/images/profile.jpg",
}) => {
  const canonicalUrl = "https://yuhangang.com"; // Replace with actual portfolio URL

  return (
    <Head>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Additional Metadata */}
      <meta
        name="keywords"
        content="  software engineer, mobile developer, flutter, react, iOS, Android, Kuala Lumpur"
      />
      <meta name="author" content="Yu Hang Ang" />

      {/* Geo Metadata */}
      <meta name="geo.region" content="MY-KL" />
      <meta name="geo.placename" content="Kuala Lumpur" />
    </Head>
  );
};

export default SEO;

const bioBrief = {
  src: "/images/profile.jpg",
  name: "Yu Hang Ang",
  description: (
    <>
      26, software engineer based in Kuala Lumpur, Malaysia. Open for new
      opportunities for collaboration and learning.
    </>
  ),
};

const timelineItems = [
  {
    dateTime: "Mar 2023 - Now",
    title: "App Developer, Lumi News",
    detail: (
      <>
        <RetroList>
          <li>
            Actively engaged in product planning and contribute ideas in one of
            the most popular news apps in Malaysia, serving news and videos from
            various international publishers.
          </li>
          <li>
            Working closely with different stakeholders from drafting, design,
            development, testing, deployment, monitoring, and tracking.
          </li>
          <li>
            Develop highly interactive features and widgets to enhance users’
            news reading experience, such as embedded videos and social media
            posts in news, while ensuring the smoothness and stability of the
            application.
          </li>
          <li>
            HTML-based news reader containing embedded images, recommendations,
            videos, and social media posts.
          </li>
          <li>
            Experiment with new technologies, product ideas, and various
            improvements and optimizations of existing applications.
          </li>
          <li>
            Native IOS/Android home widget for displaying latest news on user
            device home screen
          </li>
        </RetroList>
      </>
    ),
  },
  {
    dateTime: "Feb 2022 - Feb 2023",
    title: "Software Engineer, Snappymob Sdn Bhd",
    detail: (
      <>
        <RetroList>
          <li>
            Working on MyAstro App, as part of a staff augmentation team for the
            client.
          </li>
          <li>Worked closely with various roles within the scrum team.</li>
          <li>
            Writing documentation unit tests and practicing peer code review, to
            ensure software quality.
          </li>
          <li>
            Engaged in development of new reward, inbox features and deep
            linking infrastructure
          </li>
          <li>Troubleshooting and refactor various features and modules.</li>
        </RetroList>
      </>
    ),
  },
  {
    dateTime: "Jan 2021 - Feb 2022",
    title: "Mobile Developer, Artisan IT Solutions",
    detail: (
      <>
        <RetroList>
          <li>
            Develop a mobile application for clients to manage and monitor
            inventories and outstation tasks
          </li>
          <li>
            Design a flexible optimised relation Sqlite DB to help client’s
            engineers access data and perform updates in any circumstances
          </li>
        </RetroList>
      </>
    ),
  },
  {
    dateTime: "Nov 2020 - Feb 2021",
    title: "Mobile Application Intern, Fehux",
    detail:
      "Developing and testing user interfaces and module using Flutter and React Native. \
      Refactoring and improving existing features and module.",
  },
  {
    dateTime: "Nov 2019 - Feb 2020",
    title: "Javascript Developer Intern, SmartB Solutions",
    detail:
      "Collaborated with fellows to developing and maintaining customized features for clients.",
  },
  {
    dateTime: "Dec 2018 - Feb 2020",
    title: "Part Time jobs, QMO Academy",
    detail:
      "Had a part time jobs as a photographer, videographer and graphic designer",
  },
  {
    dateTime: "Jan 2018",
    title: '"Hello World!"',
    detail: "Started to study for computer science degree",
  },
];

const aboutCarouselSlides = [
  {
    title: "Ridge of Mount Manaslu",
    description: "Taken on the way to Tiliche, Manang",
    image: "/images/bhimtang.webp",
    link: "https://google.com",
    location: {
      description: "Bhimtang, Manang",
      mapsLink: "https://maps.app.goo.gl/fab8Fd2cFk9McgCh8",
    },
  },
  {
    title: "Manaslu Glacier",
    description: "Taken on the way to Manaslu Base Camp",
    image: "/images/manaslu_glacier.webp",
    link: "https://google.com",
    location: {
      description: "Manaslu Glacier, Samagaun",
      mapsLink: "https://maps.app.goo.gl/eQ1NKGVHR1Cyk5Sk7",
    },
  },
  {
    title: "Namjung",
    description: "Taken during descent from Larkya La",
    image: "/images/namjung.webp",
    link: "https://google.com",
    location: {
      description: "Gyaji Kang and Namjung",
      mapsLink: "https://maps.app.goo.gl/VwsLFzaCRvFRuaT29",
    },
  },
  {
    title: "Family of yaks",
    description: "Taken during ascent from Samdo to Dharamsala",
    image: "/images/yak.webp",
    link: "https://google.com",
    location: {
      description: "Family of yaks, Samdo",
      mapsLink: "https://maps.app.goo.gl/vtxJ7MtzjF6x1d9M9",
    },
  },
];

export { bioBrief, timelineItems, aboutCarouselSlides };
