import styled from "styled-components";

const RetroList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: ${(props) => props.theme.colors.textColor};

  li {
    position: relative;
    padding: 0.75rem 0 0.75rem 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: -0.011em;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 1.125rem;
      width: 6px;
      height: 6px;
      background: #6c6c6c;
      border-radius: 50%;
    }
  }

  &:hover {
    color: ${(props) => props.theme.colors.focusTextColor};
  }
`;

export default RetroList;
