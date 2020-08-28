import React, { Component } from "react";
import styled from "styled-components";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { moodDescriptions, MoodResponse } from "../../models/mood";

const StyledEntry = styled.div`
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

type Props = {
  mood: MoodResponse;
};

export default class Entry extends Component<Props> {
  render() {
    return (
      <StyledEntry data-testid="Entry">
        <EntryText>
          <EntryHeader>
            {moodDescriptions[this.props.mood.data.value]}
          </EntryHeader>
          <EntrySubHeader>Monday, 2:34pm</EntrySubHeader>
        </EntryText>
        <DeleteOutline />
      </StyledEntry>
    );
  }
}
