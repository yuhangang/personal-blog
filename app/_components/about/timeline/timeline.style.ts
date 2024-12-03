import styled, { css } from "styled-components";

const primaryColor = "rgb(151, 37, 37)";
const primaryColorHover = "rgb(201, 74, 74)";

export const TimeLineLink = styled.div`
  width: 16rem;
  max-width: 58vw;
  align-items: center;
  text-align: center;
`;

export const TimeLineLinkFont = styled.button`
  position: absolute;
  right: 15px;
  bottom: 10px;
  margin: 20px 20px;
  width: 5.5rem;
  background-color: transparent;
  border: 1px solid rgba(200, 200, 200);
  border-radius: 1rem;
  padding: 0.2rem 1rem;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const ContainerFluid = styled.div`
  .row {
    padding: 0 0 4em 0;
    &:nth-child(even) {
      background: #f1f4f5;
    }
  }
`;

export const Timeline = styled.ul`
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

export const TimelineItem = styled.li`
  margin: 20px 0px;
  padding-left: 25px;
  position: relative;
  list-style-type: none;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const TimelineInfo = styled.span`
  font-weight: 300;
  letter-spacing: 3px;
  margin: 0 0 0.5em 0;
  padding: 0px 10px;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const TimelineMarker = styled.div`
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

export const TimelineContent = styled.div`
  overflow: clip;
  padding-left: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  transition: 0.5s;
  font-weight: 300;
  color: rgba(230, 230, 230);

  p:last-child {
    margin-bottom: 0;
  }

  h3 {
    transition: 0.5s;
    color: rgba(115, 114, 119);
  }

  &:hover {
    color: white;
    text-shadow: 2px 2px 5px grey;

    h3 {
      text-shadow: none;
      color: rgba(146, 144, 130);
    }
  }

  @media (min-width: 768px) {
    padding-bottom: 15px;
  }
`;

export const PeriodStyles = css`
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

export const TimelineSplit = styled(Timeline)`
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

export const TimelineCentered = styled(TimelineSplit)`
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

export const MarkerOutline = styled.div`
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
