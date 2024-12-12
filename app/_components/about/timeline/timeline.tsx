import Link from "next/link";
import { ConstrainedSection } from "../../common/constraint";
import styles from "./timeline.module.scss";

export interface TimeLineData {
  dateTime: string;
  title: string;
  detail?: string | JSX.Element;
  link?: string;
}

function TimeLineItem(props: TimeLineData): JSX.Element {
  const detail = props.link ? (
    <div className={styles.timeLineLink} key={props.title}>
      <Link href={props.link}>
        <div className={styles.timeLineLinkFont}>Explore</div>
      </Link>
      <br />
    </div>
  ) : null;

  return (
    <li className={styles.timelineItem}>
      <span className={styles.timelineInfo}>{props.dateTime}</span>
      <div className={styles.timelineMarker} />
      <div className={styles.timelineContent}>
        <h3>{props.title}</h3>
        {props.detail || ""}
        {detail}
      </div>
    </li>
  );
}

export default function TimeLine({
  title,
  items,
}: {
  title: string;
  items: TimeLineData[];
}) {
  return (
    <ConstrainedSection>
      <div className={styles.workContainer}>
        <h2 className={styles.workTitle}>{title}</h2>
        <br />
        <ul className={styles.timeline}>
          {items?.map((item) => (
            <TimeLineItem
              key={item.title}
              dateTime={item.dateTime}
              title={item.title}
              detail={item.detail}
              link={item.link}
            />
          ))}
        </ul>
      </div>
    </ConstrainedSection>
  );
}
