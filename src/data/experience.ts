export interface ExperienceItem {
  id: string;
  role: string;
  shortRole: string;
  company: string;
  period: string;
  timeframe: string;
  domain: string;
  summary: string;
  description: readonly string[];
}

export interface SkillGroup {
  category: string;
  skills: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  displayUrl: string;
  href: string;
  secondaryLink?: {
    label: string;
    href: string;
  };
  bullets: readonly string[];
}

export const RESUME_CONTACT = {
  name: "Yu Hang Ang",
  title: "Senior Software Engineer",
  subtitle: "Mobile and web development",
  location: "Kuala Lumpur, Malaysia",
  phone: "+6018 242 5856",
  phoneHref: "tel:+60182425856",
  email: "redrainhang@gmail.com",
  portfolioEmail: "contact@yuhangang.com",
  website: "https://yuhangang.com",
  websiteDisplay: "yuhangang.com",
  linkedin: "https://www.linkedin.com/in/yu-hang-ang-b8510010b/",
  github: "https://github.com/yuhangang",
} as const;

export const RESUME_SUMMARY: readonly string[] = [
  "Senior software engineer and mobile team lead with 5+ years of experience building and scaling production mobile and web systems across healthcare, national logistics, consumer media, and enterprise software. Currently leading mobile engineering across iOS, Android, and Flutter at BookDoc, guiding architecture decisions, incremental cross-platform migration, CI/CD release consolidation, and mobile security governance.",
  "Experienced owning the full product lifecycle from requirements, schema design, and testing through store release and observability, including leading the Flutter migration for nationwide agent tooling at POS Malaysia and delivering sub-second article rendering, native iOS/Android widgets, and production monitoring that cut issue detection time by 50% for Lumi News Malaysia's 700K+ download platform.",
] as const;

