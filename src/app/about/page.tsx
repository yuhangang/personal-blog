import type { Metadata } from "next";
import KertasActionList from "@/components/common/KertasActionList/KertasActionList";
import PageCover from "@/components/common/PageCover/PageCover";
import { PROJECTS, RESUME_CONTACT } from "@/data/experience";
import { calculateAge } from "@/utils/date";
import styles from "./about.module.scss";

const STUDIO_PROJECT =
  PROJECTS.find((p) => p.id === "pelbag-ai") ?? PROJECTS[0];

const INTERESTS = [
  "Photography",
  "Hiking",
  "Road Trips",
  "Mobile & Web",
] as const;

const ABOUT_ACTIONS = [
  {
    title: "Resume",
    subtitle: "Work history, skills, and PDF",
    href: "/resume",
  },
  {
    title: STUDIO_PROJECT.name,
    subtitle: "My web development agency",
    href: STUDIO_PROJECT.href,
    external: true,
  },
] as const;

export const metadata: Metadata = {
  title: "About | Yu Hang Ang",
  description:
    "About Yu Hang Ang, software engineer based in Kuala Lumpur, Malaysia.",
};

export default function AboutPage() {
  const age = calculateAge("1998-01-06");

  return (
    <main className={styles.page} data-theme="dark">
      <PageCover
        src="/images/about-cover.webp"
        alt="Yu Hang Ang standing with trekking poles and a backpack on a stone trail beside a waterfall at the Manaslu Circuit, Nepal"
        credit="Manaslu Circuit, Nepal · Oct 2024"
        ariaLabel="Profile cover"
        focal="manaslu"
        immersive
        headerAlign="top-left"
        stickyHeader
        headline={
          <>
            About <em>Me</em>
          </>
        }
        subtitle="Software engineer in Kuala Lumpur."
      />

      <section id="about-bio" className={styles.content}>
        <div className={styles.spine}>
          <article className={styles.bio}>
            <p className={styles.kicker}>
              {RESUME_CONTACT.name.toUpperCase()}
            </p>
            <h1 className={styles.title}>
              Building for mobile and the web.
            </h1>

            <div className={styles.proseGroup}>
              <p className={styles.prose}>
                I&apos;m {age}, based in Kuala Lumpur. I lead the mobile team at
                BookDoc across iOS, Android, and Flutter, and work on web
                projects on the side.
              </p>
              <p className={styles.prose}>
                Before BookDoc, I built apps and backend systems at POS
                Malaysia, Lumi News, and Snappymob. Outside of work, I spend my
                time hiking and taking photos on trips.
              </p>
            </div>

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

            <KertasActionList
              items={ABOUT_ACTIONS}
              theme="dark"
              className={styles.actionList}
            />
          </article>
        </div>
      </section>
    </main>
  );
}
