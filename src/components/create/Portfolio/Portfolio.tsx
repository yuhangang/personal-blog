
import Image from 'next/image';
import styles from './Portfolio.module.scss';
import Link from 'next/link';

const PROJECTS = [
  {
    title: "Yoy Media",
    href: "https://yoymedia.com.my/",
    image: "/projects/yoymedia.png",
    description: (
      <>
        "Your Story, Amplified." A comprehensive digital solutions platform I built to streamline social marketing.
        By integrating <strong>AI-Powered Analysis</strong> into digital strategy, we deliver exceptional results with budget efficiency.
      </>
    ),
    tags: ["Digital Strategy", "AI Analysis", "Social Marketing", "Creative Content"],
    highlights: ["✨ AI-Powered Analysis", "🚀 Data-Driven Strategy", "💎 Premium Brand Experience"]
  }
];

export default function Portfolio() {
  return (
    <div className={styles.grid}>
      {PROJECTS.map((project, index) => (
        <a 
          key={index}
          href={project.href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.card}
        >
          <div className={styles.cardImage}>
            <Image 
                src={project.image} 
                alt={`${project.title} Preview`}
                fill
                style={{ objectFit: 'cover' }}
            />
            <div className={styles.overlay} />
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{project.title}</h2>
            <p className={styles.cardDesc}>
              {project.description}
            </p>
            
            <div className={styles.tags}>
              {project.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.highlights}>
              {project.highlights.map((highlight, i) => (
                <span key={i}>{highlight}</span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
