import type { Metadata } from "next";
import PageCover from "@/components/common/PageCover/PageCover";
import PracticeSection from "@/components/home/PracticeSection/PracticeSection";
// WIP: temporarily hidden while gallery pages are in progress
// import PhotographyDeck from "@/components/home/PhotographyDeck/PhotographyDeck";
import styles from "./home.module.scss";

export const metadata: Metadata = {
  title: "Yu Hang Ang",
  description:
    "Personal site of Yu Hang Ang in Kuala Lumpur, Malaysia — photographs, mountain trails, and mobile & web software.",
};

export default function Home() {
  return (
    <main className={styles.page} data-theme="light">
      <PageCover
        src="/images/yuhang_at_penang.webp"
        alt="Yu Hang Ang sitting in a folding chair on a pier at Butterworth, Penang, looking toward Penang Island across the strait"
        credit="Butterworth Pier, Penang"
        ariaLabel="Home cover"
        scrollTargetId="practice"
        focal="penang"
        headline={
          <>
            Explore, <em>Evolve</em>
          </>
        }
        subtitle="Software engineer in Kuala Lumpur — mobile apps, web, mountain trails, and coastal backroads."
      />
      <PracticeSection />
      {/* <PhotographyDeck /> */}
    </main>
  );
}
