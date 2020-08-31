import React, { Component } from "react";
import styled from "styled-components";
import Stat from "../shared/Stat";

const StyledStats = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default class Stats extends Component {
  render() {
    return (
      <StyledStats data-testid="Stats">
        <Stat />
      </StyledStats>
    );
  }
}
