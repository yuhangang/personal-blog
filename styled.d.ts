import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      backgroundColor: string;
      textColor: string;
      focusTextColor: string;
      toggleBg: string;
      toggleColor: string;
    };
  }
}
