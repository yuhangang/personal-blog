import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ConstrainedSection } from "../../common/constraint";
import styles from "./Timeline.module.scss";

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
      <motion.div
        className={styles.workContainer}
        initial="pageInitial"
        animate="pageAnimate"
        variants={{
          pageInitial: { opacity: 0 },
          pageAnimate: { opacity: 1 },
        }}
      >
        <h2 className={styles.workTitle} style={{ color: "white" }}>
          {title}
        </h2>
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
      </motion.div>
    </ConstrainedSection>
  );
}
