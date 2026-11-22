import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import ExportPdfButton from "@/components/resume/ExportPdfButton";
import {
  EXPERIENCES,
  PROJECTS,
  RESUME_CONTACT,
  RESUME_SUMMARY,
  SKILL_GROUPS,
} from "@/data/experience";
import styles from "./resume.module.scss";

export const metadata: Metadata = {
  title: "Resume | Yu Hang Ang",
  description:
    "Resume, software engineering experience, capabilities, and selected projects by Yu Hang Ang.",
};

export default function ResumePage() {
  return (
    <main className={styles.page} data-theme="light">
      <div className={styles.folio}>
        <header className={styles.masthead}>
          <p className={styles.kicker}>{RESUME_CONTACT.location}</p>
          <h1 className={styles.name}>
            {RESUME_CONTACT.name}
            <span>
              {RESUME_CONTACT.title} · {RESUME_CONTACT.subtitle}
            </span>
          </h1>

          <div className={styles.contactStrip}>
            <div className={styles.contactLinks}>
              <a
                href={`mailto:${RESUME_CONTACT.email}`}
                className={styles.contactLink}
              >
                {RESUME_CONTACT.email}
              </a>
              <a
                href={RESUME_CONTACT.phoneHref}
                className={styles.contactLink}
              >
                {RESUME_CONTACT.phone}
              </a>
              <a
                href={RESUME_CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <span>GitHub</span>
                <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                href={RESUME_CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <span>LinkedIn</span>
                <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
            <div className={`${styles.contactActions} ${styles.noPrint}`}>
              <ExportPdfButton />
            </div>
          </div>
        </header>

        <section className={styles.summarySection} aria-label="Summary">
          {RESUME_SUMMARY.map((paragraph) => (
            <p key={paragraph} className={styles.prose}>
              {paragraph}
            </p>
          ))}
        </section>

        <section
          className={styles.section}
          aria-labelledby="resume-experience"
        >
          <h2 id="resume-experience" className={styles.kicker}>
            01 · EXPERIENCE
          </h2>
          <ol className={styles.cardGroup}>
            {EXPERIENCES.map((exp) => (
              <li key={exp.id} className={styles.roleEntry}>
                <div className={styles.roleHeader}>
                  <h3 className={styles.company}>{exp.company}</h3>
                  <span className={styles.period}>{exp.period}</span>
                </div>
                <p className={styles.roleLine}>
                  {exp.role} · <span>{exp.domain}</span>
                </p>
                <ul className={styles.bulletList}>
                  {exp.description.map((bullet) => (
                    <li key={bullet} className={styles.bulletItem}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="resume-skills">
          <h2 id="resume-skills" className={styles.kicker}>
            02 · SKILLS &amp; STACK
          </h2>
          <ul className={styles.cardGroup}>
            {SKILL_GROUPS.map((group) => (
              <li key={group.category} className={styles.skillEntry}>
                <h3 className={styles.skillCategory}>{group.category}</h3>
                <p className={styles.skillList}>{group.skills}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="resume-projects">
          <h2 id="resume-projects" className={styles.kicker}>
            03 · SELECTED PROJECTS
          </h2>
          <ul className={styles.cardGroup}>
            {PROJECTS.map((project) => (
              <li key={project.id} className={styles.projectEntry}>
                <div className={styles.roleHeader}>
                  <h3 className={styles.company}>{project.name}</h3>
                  <div className={styles.projectLinks}>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectUrl}
                    >
                      <span>{project.displayUrl}</span>
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </a>
                    {project.secondaryLink && (
                      <a
                        href={project.secondaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectUrl}
                      >
                        <span>{project.secondaryLink.label}</span>
                        <ArrowUpRight
                          size={13}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                </div>
                <ul className={styles.bulletList}>
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className={styles.bulletItem}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
