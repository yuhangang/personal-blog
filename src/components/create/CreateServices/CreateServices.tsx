import Link from 'next/link';
import styles from './CreateServices.module.scss';

export default function CreateServices() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Why Build With Me?</h2>
        <p className={styles.lead}>
            I leverage advanced AI workflows to code faster, smarter, and cheaper than traditional agencies. 
            You get a dedicated partner who delivers studio-grade performance without the agency overhead.
        </p>

        <div className={styles.grid}>
            <div className={styles.card}>
                <h3>Rapid Prototyping</h3>
                <p>From concept to live in days, not weeks. I use AI to accelerate boilerplate and focus on what makes your brand unique.</p>
            </div>
            <div className={styles.card}>
                <h3>AI-Optimized SEO</h3>
                <p>Rank higher with machine-learning driven content structure and semantic HTML that search engines love.</p>
            </div>
            <div className={styles.card}>
                <h3>Premium Logic</h3>
                <p>Complex interactive experiences built on robust Next.js foundations. Fast, accessible, and future-proof.</p>
            </div>
        </div>

        <div className={styles.cta}>
            <Link href="#contact" className={styles.ctaLink}>Ready to amplify your story? Let's connect.</Link>
        </div>
      </div>
    </section>
  );
}
