import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --main: black;
    --sub: #9399A9;
    --primary: #4071FE; 
    --primary-light: rgba(64,114,253,0.1);
    --primary-shadow: drop-shadow( 0px 5px 10px rgba(64,114,253, 0.5));
    --highlight: #FF6584;
    --bg: #F9FAFC;
    --blue: #5A8BFF;
    --yellow: #FFCF66;
    --red: #FF6C8E;
    --border: rgba(0,0,0,0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App></App>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
