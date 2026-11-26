import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./KertasActionList.module.scss";

export interface KertasActionItem {
  title: string;
  subtitle: string;
  href: string;
  external?: boolean;
  thumbnail?: {
    src: string;
    alt: string;
  };
}

interface KertasActionListProps {
  items: readonly KertasActionItem[];
  attached?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

export default function KertasActionList({
  items,
  attached = false,
  theme = "light",
  className = "",
}: KertasActionListProps) {
  return (
    <div
      className={`${attached ? styles.attachedGroup : styles.cardGroup} ${
        theme === "dark" ? styles.dark : ""
      } ${className}`.trim()}
    >
      {items.map((item) => {
        const isOutbound =
          Boolean(item.external) ||
          item.href.startsWith("http") ||
          item.href.startsWith("mailto:");
        const isNewTab = Boolean(item.external) || item.href.startsWith("http");

        const content = (
          <>
            <div className={styles.rowMain}>
              {item.thumbnail && (
                <div className={styles.thumbFrame}>
                  <Image
                    src={item.thumbnail.src}
                    alt={item.thumbnail.alt}
                    fill
                    sizes="56px"
                    className={styles.thumbImg}
                  />
                </div>
              )}
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>{item.title}</span>
                <span className={styles.rowSub}>{item.subtitle}</span>
              </div>
            </div>
            <span
              className={`${styles.arrowCircle} ${
                isOutbound ? styles.arrowDiagonal : ""
              }`.trim()}
              aria-hidden="true"
            >
              {isOutbound ? (
                <ArrowUpRight size={16} strokeWidth={1.75} />
              ) : (
                <ArrowRight size={16} strokeWidth={1.75} />
              )}
            </span>
          </>
        );

        if (isOutbound) {
          return (
            <a
              key={item.href + item.title}
              href={item.href}
              target={isNewTab ? "_blank" : undefined}
              rel={isNewTab ? "noopener noreferrer" : undefined}
              className={styles.actionRow}
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            key={item.href + item.title}
            href={item.href}
            className={styles.actionRow}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
