import { css, Global } from "@emotion/react";

const STYLES = css`
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Roboto", Arial, Helvetica, sans-serif;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-font-smooting: antialiased;
    -moz-font-smooting: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
  }
`;

// Generic variables
export const GENERICS = {
  primaryColor: "#00a82d",
  primaryColorDark: "#008f26",
  border: "1px solid #f1f1f1",
  bgColor: "#f8f8f8",
  colorBlack: "#222",
  colorBlackCalm: "#444",
  colorGray: "#737373",
  boxShadow: "#ccc 0px 4px 5px -2px",
};

export const MIXINS = {
  va: (align = "center") => css`
    display: flex;
    align-items: center;
    ${align !== "center"
      ? `
      justify-content: ${align};
        `
      : `
      justify-content: center;
      `}
  `,
};

export const GlobalStyles = () => <Global styles={STYLES} />;
