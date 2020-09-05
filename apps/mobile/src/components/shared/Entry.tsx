import React, { Component } from "react";
import styled from "styled-components";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { moodDescriptions, MoodResponse } from "../../models/mood";
import dateFormat from "dateformat";
import MoodService from "../../services/MoodService";
import { Line } from "../../styles/Line";

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
  removeMood: (moodId: string) => void;
};

export default class Entry extends Component<Props> {
  async deleteMood(): Promise<void> {
    MoodService.deleteMood(this.props.mood.id);
    this.props.removeMood(this.props.mood.id);
  }

  render() {
    return (
      <Line data-testid="Entry">
        <EntryText>
          <EntryHeader>
            {moodDescriptions[this.props.mood.data.value]}
          </EntryHeader>
          <EntrySubHeader>
            {dateFormat(this.props.mood.data.date, " dddd h:MM tt")}
          </EntrySubHeader>
        </EntryText>
        <DeleteOutline onClick={() => this.deleteMood()} />
      </Line>
    );
  }
}
