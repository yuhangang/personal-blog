import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    color: ${(props) =>
      props.theme.mode === "dark"
        ? "rgba(255, 255, 255, 0.87)"
        : "rgba(0, 0, 0, 0.87)"};
    background-color: ${(props) =>
      props.theme.mode === "dark" ? "#121212" : "#ffffff"};
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    transition: color 0.3s ease, background-color 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  @media (prefers-color-scheme: dark) {
    html,
    body {
      color: rgba(255, 255, 255, 0.87);
      background-color: #121212;
    }
  }

  @media (prefers-color-scheme: light) {
    html,
    body {
      color: rgba(0, 0, 0, 0.87);
      background-color: #ffffff;
    }
  }
`;

export default GlobalStyle;
