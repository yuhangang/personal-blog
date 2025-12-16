import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/components/Portfolio/Portfolio.module.scss';

export const metadata: Metadata = {
  title: 'Portfolio | Yu Hang Ang',
  description: 'Showcase of my projects involving AI, web development, and design.',
};

import CreateHero from '@/components/CreateHero/CreateHero';

export default function PortfolioPage() {
  return (
    <main className={styles.container}>
      <div data-theme="dark">
        <CreateHero />
      </div>
      
      <div data-theme="light" className={styles.contentWrapper}>
          <div className={styles.grid}>
            {/* Yoy Media Project Card */}
            <a href="https://yoymedia.com.my/" target="_blank" rel="noopener noreferrer" className={styles.card}>
              <div className={styles.cardImage}>
                <Image 
                    src="/projects/yoymedia.png" 
                    alt="Yoy Media Homepage" 
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Yoy Media</h2>
                <p className={styles.cardDesc}>
                  "Your Story, Amplified." A comprehensive digital solutions platform I built to streamline social marketing. 
                  By integrating <strong>AI-Powered Analysis</strong> into digital strategy, we deliver exceptional results with budget efficiency.
                </p>
                
                <div className={styles.tags}>
                    <span className={styles.tag}>Digital Strategy</span>
                    <span className={styles.tag}>AI Analysis</span>
                    <span className={styles.tag}>Social Marketing</span>
                    <span className={styles.tag}>Creative Content</span>
                </div>
    
                <div className={styles.highlights}>
                    <span>✨ AI-Powered Analysis</span>
                    <span>🚀 Data-Driven Strategy</span>
                    <span>💎 Premium Brand Experience</span>
                </div>
              </div>
            </a>
            
            {/* Placeholder for future projects */}
            <div className={styles.card} style={{ opacity: 0.5, pointerEvents: 'none' }}>
               <div className={styles.cardImage} style={{ background: '#111' }} />
               <div className={styles.cardContent}>
                 <h2 className={styles.cardTitle}>Coming Soon</h2>
                 <p className={styles.cardDesc}>More exciting projects are in the pipeline.</p>
               </div>
            </div>
    
          </div>
    
          <section className={styles.services}>
            <div className={styles.servicesContent}>
                <h2>Why Build With Me?</h2>
                <p className={styles.lead}>
                    I leverage advanced AI workflows to code faster, smarter, and cheaper than traditional agencies. 
                    You get a dedicated partner who delivers studio-grade performance without the agency overhead.
                </p>
    
                <div className={styles.serviceGrid}>
                    <div className={styles.serviceCard}>
                        <h3>Rapid Prototyping</h3>
                        <p>From concept to live in days, not weeks. I use AI to accelerate boilerplate and focus on what makes your brand unique.</p>
                    </div>
                    <div className={styles.serviceCard}>
                        <h3>AI-Optimized SEO</h3>
                        <p>Rank higher with machine-learning driven content structure and semantic HTML that search engines love.</p>
                    </div>
                    <div className={styles.serviceCard}>
                        <h3>Premium Logic</h3>
                        <p>Complex interactive experiences built on robust Next.js foundations. Fast, accessible, and future-proof.</p>
                    </div>
                </div>
    
                <div className={styles.cta}>
                    <Link href="#contact" className={styles.ctaLink}>Ready to amplify your story? Let's connect.</Link>
                </div>
            </div>
          </section>
      </div>
    </main>
  );
}
