import React, { Component } from "react";
import styled from "styled-components";

const StyledStats = styled.div`
  height: 100%;
  width: 100%;
  background-color: red;
`;

export default class Stats extends Component {
  render() {
    return <StyledStats data-testid="Stats">Stats Component</StyledStats>;
  }
}
