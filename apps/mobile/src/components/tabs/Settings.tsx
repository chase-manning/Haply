import React, { Component } from "react";
import styled from "styled-components";
import NavigateNextOutlined from "@material-ui/icons/NavigateNextOutlined";

const StyledSettings = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  border: solid 1px var(--primary-light);
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
        <Section>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
            <Meow>
              <NavigateNextOutlined />
            </Meow>
          </Setting>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
          </Setting>
        </Section>
        <Section>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
          </Setting>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
          </Setting>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
          </Setting>
        </Section>
        <Section>
          <Setting>
            <Label>Meow</Label>
            <Value>Kring?</Value>
          </Setting>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
          </Setting>
          <Setting>
            <Label>Meow</Label>
            <Value>Meow</Value>
          </Setting>
        </Section>
      </StyledSettings>
    );
  }
}
