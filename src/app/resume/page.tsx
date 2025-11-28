import styles from './resume.module.scss';

export const metadata = {
  title: 'Resume | Yu Hang Ang',
  description: 'Professional experience and skills of Yu Hang Ang.',
};

export default function Resume() {
  return (
    <main className={styles.container}>
      <div className={styles.resumeGrid}>
        {/* Header spans full width in grid */}
        <header className={`${styles.header} fade-in`}>
          <div className={styles.titleGroup}>
            <h1>Yu Hang Ang</h1>
            <p>Software Engineer & Creator</p>
          </div>
          <a href="/resume.pdf" download className={styles.downloadButton}>
            Download PDF
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </header>

        {/* Left Column: Contact, Education, Skills */}
        <aside className={`${styles.leftColumn} fade-in fade-in-delay-1`}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact</h2>
            <ul className={styles.contactList}>
              <li>
                <span>📍</span> Singapore
              </li>
              <li>
                <span>📧</span> <a href="mailto:hello@yuhang.ang">hello@yuhang.ang</a>
              </li>
              <li>
                <span>🔗</span> <a href="https://linkedin.com/in/yuhangang">linkedin.com/in/yuhangang</a>
              </li>
              <li>
                <span>💻</span> <a href="https://github.com/yuhangang">github.com/yuhangang</a>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>B.Sc. Computer Science</h3>
                <span>2016 - 2020</span>
              </div>
              <span className={styles.company}>University of Technology</span>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h4>Languages</h4>
                <ul>
                  <li>TypeScript / JavaScript</li>
                  <li>Python, SQL</li>
                  <li>HTML / CSS / SCSS</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                <h4>Frameworks</h4>
                <ul>
                  <li>Next.js, React</li>
                  <li>Node.js, Express</li>
                  <li>Flutter, React Native</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                <h4>Tools</h4>
                <ul>
                  <li>Git, Docker, AWS</li>
                  <li>Figma, Adobe XD</li>
                </ul>
              </div>
            </div>
          </section>
        </aside>

        {/* Right Column: Experience */}
        <div className={`${styles.rightColumn} fade-in fade-in-delay-2`}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            
            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Senior Software Engineer</h3>
                <span>2022 - Present</span>
              </div>
              <span className={styles.company}>Tech Company Inc.</span>
              <div className={styles.description}>
                <ul>
                  <li>Led development of core features using Next.js and TypeScript, improving system reliability by 99.9%.</li>
                  <li>Optimized application performance, reducing load times by 40% through code splitting and image optimization.</li>
                  <li>Mentored junior developers and established code quality standards, resulting in a 20% reduction in bugs.</li>
                </ul>
              </div>
            </div>

            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Software Developer</h3>
                <span>2020 - 2022</span>
              </div>
              <span className={styles.company}>Creative Solutions Ltd.</span>
              <div className={styles.description}>
                <ul>
                  <li>Developed responsive web applications for various clients using React and Node.js.</li>
                  <li>Collaborated with designers to implement pixel-perfect UIs, ensuring cross-browser compatibility.</li>
                  <li>Integrated third-party APIs and payment gateways (Stripe, PayPal) for e-commerce solutions.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
