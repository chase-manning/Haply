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

const Meow = styled.div`
  position: absolute;
  right: 15px;
  color: var(--sub);
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.07);
  position: relative;
`;

const Setting = styled.div`
  width: 100%;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 2px;
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
