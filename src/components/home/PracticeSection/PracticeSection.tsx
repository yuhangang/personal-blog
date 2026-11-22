import KertasActionList from "@/components/common/KertasActionList/KertasActionList";
import { PROJECTS, RESUME_CONTACT } from "@/data/experience";
import styles from "./PracticeSection.module.scss";

const STUDIO_PROJECT =
  PROJECTS.find((p) => p.id === "pelbag-ai") ?? PROJECTS[0];

const INTERESTS = [
  "Photography",
  "Mountain Trails",
  "Coastal Backroads",
  "Mobile & Web",
] as const;

const HOME_ACTIONS = [
  {
    title: "About",
    subtitle: "A closer look at my background and story",
    href: "/about",
  },
  {
    title: "Resume",
    subtitle: "Work history, skills, and A4 PDF",
    href: "/resume",
  },
  {
    title: STUDIO_PROJECT.name,
    subtitle: "Web development agency built with Next.js and Three.js",
    href: STUDIO_PROJECT.href,
    external: true,
  },
] as const;

export default function PracticeSection() {
  return (
    <section
      id="practice"
      className={styles.section}
      aria-labelledby="practice-heading"
    >
      <div className={styles.spine}>
        <p className={styles.kicker}>
          {RESUME_CONTACT.name.toUpperCase()} ·{" "}
          {RESUME_CONTACT.location.toUpperCase()}
        </p>
        <h1 id="practice-heading" className={styles.heading}>
          Software engineer, building for mobile and the web.
        </h1>
        <p className={styles.prose}>
          Based in Kuala Lumpur, where I lead mobile engineering across iOS,
          Android, and Flutter and build web projects on the side. Outside of
          work, I spend time hiking and photographing trails and coastal towns.
        </p>

        <div className={styles.focusBar}>
          <span className={styles.focusLabel}>Interests</span>
          <ul className={styles.focusList}>
            {INTERESTS.map((item) => (
              <li key={item} className={styles.focusItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <KertasActionList items={HOME_ACTIONS} className={styles.listTop} />
      </div>
    </section>
  );
}
