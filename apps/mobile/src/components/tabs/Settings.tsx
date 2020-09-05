import React, { Component } from "react";
import styled from "styled-components";
import { Line } from "../../styles/Line";

const StyledSettings = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const Label = styled.div`
  color: var(--sub);
  width: 50%;
`;

const Value = styled.div`
  color: var(--main);
  width: 50%;
`;

export default class Settings extends Component {
  render() {
    return (
      <StyledSettings data-testid="Settings">
        <Line>
          <Label>Meow</Label>
          <Value>Meow</Value>
        </Line>
        <Line>
          <Label>Meow</Label>
          <Value>Meow</Value>
        </Line>
        <Line>
          <Label>Meow</Label>
          <Value>Meow</Value>
        </Line>
        <Line>
          <Label>Meow</Label>
          <Value>Meow</Value>
        </Line>
        <Line>
          <Label>Meow</Label>
          <Value>Meow</Value>
        </Line>
        <Line>
          <Label>Meow</Label>
          <Value>Meow</Value>
        </Line>
      </StyledSettings>
    );
  }
}
