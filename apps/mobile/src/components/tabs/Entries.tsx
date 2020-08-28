import React, { Component } from "react";
import styled from "styled-components";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

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

const Entry = styled.div`
  width: 100%;
  margin: 10px 0;
  background-color: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.07);
  padding: 15px 20px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--sub);
`;

const EntryText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const EntryHeader = styled.div`
  color: black;
  margin-bottom: 10px;
`;

const EntrySubHeader = styled.div`
  color: var(--sub);
  font-size: 12px;
`;

export default class Entries extends Component {
  render() {
    return (
      <StyledEntries data-testid="Entries">
        <Header>Entries</Header>
        <TabContent>
          <Entry>
            <EntryText>
              <EntryHeader>Awesome!</EntryHeader>
              <EntrySubHeader>Monday, 2:34pm</EntrySubHeader>
            </EntryText>
            <DeleteOutline />
          </Entry>
        </TabContent>
      </StyledEntries>
    );
  }
}
