'use client';

import { useEffect, useState } from 'react';
import FadeIn from '@/components/common/Animations/FadeIn';
import styles from './about.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { calculateAge } from '@/utils/date';
import MessyThreads from '@/components/common/MessyThreads/MessyThreads';

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

export default function AboutPage() {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    setAge(calculateAge('1998-01-06'));
  }, []);

  return (
    <main className={styles.container} data-theme="dark">
      <FadeIn direction="up" delay={0.05}>
        <div className={styles.coverWrapper}>
          <Image 
            src="/images/yuhang_at_penang.webp"
            alt="Yuhang at Penang"
            fill
            className={styles.coverImage}
            priority
            sizes="(max-width: 3840px) 100vw, 3840px"
          />
        </div>
      </FadeIn>
      <div className={styles.innerContainer}>
        <div className={styles.headerGrid}>
          <div className={styles.headerContent}>
            <FadeIn direction="up" delay={0.1}>
              <h1 className={styles.title}>My Journey</h1>
            </FadeIn>
          </div>

          <div className={styles.visualContainer}>
              <FadeIn direction="down" delay={0.5}>
                  <div className={styles.threadsWrapper}>
                      <MessyThreads />
                  </div>
              </FadeIn>
          </div>
        </div>

        <div className={styles.content}>
          <FadeIn direction="up" delay={0.2}>
            <div className={styles.bio}>
              <p className={styles.text}>
                {age || '...'}, software engineer based in Kuala Lumpur, Malaysia. Open for new opportunities for collaboration and learning.
              </p>
              <div className={styles.actions}>
                <Link href="/resume" className={styles.resumeLink}>
                    View Professional Resume &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>

          <div className={styles.timeline}>
            {experiences.map((exp, index) => (
              <FadeIn key={index} direction="up" delay={0.3 + index * 0.1}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineHeader}>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <span className={styles.company}>{exp.company}</span>
                    <span className={styles.period}>{exp.period}</span>
                  </div>
                  <ul className={styles.description}>
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
