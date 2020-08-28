import React, { Component } from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";

const StyledEntries = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  background-color: var(--bg);
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  background-color: white;
  color: var(--sub);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export default class Entries extends Component {
  render() {
    return (
      <StyledEntries data-testid="Entries">
        <Header>Entries</Header>
        <TabContent>
          <Entry></Entry>
        </TabContent>
      </StyledEntries>
    );
  }
}
