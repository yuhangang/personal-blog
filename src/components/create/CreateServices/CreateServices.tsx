'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './CreateServices.module.scss';

const SERVICES = [
  {
    title: "Rapid Prototyping",
    description: "From concept to live in days, not weeks. I use AI to accelerate boilerplate and focus on what makes your brand unique.",
  },
  {
    title: "AI-Optimized SEO",
    description: "Rank higher with machine-learning driven content structure and semantic HTML that search engines love.",
  },
  {
    title: "Premium Logic",
    description: "Complex interactive experiences built on robust Next.js foundations. Fast, accessible, and future-proof.",
  },
];

export default function CreateServices() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Column - Visual */}
        <div className={styles.visualColumn}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/images/services-visual.png"
              alt="AI-powered development visualization"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.visualCaption}>
            <span className={styles.captionNumber}>∞</span>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className={styles.contentColumn}>
          <div className={styles.header}>
            <span className={styles.headerLabel}>なぜ私と</span>
            <h2 className={styles.title}>
              WHY BUILD<br/>WITH ME?
            </h2>
          </div>

          <p className={styles.lead}>
            I leverage advanced AI workflows to code faster, smarter, and cheaper than traditional agencies. 
            You get a dedicated partner who delivers studio-grade performance without the agency overhead.
          </p>

          <div className={styles.servicesGrid}>
            {SERVICES.map((service, index) => {
              const number = String(index + 1).padStart(2, '0');
              return (
                <div key={index} className={styles.serviceCard}>
                  <span className={styles.serviceNumber}>{number}</span>
                  <div className={styles.serviceContent}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDesc}>{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cta}>
            <Link href="#contact" className={styles.ctaLink}>
              <span>Ready to amplify your story?</span>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
