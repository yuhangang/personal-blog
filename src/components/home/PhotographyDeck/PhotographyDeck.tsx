import Image from "next/image";
import KertasActionList from "@/components/common/KertasActionList/KertasActionList";
import styles from "./PhotographyDeck.module.scss";

const DECK_FRAMES = [
  {
    src: "https://cdn.yuhangang.com/pantai-timor/thumb/78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    alt: "Red motorcycle parked under coconut palms on grass in Bachok, Kelantan",
    caption: "Bachok, Kelantan",
  },
  {
    src: "https://cdn.yuhangang.com/pantai-timor/thumb/DSC00068.jpg",
    alt: "Two fishermen sorting nets in a blue boat on the beach at Setiu, Terengganu, with two children watching",
    caption: "Setiu, Terengganu",
  },
  {
    src: "https://cdn.yuhangang.com/pantai-timor/thumb/DSC00234.jpg",
    alt: "Men gathered around a small wood fire beside a house and coconut palms in Besut, Terengganu",
    caption: "Besut, Terengganu",
  },
] as const;

const GALLERY_DESTINATIONS = [
  {
    title: "Gallery",
    subtitle: "Interactive 3D Earth photo atlas & visual essays",
    href: "/gallery",
    thumbnail: {
      src: "https://cdn.yuhangang.com/pantai-timor/thumb/DSC08235.jpg",
      alt: "Coastal village shoreline and sunlit palms along Malaysia's east coast",
    },
  },
] as const;

export default function PhotographyDeck() {
  return (
    <section
      id="photography"
      className={styles.section}
      aria-labelledby="photography-heading"
    >
      <div className={styles.spine}>
        <p className={styles.kicker}>PHOTOGRAPHY</p>
        <h2 id="photography-heading" className={styles.heading}>
          Gallery
        </h2>
        <p className={styles.prose}>
          Selected photographs, visual essays, and an interactive geographic
          archive.
        </p>

        <div className={styles.galleryGrid}>
          {DECK_FRAMES.map((frame) => (
            <figure key={frame.src} className={styles.frameCard}>
              <div className={styles.frameMedia}>
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 74vw, 270px"
                  className={styles.deckImage}
                />
              </div>
              <figcaption className={styles.frameCaption}>
                {frame.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <KertasActionList
          items={GALLERY_DESTINATIONS}
          className={styles.listTop}
        />
      </div>
    </section>
  );
}
