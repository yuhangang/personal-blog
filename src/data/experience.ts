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
  "Senior software engineer and mobile team lead with 5+ years of experience shipping production mobile and web products across healthcare, national logistics, consumer media, and enterprise software. Currently leading BookDoc's iOS, Android, and Flutter team, setting the technical direction and standards that help the team ship patient-facing features faster and more safely, while owning data analytics and database administration for the business.",
  "Track record of tying engineering work to business outcomes: led the Flutter migration of POS Malaysia's nationwide agent app and shipped payments and analytics in its flagship app; at Lumi News Malaysia (700K+ downloads), delivered sub-second article rendering, home-screen widgets that drive daily engagement, and monitoring that cut issue detection time by 50%.",
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
      "Leading BookDoc's mobile team and owning data analytics and database administration, helping the business ship patient-facing features faster and more safely.",
    description: [
      "Lead the mobile team behind BookDoc's patient apps, owning technical direction, code quality, and release coordination so the team ships consistently across iOS and Android.",
      "Moving core patient features (teleconsultation, health management, mental wellness) onto one shared codebase, so each feature is built once for both platforms and reaches patients through low-risk staged rollouts.",
      "Unified iOS and Android releases into one automated CI/CD pipeline, cutting manual release work and giving QA and product real-time visibility into every build.",
      "Introduced AI-assisted engineering workflows (MCP tooling and an agent harness) that let engineers hand routine work to AI agents without lowering review standards.",
      "Expanded scope beyond mobile to own data analytics, admin systems, and database administration, giving the business reliable reporting for decisions and keeping production data healthy and access-controlled.",
      "Authored the mobile security policy and remediation roadmap for patient health data, aligning engineering and leadership on risk priorities and raising the security bar for every release.",
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
      "Modernized POS Malaysia's nationwide agent app with a Flutter migration and brought payments and analytics into the flagship POS Mobile app.",
    description: [
      "Led the migration of POS Mini, the app agents use nationwide, from legacy Ionic to Flutter, keeping the live app stable through server telemetry monitoring while modernizing a business-critical tool.",
      "Integrated payment gateways, data analytics, and messaging pipelines into the flagship POS Mobile app, enabling in-app payments and giving business teams the usage data behind product decisions.",
      "Turned client operational workflows into logistics apps and backend services, owning requirements, user stories, and stakeholder demos to keep delivery aligned with business needs.",
      "Coordinated production mobile releases and monitoring with business, data, and infrastructure teams.",
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
      "Kept a 700K+ download news app fast and reliable with sub-second article rendering and monitoring that halved issue detection time, and grew daily engagement with native widgets.",
    description: [
      "Owned features end to end for a 700K+ download media platform, from system design through launch and tuning.",
      "Built a sub-second rendering engine for rich articles, covering HTML injections, social embeds, and in-article search.",
      "Built production observability that cut issue detection time by 50%, catching problems before they reached more readers.",
      "Built native home-screen widgets in Swift (WidgetKit) and Kotlin (Jetpack Glance) that bring readers back daily.",
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
      "Delivered customer engagement features for the MyAstro app and made its legacy codebase safer to change.",
    description: [
      "Delivered reward systems, inbox flows, and deep-linking for the MyAstro app to support customer engagement.",
      "Refactored legacy modules and added unit tests and docs, making the codebase safer to change and faster to onboard onto.",
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
      "Kept healthcare field teams working without reliable connectivity through offline-first sync and inventory software.",
    description: [
      "Designed an offline-first SQLite schema and sync so healthcare field teams keep working without reliable connectivity.",
      "Built a full-cycle inventory monitoring system that stays reliable in low-connectivity clinics.",
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
      "Kept a live-commerce platform stable and built shopping flows for high-traffic sales events.",
    description: [
      "Fixed production bugs on a React Native live-commerce platform, keeping live sales sessions stable.",
      "Built interactive shopping features for high-traffic promotional sales events.",
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
      "OWASP MASVS & Penetration Testing, Unit/Integration Testing, Agentic Coding (Claude Code, Codex, Antigravity, Gemini CLI), MCP Servers & Agent Harnesses",
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
