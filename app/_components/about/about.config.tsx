import RetroList from "./timeline/components/RetroList.style";

const bioBrief = {
  src: "/images/profile.jpg",
  name: "Yu Hang Ang",
  description: `
  I am a dedicated App and Mobile Developer with over 3 years of
  experience, currently working at Lumi News since March 2023. Prior to
  this, I worked as a Software Engineer at Snappymob Sdn Bhd, where I
  contributed to the My Astro application, focusing on digitalizing user
  management for Astro products. I collaborated closely with various
  stakeholders and played a key role in the development and maintenance
  of new reward modules, integrating CMS, remote configurations, and
  APIs.
  `,
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
    image: "/images/bhimtang.jpg",
    link: "https://google.com",
  },
  {
    title: "Manaslu Glacier",
    description: "Taken on the way to Manaslu Base Camp",
    image: "/images/manaslu_glacier.jpg",
    link: "https://google.com",
  },
  {
    title: "Namjung",
    description: "Taken during descent from Larkya La",
    image: "/images/namjung.jpg",
    link: "https://google.com",
  },
  {
    title: "Family of yaks",
    description: "Taken during ascent from Samdo to Dharamsala",
    image: "/images/yak.jpg",
    link: "https://google.com",
  },
];

export { bioBrief, timelineItems, aboutCarouselSlides };
