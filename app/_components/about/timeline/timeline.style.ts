import { motion } from "framer-motion";
import styled, { css } from "styled-components";

const primaryColor = "rgb(151, 37, 37)";
const primaryColorHover = "rgb(201, 74, 74)";

const TimeLineLink = styled.div`
  width: 16rem;
  max-width: 58vw;
  align-items: center;
  text-align: center;
`;

const TimeLineLinkFont = styled.button`
  position: absolute;
  right: 15px;
  bottom: 10px;
  margin: 20px 20px;
  width: 5.5rem;
  border: 1px solid rgba(200, 200, 200);
  border-radius: 1rem;
  padding: 0.2rem 1rem;
  color: ${(props) => props.theme.colors.textColor};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${(props) => props.theme.colors.focusTextColor};
  }
`;

const ContainerFluid = styled.div`
  .row {
    padding: 0 0 4em 0;
    &:nth-child(even) {
      background: #f1f4f5;
    }
  }
`;

const Timeline = styled.ul`
  line-height: 1.4em;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: inherit;
  }
`;

const TimelineItem = styled.li`
  margin: 20px 0px;
  padding-left: 25px;
  position: relative;
  list-style-type: none;

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineInfo = styled.span`
  font-weight: 300;
  letter-spacing: 3px;
  margin: 0 0 0.5em 0;
  padding: 0px 10px;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.textColor};
`;

const TimelineMarker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20px;
  transition: 0.5s;

  &:before {
    background: ${primaryColor};
    border-radius: 100%;
    content: "";
    display: block;
    height: 15px;
    position: absolute;
    top: 4px;
    left: 0;
    width: 15px;
    transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
  }

  &:after {
    content: "";
    width: 3px;
    background: ${primaryColor};
    display: block;
    position: absolute;
    top: 24px;
    bottom: 0;
    left: 6px;
  }

  ${TimelineItem}:last-child &:after {
    content: none;
  }

  ${TimelineItem}:not(.period):hover &:before,
  ${TimelineItem}:not(.period):hover &:after {
    background: ${primaryColorHover};
  }
`;

const TimelineContent = styled.div`
  overflow: clip;
  padding-left: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  transition: 0.5s;
  font-weight: 300;
  color: ${(props) => props.theme.colors.textColor};

  p:last-child {
    margin-bottom: 0;
  }

  h3 {
    transition: 0.5s;
    color: ${(props) => props.theme.colors.primary};
  }

  &:hover {
    h3 {
      text-shadow: none;
      color: ${(props) => props.theme.colors.secondary};
    }
  }

  @media (min-width: 768px) {
    padding-bottom: 15px;
  }
`;

const PeriodStyles = css`
  padding: 0;

  ${TimelineInfo} {
    display: none;
  }

  ${TimelineMarker} {
    &:before {
      background: transparent;
      content: "";
      width: 15px;
      height: auto;
      border: none;
      border-radius: 0;
      top: 0;
      bottom: 30px;
      position: absolute;
      border-top: 3px solid #ccd5db;
      border-bottom: 3px solid #ccd5db;
    }

    &:after {
      content: "";
      height: 32px;
      top: auto;
    }
  }

  ${TimelineContent} {
    padding: 40px 0 70px;
  }
`;

const TimelineSplit = styled(Timeline)`
  @media (min-width: 768px) {
    display: table;

    ${TimelineItem} {
      display: table-row;
      padding: 0;
    }

    ${TimelineInfo}, ${TimelineMarker}, ${TimelineContent} {
      display: table-cell;
      vertical-align: top;
    }

    ${TimelineMarker} {
      position: relative;
    }

    ${TimelineContent} {
      padding-left: 30px;
    }

    ${TimelineInfo} {
      padding-right: 30px;
    }
  }
`;

const TimelineCentered = styled(TimelineSplit)`
  @media (min-width: 992px) {
    &,
    ${TimelineItem}, ${TimelineInfo}, ${TimelineMarker}, ${TimelineContent} {
      display: block;
      margin: 0;
      padding: 0;
    }

    ${TimelineItem} {
      padding-bottom: 40px;
    }

    ${TimelineMarker} {
      position: absolute;
      left: 50%;
      margin-left: -7.5px;
    }

    ${TimelineInfo}, ${TimelineContent} {
      width: 50%;
    }

    > ${TimelineItem}:nth-child(odd) ${TimelineInfo} {
      float: left;
      text-align: right;
    }

    > ${TimelineItem}:nth-child(odd) ${TimelineContent} {
      float: right;
      text-align: left;
    }

    > ${TimelineItem}:nth-child(even) ${TimelineInfo} {
      float: right;
      text-align: left;
    }

    > ${TimelineItem}:nth-child(even) ${TimelineContent} {
      float: left;
      text-align: right;
    }

    > ${TimelineItem}.period ${TimelineContent} {
      float: none;
      padding: 0;
      width: 100%;
      text-align: center;
    }

    ${TimelineItem}.period {
      padding: 50px 0 90px;
    }

    .period ${TimelineMarker}:after {
      height: 30px;
      bottom: 0;
      top: auto;
    }
  }
`;

const MarkerOutline = styled.div`
  ${TimelineMarker} {
    &:before {
      background: transparent;
      border-color: ${primaryColor};
    }
  }

  ${TimelineItem}:hover ${TimelineMarker}:before {
    background: ${primaryColor};
  }
`;

const WorkContainer = styled(motion.div)`
  /* Add any specific styles from your work class */
`;

const WorkTitle = styled.h2`
  /* Add any specific styles for the title */
  color: ${(props) => props.theme.colors.textColor};
`;

const StyledTimeline = styled(Timeline)`
  /* Add any additional timeline styles from your scss modules */
`;

const TimelineTitle = styled.h3`
  /* Add any specific styles for timeline titles */
`;

export {
  TimeLineLink,
  TimeLineLinkFont,
  ContainerFluid,
  Timeline,
  TimelineItem,
  TimelineInfo,
  TimelineMarker,
  TimelineContent,
  PeriodStyles,
  TimelineSplit,
  TimelineCentered,
  MarkerOutline,
  WorkContainer,
  WorkTitle,
  StyledTimeline,
  TimelineTitle,
};
