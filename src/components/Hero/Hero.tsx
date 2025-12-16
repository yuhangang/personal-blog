import Image from 'next/image';
import FadeIn from '@/components/Animations/FadeIn';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.background}>
        <Image
          src="/images/hero-bg.png"
          alt="Mountain landscape"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <FadeIn delay={0.2} direction="up">
          <p className={styles.subtitle}>Developer & Creator</p>
        </FadeIn>
        <FadeIn delay={0.4} direction="up">
          <h1 className={styles.title}>Yu Hang Ang</h1>
        </FadeIn>
        <FadeIn delay={0.6} direction="up">
          <p className={styles.description}>
            Crafting elegant solutions through code, one line at a time.
            Exploring the intersection of technology and human experience.
          </p>
        </FadeIn>
        <FadeIn delay={0.8} direction="up">
          <a href="#blog" className={styles.cta}>
            Explore My Work
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
