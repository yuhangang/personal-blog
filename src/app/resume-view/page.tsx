"use client";

import Link from "next/link";
import styles from "./resume.module.scss";

const experiences = [
  {
    role: "Software Engineer (Contract)",
    company: "POS Malaysia",
    period: "May 2025 - Present",
    description: [
      "Integration of payment gateways, data analytics and messaging pipelines for the flagship Pos Mobile App.",
      "Prototyping end-to-end process flows and full stacks rchitectures for logistic solutions for potential clients",
      "Deployment and monitoring the mobile applications on production, working closely with business, data and infrastructure teams.",
      "Maintain and improve legacy application used by agents countrywide, monitoring server performance and user feedback.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Lumi News Malaysia",
    period: "Mar 2023 - May 2025",
    description: [
      "Involved in full product lifecycle for a high-traffic media platform (700K+ downloads), moving from initial architectural design to deployment and post-launch optimization.",
      "Engineered a high-performance content rendering engine capable of handling complex HTML injections, social media embeds, and in-article search with sub-second latency.",
      "Established the company's observability stack, building production monitoring and logging infrastructure that reduced issue detection time by 50% in a fast-paced environment.",
      "Built cross-platform engagement features, including native home screen widgets using Swift (WidgetKit) and Kotlin (Jetpack Glance), directly driving daily active user growth.",
    ],
  },
  {
    role: "Software Engineer (Staff Augmentation)",
    company: "Snappymob",
    period: "Feb 2022 - Feb 2023",
    description: [
      "Contributed to the MyAstro App, focusing on scalable reward systems, inbox and deep-linking infrastructure.",
      "Improved codebase maintainability by troubleshooting and refactoring legacy modules, implementing robust unit testing patterns and comprehensive documentation.",
      "Collaborated in a high-velocity agile environment to deliver feature-parity across complex enterprise mobile systems.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Artisan IT Solutions",
    period: "Jul 2021 - Feb 2022",
    description: [
      "Designed and implemented an optimized relational SQLite schema to handle complex offline-first data synchronization for healthcare field-work management.",
      "Developed a full-cycle inventory monitoring system, focusing on data integrity and reliable performance in low-connectivity environments.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Fehux",
    period: "Dec 2020 - Feb 2021",
    description: [
      "Diagnosed and resolved critical production bugs for a React Native live-streaming platform.",
      "Contributed to the development of interactive shopping features during high-traffic promotional events.",
    ],
  },
];

const skillGroups = [
  {
    category: "FRONTEND & MOBILE",
    skills:
      "Flutter/Dart (MVVM), Next.js, React Native, Swift (SwiftUI, WidgetKit), Kotlin (Compose, Glance), Ionic/Cordova, GraphQL",
  },
  {
    category: "BACKEND & DATA",
    skills:
      "Node.js, Golang, PostgreSQL, SQLite, Store Procedures, REST API, gRPC, BigQuery, Firebase",
  },
  {
    category: "DEVOPS & INFRASTRUCTURE",
    skills:
      "Docker, CI/CD, Git Workflow, App Release (AppStore/PlayStore), Monitoring (Crashlytics, New Relic, Sentry), Gitlab/Github, Jira (Agile), Database Management",
  },
  {
    category: "AI, SECURITY & QUALITY",
    skills:
      "OWASP Penetration Testing, Unit/Integration Testing, Agentic AI (LangChain, LangGraph, MCP, Skills), Agentic Coding (Codex, Antigravity, Gemini Cli)",
  },
];

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.resumeContainer}>
        {/* Actions Hidden during print */}
        <div className={styles.topActions}>
          <Link href="/about" className={styles.actionBtn}>
            Back
          </Link>
          <button
            onClick={handlePrint}
            className={`${styles.actionBtn} ${styles.primary}`}
          >
            Download PDF
          </button>
        </div>

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Yu Hang Ang</h1>
            <p className={styles.role}>SOFTWARE ENGINEER</p>
          </div>
          <div className={styles.headerRight}>
            <p>Kuala Lumpur, Malaysia</p>
            <p>Phone: +60182425856</p>
            <p>
              <a href="mailto:redrainhang@gmail.com">redrainhang@gmail.com</a>
            </p>
            <p>
              <a href="https://yuhangang.com">yuhangang.com</a>
            </p>
            <p>
              <a href="https://www.linkedin.com/in/yu-hang-ang-b8510010b/">
                LinkedIn
              </a>{" "}
              | <a href="https://github.com/yuhangang">GitHub</a>
            </p>
          </div>
        </header>

        <section className={styles.section}>
          <h2>PROFESSIONAL SUMMARY</h2>
          <div className={styles.divider} />
          <div className={styles.summary}>
            Software Engineer with 5 years architecting resilient mobile and web
            systems. Specializes in bridging business requirements with
            technical implementation across logistics, media, and enterprise
            domains.
          </div>
        </section>

        <section className={styles.section}>
          <h2>SKILLS AND TECHNOLOGIES</h2>
          <div className={styles.divider} />
          <div className={styles.skillsGrid}>
            {skillGroups.map((group, index) => (
              <div key={index} className={styles.skillCard}>
                <h4 className={styles.skillCategory}>{group.category}</h4>
                <p className={styles.skillList}>{group.skills}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>PROFESSIONAL EXPERIENCE</h2>
          <div className={styles.divider} />
          <div className={styles.experiences}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.experienceItem}>
                <div className={styles.expHeader}>
                  <h3>{exp.role}</h3>
                  <span className={styles.period}>{exp.period}</span>
                </div>
                <span className={styles.company}>{exp.company}</span>
                <ul className={styles.description}>
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>PROJECTS</h2>
          <div className={styles.divider} />
          <div className={styles.experiences}>
            <div className={styles.experienceItem}>
              <div className={styles.expHeader}>
                <h3>Flutter Oembed</h3>
                <span className={styles.period}>
                  <a href="https://github.com/yuhangang/flutter_oembed">
                    github.com/yuhangang/flutter_oembed
                  </a>
                </span>
              </div>
              <ul className={styles.description}>
                <li>
                  A flutter package that provides oembed functionality,
                  supporting most major platforms and customisations. Allow
                  developers to easily embed content from various platforms into
                  their flutter applications. Published on{" "}
                  <span className={styles.period}>
                    {" "}
                    <a href="https://pub.dev/packages/flutter_oembed">
                      pub.dev
                    </a>
                  </span>
                  .
                </li>
              </ul>
            </div>
            <div className={styles.experienceItem}>
              <div className={styles.expHeader}>
                <h3>PELBAG.AI</h3>
                <span className={styles.period}>
                  <a href="https://pelbag.ai">pelbag.ai</a>
                </span>
              </div>
              <ul className={styles.description}>
                <li>
                  Designed and developed website for my own web development
                  agency.
                </li>
                <li>
                  Built using Next.js and Three.js for 3D interactions,
                  delivering a highly interactive and engaging user experience.
                </li>
              </ul>
            </div>
            <div className={styles.experienceItem}>
              <div className={styles.expHeader}>
                <h3>Yoy Media</h3>
                <span className={styles.period}>
                  <a href="https://yoymedia.com.my/">yoymedia.com.my</a>
                </span>
              </div>
              <ul className={styles.description}>
                <li>
                  Designed and developed a digital agency platform focused on
                  immersive web experiences and brand identity.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
