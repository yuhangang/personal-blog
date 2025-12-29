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
                <span>📍</span> Kuala Lumpur, Malaysia
              </li>
              <li>
                <span>📞</span> +60182425856
              </li>
              <li>
                <span>📧</span> <a href="mailto:redrainhang@gmail.com">redrainhang@gmail.com</a>
              </li>
              <li>
                <span>🔗</span> <a href="https://linkedin.com/in/yuhangang">LinkedIn Profile</a>
              </li>
              <li>
                <span>💻</span> <a href="https://github.com/yuhangang">github.com/yuhangang</a>
              </li>
              <li>
                <span>🌐</span> <a href="https://yuhangang.com">yuhangang.com</a>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Bachelor of Computer Science</h3>
                <span>2018 - 2021</span>
              </div>
              <span className={styles.company}>Monash University Malaysia</span>
              <p className={styles.educationMinor}>Minor in Data Science</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h4>Languages</h4>
                <ul>
                  <li>Dart, Swift, Kotlin</li>
                  <li>JavaScript/TypeScript, Go</li>
                  <li>SQL, HTML/CSS</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                <h4>Frameworks</h4>
                <ul>
                  <li>Flutter, SwiftUI</li>
                  <li>Next.js, Ionic</li>
                  <li>GraphQL</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                <h4>Architecture</h4>
                <ul>
                  <li>Bloc, Riverpod, Provider</li>
                  <li>Clean Architecture</li>
                  <li>MVVM, SQLite</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                 <h4>Tools & DevOps</h4>
                 <ul>
                   <li>CI/CD, Git</li>
                   <li>Firebase, Vercel</li>
                   <li>Cloudflare</li>
                 </ul>
              </div>
              <div className={styles.skillCategory}>
                 <h4>AI Productivity</h4>
                 <ul>
                    <li>Github Copilot</li>
                    <li>Claude AI, Gemini AI</li>
                 </ul>
              </div>
            </div>
          </section>
        </aside>

        {/* Right Column: Experience */}
        <div className={`${styles.rightColumn} fade-in fade-in-delay-2`}>
          <section className={styles.section}>
             <h2 className={styles.sectionTitle}>Professional Summary</h2>
             <p className={styles.summaryText}>
                Senior Mobile Application Developer with extensive experience in architecting scalable applications using Flutter, Native (Swift/Kotlin), and modern web frameworks like Next.js. Proven track record in leading development for high-traffic logistics and media platforms (POS Malaysia, Lumi News). Expert in state management, legacy migration, and integrating complex backend services.
             </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            
            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Mobile Application Developer (Contract)</h3>
                <span>May 2025 - Present</span>
              </div>
              <span className={styles.company}>Cloud Kinetics (Client: POS Malaysia)</span>
              <div className={styles.description}>
                <ul>
                  <li>Lead Architect for POS Mini App: Spearheading the end-to-end development of the "Pos Mini App," a distributed mobile point-of-sale system used by agents countrywide.</li>
                  <li>Super App Vendor Integration: Designing and architecting a modular vendor system for seamless third-party service integration.</li>
                  <li>Core Feature Engineering: Developing critical modules for the flagship Pos Mobile App, including secure payment gateways and real-time notification services.</li>
                  <li>Digital Transformation: Collaborating with public sector stakeholders to digitize complex workflows.</li>
                  <li>Legacy Modernization: Leading the migration strategy from legacy applications to modern Flutter architectures.</li>
                </ul>
              </div>
            </div>

            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Mobile Application Developer</h3>
                <span>Mar 2023 - May 2025</span>
              </div>
              <span className={styles.company}>Lumi News Malaysia</span>
              <div className={styles.description}>
                <ul>
                  <li>Full Lifecycle Development: Managed feature development from initial design through deployment.</li>
                  <li>Custom Rendering Engine: Engineered a high-performance HTML-based news reader capable of rendering complex content types with native fluidity.</li>
                  <li>Native Widget Development: Developed native home screen widgets using Swift (WidgetKit) and Kotlin (Jetpack Glance).</li>
                  <li>Performance Optimization: Implemented comprehensive production monitoring and logging systems for rapid bottleneck identification.</li>
                  <li>R&D: Prototyped and implemented offline reading capabilities and in-article search features.</li>
                </ul>
              </div>
            </div>

            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Mobile Application Developer</h3>
                <span>Feb 2022 - Feb 2023</span>
              </div>
              <span className={styles.company}>Snappymob</span>
              <div className={styles.description}>
                <ul>
                  <li>MyAstro Super App: Served as a key developer in a staff augmentation team for the high-traffic MyAstro application.</li>
                  <li>Feature Expansion: Developed new reward systems, inbox features, and robust deep-linking infrastructure.</li>
                  <li>Quality Assurance: Authored comprehensive unit tests and documentation to ensure high software stability.</li>
                  <li>Code Refactoring: Troubleshot and refactored legacy modules to improve code readability and performance.</li>
                </ul>
              </div>
            </div>

            <div className={styles.experienceItem}>
              <div className={styles.roleHeader}>
                <h3>Mobile Application Developer</h3>
                <span>Jul 2021 - Feb 2022</span>
              </div>
              <span className={styles.company}>Artisan IT Solutions</span>
              <div className={styles.description}>
                <ul>
                  <li>Enterprise Solutions: Developed a mobile application for a healthcare device company to monitor inventories and manage outstation tasks.</li>
                  <li>Database Design: Designed a flexible and optimized relational SQLite database schema for reliable offline data access.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
             <h2 className={styles.sectionTitle}>Key Projects</h2>
             <div className={styles.experienceItem}>
                <div className={styles.roleHeader}>
                   <h3>Yoymedia Website | Freelance</h3>
                   <span>May 2025</span>
                </div>
                <div className={styles.description}>
                   <ul>
                      <li>Designed and developed a responsive client website using Next.js, deployed on Vercel.</li>
                      <li>Configured Cloudflare CDN to optimize asset delivery and reduce latency.</li>
                   </ul>
                </div>
             </div>
          </section>
        </div>
      </div>
    </main>
  );
}
