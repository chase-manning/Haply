import React, { Component } from "react";
import styled from "styled-components";
import Home from "./components/Home";

const StyledApp = styled.div`
  width: 100%;
`;

export default class App extends Component {
  render() {
    return (
      <StyledApp>
        <Home />
      </StyledApp>
    );
  }
}
