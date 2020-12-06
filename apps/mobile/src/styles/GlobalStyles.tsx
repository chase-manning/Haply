import React from "react";
import { useSelector } from "react-redux";
import {
  Mode,
  selectColorPrimary,
  selectMode,
  selectColorSecondary,
} from "../state/settingsSlice";
import { createGlobalStyle } from "styled-components";

type GlobalSyleProps = {
  colorPrimary: string;
  colorSecondary: string;
  mode: Mode;
};

const GlobalStyle = createGlobalStyle`
    :root {
      --main: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "#24274C"
          : "rgba(255,255,255,0.87)"} ;
      --main-light: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "#24274C28"
          : "rgba(255,255,255,0.1)"} ;
      --sub: ;
      --sub: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "#a9b0c2"
          : "rgba(255,255,255,0.60)"} ;
      --sub-light: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "rgba(147,154,169, 0.1)"
          : "rgba(255,255,255,0.087)"} ;
      --primary: ${(props: GlobalSyleProps) => props.colorPrimary}; 
      --primary-light: ${(props: GlobalSyleProps) => props.colorPrimary + "12"};
      --highlight: ${(props: GlobalSyleProps) => props.colorSecondary};
      --highlight-light: ${(props: GlobalSyleProps) =>
        props.colorSecondary + "12"};
      --bg: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "#FCFBFF"
          : "#121212"} ;
      --bg-mid: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "white"
          : "#1F1F1F"} ;
      --bg-top: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "white"
          : "#2E2E2E"} ;
      --border: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "rgba(0,0,0,0.1)"
          : "none"};
      --shadow: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "0px 3px 20px 0px var(--primary-light)"
          : "none"};
      --shadow-clicked: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "0px 1px 7px 0px var(--primary-light)"
          : "none"};
    }
  
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Roboto", sans-serif;
    }
  
    button {
      background: none;
      border: none;
      outline: none;
    }

    select {
      -webkit-appearance: none;
    }
  `;

function GlobalStyles() {
  const colorPrimary = useSelector(selectColorPrimary);
  const colorSecondary = useSelector(selectColorSecondary);
  const mode = useSelector(selectMode);

  return (
    <GlobalStyle
      colorPrimary={colorPrimary}
      colorSecondary={colorSecondary}
      mode={mode}
    />
  );
}

export default GlobalStyles;
