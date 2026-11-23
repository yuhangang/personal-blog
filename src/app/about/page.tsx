import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageCover from "@/components/common/PageCover/PageCover";
import { RESUME_CONTACT } from "@/data/experience";
import { SOCIAL_LINKS } from "@/config/social";
import { calculateAge } from "@/utils/date";
import styles from "./about.module.scss";

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
        scrollTargetId="about-bio"
        focal="manaslu"
        immersive
        headerAlign="top-left"
        showScrollCue={false}
        stickyHeader
        headline={
          <>
            About <em>Me</em>
          </>
        }
        subtitle={`${age}, software engineer in Kuala Lumpur — leading mobile at BookDoc.`}
      />

      <section id="about-bio" className={styles.content}>
        <div className={styles.spine}>
          <article className={styles.bio}>
          <h1 className={styles.title}>Yu Hang Ang</h1>

          <div className={styles.proseGroup}>
            <p className={styles.prose}>
              {age}, software engineer based in Kuala Lumpur, Malaysia. I
              currently lead the mobile team at BookDoc, working across iOS,
              Android, and Flutter.
            </p>
            <p className={styles.prose}>
              Before that, I built apps and backend systems at POS Malaysia,
              Lumi News, and Snappymob. Outside of work, I spend time on
              mountain trails and quiet coastal roads with a camera.
            </p>
            <p className={styles.prose}>
              Open to new opportunities for collaboration and learning.
            </p>
          </div>

          <nav className={styles.linksRow} aria-label="Resume and contact">
            <Link href="/resume" className={styles.primaryLink}>
              <span>View Resume</span>
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>

            <div className={styles.secondaryLinks}>
              <a
                href={`mailto:${RESUME_CONTACT.portfolioEmail}`}
                className={styles.textLink}
              >
                {RESUME_CONTACT.portfolioEmail}
              </a>
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.textLink}
                >
                  <span>{item.platform}</span>
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </nav>
        </article>
        </div>
      </section>
    </main>
  );
}
