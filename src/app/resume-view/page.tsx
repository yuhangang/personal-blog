'use client';

import Link from 'next/link';
import FadeIn from '@/components/common/Animations/FadeIn';
import styles from './resume.module.scss';

const experiences = [
  {
    role: 'Mobile Application Developer (Contract)',
    company: 'Cloud Kinetics (Client: POS Malaysia)',
    period: 'May 2025 - Present',
    description: [
      'Developing critical modules for the flagship Pos Mobile App, including secure payment gateway integration for nationwide postal services.',
      'Maintaining multiple production mobile systems while conducting integration testing and implementing data analytics for operational insights.',
      'Prototyping "Pos Mini App," a mobile point-of-sale system deployed to postal agents nationwide for real-time transaction processing.',
      'Participating in the design and architecture of a logistics solution for public sector clients, translating complex requirements into technical specifications.',
      'Collaborating with public sector stakeholders to digitize legacy workflows, identifying operational bottlenecks and proposing mobile-first solutions.',
    ]
  },
 {
    role: 'Mobile Application Developer',
    company: 'Lumi News Malaysia',
    period: 'Mar 2023 - May 2025',
    description: [
      'Served as mobile developer at early-stage startup with 700K+ downloads, taking high ownership of the product by actively brainstorming and contributing ideas to improve user experience.',
      'Wore multiple hats across the product lifecycle—from initial architecture decisions and feature ideation to hands-on development, deployment, and post-launch monitoring. Utilized collected data to fix issues, observe user behavior, and continuously improve user experience.',
      'Engineered a high-performance HTML-based news reader handling complex content rendering and user interactions, including embedded social media posts, media content, and in-article search capabilities.',
      'Built native home screen widgets from scratch using Swift (WidgetKit) and Kotlin (Jetpack Glance), driving daily user engagement with trending news updates.',
      'Established production monitoring infrastructure and logging systems, enabling rapid issue detection and performance optimization in a fast-paced startup environment.',
    ]
  },
  {
    role: 'Mobile Application Developer',
    company: 'Snappymob',
    period: 'Feb 2022 - Feb 2023',
    description: [
      'Contributed as a key developer in a staff augmentation team for the high-traffic MyAstro Super App.',
      'Developed new reward systems, inbox features, and robust deep-linking infrastructure.',
      'Authored comprehensive unit tests and documentation to ensure high software stability.',
      'Troubleshot and refactored legacy modules to improve code readability and performance.'
    ]
  },
  {
    role: 'Mobile Application Developer',
    company: 'Artisan IT Solutions',
    period: 'Jul 2021 - Feb 2022',
    description: [
      'Developed a mobile application for a healthcare device company to monitor inventories and manage outstation tasks.',
      'Designed a flexible and optimized relational SQLite database schema for reliable offline data access and synchronization.'
    ]
  },
  {
    role: 'Mobile Developer Intern',
    company: 'Fehux',
    period: 'Dec 2020 - Feb 2021',
    description: [
      'Troubleshot and resolved production issues for a React Native project.',
      'Developed features for a live streaming shopping initiative.'
    ]
  }
];

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.resumeContainer}>
        <div className={styles.topActions}>
          <Link href="/about" className={styles.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </Link>
          <button onClick={handlePrint} className={`${styles.actionBtn} ${styles.primary}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
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
                <p><a href="mailto:redrainhang@gmail.com">redrainhang@gmail.com</a></p>
                <p><a href="https://yuhangang.com">yuhangang.com</a></p>
                <p><a href="https://www.linkedin.com/in/yu-hang-ang-b8510010b/">LinkedIn</a></p>
                <p><a href="https://github.com/yuhangang">GitHub</a></p>
            </div>
        </header>

        <section className={styles.section}>
            <h2>PROFESSIONAL SUMMARY</h2>
            <div className={styles.divider} />
            <div className={styles.summary}>
                software engineer specializing in architecting high-performance mobile and web applications. 
                Proven track record in building scalable, user-centric applications for major logistics, media, 
                and fintech leaders in Malaysia. Expertise in full-cycle development, production monitoring, 
                and workflow digitization.
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
            <h2>KEY PROJECTS</h2>
            <div className={styles.divider} />
            <div className={styles.experiences}>
                <div className={styles.experienceItem}>
                    <div className={styles.expHeader}>
                        <h3>Yoy Media</h3>
                        <span className={styles.period}><a href="https://yoymedia.com.my/">yoymedia.com.my</a></span>
                    </div>
                    <span className={styles.company}>Website Development</span>
                    <ul className={styles.description}>
                        <li>Designed and developed a website for a digital agency</li>
                        <li>Offering immersive web experiences and shaping company's identity and branding</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className={styles.section}>
            <h2>SKILLS & EXPERTISE</h2>
            <div className={styles.divider} />
            <ul className={styles.description}>
              <li><strong>Languages:</strong> Dart, TypeScript, Swift, Kotlin, SQL</li>
              <li><strong>Frameworks:</strong> Flutter, Swift UI, Jetpack Compose, React, Next.js, React Native</li>
              <li><strong>Tools:</strong> Git, Docker, Firebase, Big Query, Agentic AI Development (Codex, Antigravity)</li>
            </ul>
        </section>

      </div>
    </main>
  );
}
