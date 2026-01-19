"use client";

import Link from "next/link";
import FadeIn from "@/components/common/Animations/FadeIn";
import styles from "./resume.module.scss";

const experiences = [
  {
    role: "Software Engineer (Contract)",
    company: "POS Malaysia",
    period: "May 2025 - Present",
    description: [
      "Architecting full-stack logistics solutions for public sector clients, translating high-level business requirements into scalable technical specifications.",
      "Leading the development of critical payment modules for the flagship Pos Mobile App, ensuring secure, nationwide transaction processing.",
      "Bridging the gap between legacy workflows and modern mobile-first solutions by collaborating directly with stakeholders to identify and resolve operational bottlenecks.",
      "Implementing data-driven insights through analytics and production monitoring to optimize system performance and reliability.",
    ],
  },
  {
    role: "Software Engineer (Founding Team Member)",
    company: "Lumi News Malaysia",
    period: "Mar 2023 - May 2025",
    description: [
      "Owned the full product lifecycle for a high-traffic media platform (700K+ downloads), moving from initial architectural design to deployment and post-launch optimization.",
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
      "Contributed to the MyAstro Super App ecosystem, focusing on scalable reward systems and high-reliability deep-linking infrastructure.",
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
            <p className={styles.role}>
              SOFTWARE ENGINEER | PRODUCT & PROBLEM SOLVER
            </p>
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
            Product-minded Software Engineer specializing in architecting
            resilient mobile and web ecosystems. Proven track record of scaling
            applications to 700K+ users and bridging the gap between complex
            business requirements and technical implementation. Expert in
            building end-to-end features—from database schema design and API
            integration to high-performance frontend interfaces.
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
          <h2>CORE TECHNICAL STACK</h2>
          <div className={styles.divider} />
          <div className={styles.skillsGrid}>
            <ul className={styles.description}>
              <li>
                <strong>Frontend/Mobile:</strong> Flutter (Expert), TypeScript,
                Next.js, React Native, Swift (SwiftUI), Kotlin (Compose)
              </li>
              <li>
                <strong>Backend/Data:</strong> Node.js, SQL, PostgreSQL (JSONB),
                SQLite Schema Design, RESTful API Design
              </li>
              <li>
                <strong>Infrastructure/AI:</strong> Docker, Firebase, BigQuery,
                Agentic AI (LangGraph/MCP), Production Monitoring &
                Observability
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>NOTABLE PROJECTS</h2>
          <div className={styles.divider} />
          <div className={styles.experiences}>
            <div className={styles.experienceItem}>
              <div className={styles.expHeader}>
                <h3>Project Nexus (AI Platform)</h3>
                <span className={styles.period}>Current</span>
              </div>
              <ul className={styles.description}>
                <li>
                  Architecting a multi-tenant AI-powered directory platform
                  using Next.js and agentic workflows to automate content
                  curation.
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
