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
      'Spearheading the end-to-end development of the "Pos Mini App," a mobile POS system used by agents countrywide.',
      'Designing and architecting a logistics solution for client in public sector.',
      'Assisting in production integration testings and data analytics',
      'Collaborating with public sector stakeholders to digitize complex workflows and identify operational bottlenecks.',
      'Developing critical modules for the flagship Pos Mobile App, including secure payment gateways',
      'Maintain and upgrade legacy mobile systems in different frameworks'
    ]
  },
  {
    role: 'Mobile Application Developer',
    company: 'Lumi News Malaysia',
    period: 'Mar 2023 - May 2025',
    description: [
      'Managed full lifecycle development from initial design through deployment, collaborating closely with product and backend teams.',
      'Engineered a high-performance HTML-based news reader for complex content rendering with native fluidity, including embedding social media post and media contents, and in-article search features.',
      'Developed native home screen widgets using Swift (WidgetKit) and Kotlin (Jetpack Glance) serving trending news articles on home screen.',
      'Implemented comprehensive production monitoring and logging systems for rapid performance optimization.',
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
            <div className={styles.titleArea}>
                <h1>Yu Hang Ang</h1>
                <p>Software Engineer</p>
            </div>
            <div className={styles.contactInfo}>
                <p>Kuala Lumpur, Malaysia</p>
                <p>Phone: +60182425856</p>
                <p><a href="mailto:redrainhang@gmail.com">redrainhang@gmail.com</a></p>
                <p><a href="https://linkedin.com/in/yuhangang" target="_blank" rel="noopener noreferrer">linkedin.com/in/yuhangang</a></p>
                <p><a href="https://github.com/yuhangang" target="_blank" rel="noopener noreferrer">github.com/yuhangang</a></p>
            </div>
        </header>

        <section className={styles.section}>
            <h2>Professional Summary</h2>
            <div className={styles.summary}>
                software engineer specializing in architecting high-performance mobile and web applications. 
                Proven track record in building scalable, user-centric applications for major logistics, media, 
                and fintech leaders in Malaysia. Expertise in full-cycle development, production monitoring, 
                and workflow digitization.
            </div>
        </section>

        <section className={styles.section}>
            <h2>Professional Experience</h2>
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
        </section>

        <section className={styles.section}>
            <h2>Skills & Expertise</h2>
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
