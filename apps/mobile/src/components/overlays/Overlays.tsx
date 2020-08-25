import React, { Component } from "react";
import styled from "styled-components";
import Capture from "./Capture";

const StyledOverlays = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default class Overlays extends Component {
  render() {
    return (
      <StyledOverlays data-testid="Overlays">
        <Capture></Capture>
      </StyledOverlays>
    );
  }
}
