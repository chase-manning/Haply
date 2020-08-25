import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import Overlays from "./overlays/Overlays";
import { render } from "@testing-library/react";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export default class App extends Component {
  render() {
    return (
      <StyledApp data-testid="App">
        <Tabs></Tabs>
        <NavBar></NavBar>
        <Overlays></Overlays>
      </StyledApp>
    );
  }
}
