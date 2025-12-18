'use client';

import FadeIn from '@/components/Animations/FadeIn';
import styles from './about.module.scss';
import Link from 'next/link';
import { calculateAge } from '@/utils/date';
import MessyThreads from '@/components/MessyThreads/MessyThreads';

const experiences = [
  {
    role: 'App Developer',
    company: 'Lumi News',
    period: 'Mar 2023 - Present',
    description: [
      'Actively engaged in product planning and contribute ideas in one of the most popular news apps in Malaysia.',
      'Working closely with different stakeholders from drafting, design, development, testing, deployment, monitoring, and tracking.',
      'Develop highly interactive features and widgets to enhance users’ news reading experience.',
      'HTML-based news reader containing embedded images, recommendations, videos, and social media posts.',
      'Experiment with new technologies, product ideas, and various improvements and optimizations.',
      'Native IOS/Android home widget for displaying latest news on user device home screen.'
    ]
  },
  {
    role: 'Software Engineer',
    company: 'Snappymob Sdn Bhd',
    period: 'Feb 2022 - Feb 2023',
    description: [
      'Working on MyAstro App, as part of a staff augmentation team for the client.',
      'Worked closely with various roles within the scrum team.',
      'Writing documentation unit tests and practicing peer code review, to ensure software quality.',
      'Engaged in development of new reward, inbox features and deep linking infrastructure.',
      'Troubleshooting and refactor various features and modules.'
    ]
  },
  {
    role: 'Mobile Developer',
    company: 'Artisan IT Solutions',
    period: 'Jan 2021 - Feb 2022',
    description: [
      'Develop a mobile application for clients to manage and monitor inventories and outstation tasks.',
      'Design a flexible optimised relation Sqlite DB to help client’s engineers access data and perform updates in any circumstances.'
    ]
  }
];

export default function AboutPage() {
  const age = calculateAge('1998-01-06');

  return (
    <main className={styles.container} data-theme="light">
      <div className={styles.header}>
        <div className={styles.threadsWrapper}>
            <FadeIn direction="down" delay={0.5}>
                <MessyThreads />
            </FadeIn>
        </div>
     
        <FadeIn direction="up" delay={0.1}>
          <h1 className={styles.title}>My Journey</h1>
        </FadeIn>
      </div>

      <div className={styles.content}>
        <FadeIn direction="up" delay={0.2}>
          <div className={styles.bio}>
            <p className={styles.text}>
              {age}, software engineer based in Kuala Lumpur, Malaysia. Open for new opportunities for collaboration and learning.
            </p>
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
    </main>
  );
}
