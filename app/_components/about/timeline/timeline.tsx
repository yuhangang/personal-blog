import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import {
  Timeline,
  TimelineItem as StyledTimelineItem,
  TimelineInfo,
  TimelineMarker,
  TimelineContent,
  TimeLineLinkFont,
  TimeLineLink,
  WorkContainer,
  WorkTitle,
  StyledTimeline,
  TimelineTitle,
} from "./timeline.style";
import { ConstrainedSection, NavbarSpacer } from "../../common/constraint";

// Additional styled components specific to this implementation

interface TimeLineData {
  dateTime: string;
  title: string;
  detail?: string | JSX.Element;
  link?: string;
}

function TimeLineItem(props: TimeLineData): JSX.Element {
  const detail = props.link ? (
    <TimeLineLink key={props.title}>
      <Link href={props.link}>
        <TimeLineLinkFont as="div">Explore</TimeLineLinkFont>
      </Link>
      <br />
    </TimeLineLink>
  ) : (
    <div></div>
  );

  return (
    <StyledTimelineItem>
      <TimelineInfo>{props.dateTime}</TimelineInfo>
      <TimelineMarker />
      <TimelineContent>
        <TimelineTitle>{props.title}</TimelineTitle>
        {props.detail || ""}
        {detail}
      </TimelineContent>
    </StyledTimelineItem>
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
      <WorkContainer
        initial="pageInitial"
        animate="pageAnimate"
        variants={{
          pageInitial: {
            opacity: 0,
          },
          pageAnimate: {
            opacity: 1,
          },
        }}
      >
        <WorkTitle>{title}</WorkTitle>
        <br />
        <StyledTimeline>
          {items
            ? items.map((item) => (
                <TimeLineItem
                  key={item.title}
                  dateTime={item.dateTime}
                  title={item.title}
                  detail={item.detail}
                  link={item.link}
                />
              ))
            : []}
        </StyledTimeline>
      </WorkContainer>
    </ConstrainedSection>
  );
}