export const EXPERIENCES: readonly ExperienceItem[] = [
  {
    id: "bookdoc",
    role: "Senior Mobile Engineer - Team Lead",
    shortRole: "Mobile Team Lead",
    company: "BookDoc",
    period: "Aug 2026 - Present",
    timeframe: "2026 - Present",
    domain: "Digital Healthcare",
    summary:
      "Leading the mobile team across BookDoc's iOS, Android, and Flutter apps, guiding cross-platform migration, release automation, code governance, and security standards.",
    description: [
      "Lead the mobile engineering team across iOS, Android, and Flutter as repository code owner, guiding architecture decisions, code reviews, engineering standards, and release coordination.",
      "Drive the incremental migration of native iOS and Android features (including teleconsultation, health management, and mental wellness) into a shared Flutter module with staged, tester-gated rollouts.",
      "Consolidated iOS and Android QA and production release workflows into a unified automated pipeline with Slack reporting, resolving Xcode Cloud build-number conflicts.",
      "Authored the mobile security policy and prioritized remediation roadmap for patient health data, establishing release safeguards and logging standards across engineering.",
    ],
  },
  {
    id: "pos-malaysia",
    role: "Software Engineer (Contract)",
    shortRole: "Software Engineer",
    company: "POS Malaysia",
    period: "May 2025 - Aug 2026",
    timeframe: "2025 - 2026",
    domain: "National Logistics",
    summary:
      "Led the Flutter migration of POS Mini agent tooling alongside payment and analytics pipelines for POS Mobile.",
    description: [
      "Built logistics operation apps and backend services tailored to client workflows, gathering requirements, writing user stories, and presenting demos to stakeholders.",
      "Maintained and improved the legacy Ionic-based POS Mini application used by agents nationwide, monitoring server telemetry and leading the migration to Flutter.",
      "Integrated payment gateways, data analytics, and messaging pipelines into the flagship POS Mobile app.",
      "Coordinated production mobile releases and monitoring alongside business, data, and infrastructure teams.",
    ],
  },
  {
    id: "lumi-news",
    role: "Software Engineer",
    shortRole: "Software Engineer",
    company: "Lumi News Malaysia",
    period: "Mar 2023 - May 2025",
    timeframe: "2023 - 2025",
    domain: "Consumer Media · 700K+ Downloads",
    summary:
      "Built low-latency article rendering, production monitoring that halved issue detection time, and native iOS and Android widgets.",
    description: [
      "Owned full product lifecycle features for a media platform with 700K+ downloads, from system design to launch and post-release tuning.",
      "Built a content rendering engine supporting HTML injections, social media embeds, and in-article search with sub-second latency.",
      "Set up production logging and observability tooling that cut issue detection time by 50%.",
      "Built native home-screen widgets using Swift (WidgetKit) and Kotlin (Jetpack Glance) to drive daily active engagement.",
    ],
  },
  {
    id: "snappymob",
    role: "Software Engineer (Staff Augmentation)",
    shortRole: "Software Engineer",
    company: "Snappymob",
    period: "Feb 2022 - Feb 2023",
    timeframe: "2022 - 2023",
    domain: "Enterprise Mobile · MyAstro",
    summary:
      "Built reward systems, deep-linking, and unit tests for the MyAstro app.",
    description: [
      "Developed and groomed features for the MyAstro app, including reward systems, inbox flows, and deep-linking.",
      "Refactored legacy modules, added unit test coverage, and wrote system documentation.",
      "Worked in an agile engineering squad to deliver features across MyAstro mobile systems.",
    ],
  },
  {
    id: "artisan-it",
    role: "Software Engineer",
    shortRole: "Software Engineer",
    company: "Artisan IT Solutions",
    period: "Jul 2021 - Feb 2022",
    timeframe: "2021 - 2022",
    domain: "Healthcare & Inventory",
    summary:
      "Built offline-first SQLite synchronization and field inventory software for low-connectivity clinics.",
    description: [
      "Designed a relational SQLite schema supporting offline-first data synchronization for healthcare field operations.",
      "Built a full-cycle inventory monitoring system for reliable performance in low-connectivity environments.",
    ],
  },
  {
    id: "fehux",
    role: "Software Engineer Intern",
    shortRole: "Engineering Intern",
    company: "Fehux",
    period: "Dec 2020 - Feb 2021",
    timeframe: "2020 - 2021",
    domain: "Live Commerce",
    summary:
      "Fixed live production bugs and built React Native shopping flows for high-traffic events.",
    description: [
      "Diagnosed and fixed production bugs across a React Native live-streaming platform.",
      "Built interactive shopping features for high-traffic promotional events.",
    ],
  },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    category: "FRONTEND & MOBILE",
    skills:
      "Flutter/Dart (Clean Architecture, BLoC, MVVM), Next.js, React Native, Swift (SwiftUI, WidgetKit), Kotlin (Compose, Glance), Ionic/Cordova, GraphQL",
  },
  {
    category: "BACKEND & DATA",
    skills:
      "Node.js, Golang, PostgreSQL, Supabase, SQLite, Stored Procedures, REST API, gRPC, BigQuery, Firebase",
  },
  {
    category: "DEVOPS & INFRASTRUCTURE",
    skills:
      "GitHub Actions, Fastlane, Docker, CI/CD, Git Workflow, App Release (App Store, Play Store, TestFlight & Firebase), Monitoring (Crashlytics, New Relic, Sentry), Cloudflare (R2/Workers), GitLab/GitHub, Jira (Agile)",
  },
  {
    category: "AI, SECURITY & QUALITY",
    skills:
      "OWASP MASVS & Penetration Testing, Unit/Integration Testing, Agentic Coding (Claude Code, Codex, Antigravity, Gemini CLI)",
  },
];

export const PROJECTS: readonly ResumeProject[] = [
  {
    id: "pelbag-ai",
    name: "pelbag.ai",
    displayUrl: "pelbag.ai",
    href: "https://pelbag.ai",
    bullets: [
      "Designed and built the website for my web development agency.",
      "Implemented interactive 3D elements using Next.js and Three.js.",
    ],
  },
  {
    id: "flutter-oembed",
    name: "Flutter Oembed",
    displayUrl: "github.com/yuhangang/flutter_oembed",
    href: "https://github.com/yuhangang/flutter_oembed",
    secondaryLink: {
      label: "pub.dev package",
      href: "https://pub.dev/packages/flutter_oembed",
    },
    bullets: [
      "Built and published an open-source Flutter package for oEmbed resolution across major media providers.",
    ],
  },
  {
    id: "yoy-media",
    name: "Yoy Media",
    displayUrl: "yoymedia.com.my",
    href: "https://yoymedia.com.my/",
    bullets: [
      "Designed and built the website for Yoy Media, a digital agency.",
    ],
  },
];
