import React from "react";
import { useSelector } from "react-redux";
import { Mode, selectColorPrimary, selectMode } from "../state/settingsSlice";
import { createGlobalStyle } from "styled-components";

type GlobalSyleProps = {
  colorPrimary: string;
  mode: Mode;
};

const GlobalStyle = createGlobalStyle`
    :root {
      --main: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "#24274C"
          : "rgba(255,255,255,0.87)"} ;
      --sub: ;
      --sub: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "#9399A9"
          : "rgba(255,255,255,0.60)"} ;
      --sub-light: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "rgba(147,154,169, 0.1)"
          : "rgba(255,255,255,0.087)"} ;
      --primary: ${(props: GlobalSyleProps) => props.colorPrimary}; 
      --primary-light: ${(props: GlobalSyleProps) => props.colorPrimary + "11"};
      --highlight: #FF6584;
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
          ? "none"
          : "none"};
      --shadow: ${(props: GlobalSyleProps) =>
        props.mode === Mode.Default || props.mode === Mode.Light
          ? "0px 3px 20px 0px var(--primary-light)"
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
  const mode = useSelector(selectMode);

  return <GlobalStyle colorPrimary={colorPrimary} mode={mode} />;
}

export default GlobalStyles;
