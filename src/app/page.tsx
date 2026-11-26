import type { Metadata } from "next";
import PageCover from "@/components/common/PageCover/PageCover";
import styles from "./home.module.scss";

export const metadata: Metadata = {
  title: "Yu Hang Ang",
  description:
    "Yu Hang Ang, software engineer in Kuala Lumpur. Mobile and web work, plus photographs from the road.",
};

export default function Home() {
  return (
    <main className={styles.page} data-theme="dark">
      <PageCover
        src="/images/yuhang_at_penang.webp"
        alt="Yu Hang Ang sitting in a folding chair on a pier at Butterworth, Penang, looking toward Penang Island across the strait"
        credit="Butterworth Pier, Penang"
        ariaLabel="Home cover"
        focal="penang"
        immersive
        headline={
          <>
            Explore, <em>Evolve</em>
          </>
        }
        subtitle="Building software in Kuala Lumpur, and taking photos along the way."
      />
    </main>
  );
}
