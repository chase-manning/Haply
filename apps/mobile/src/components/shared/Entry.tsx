import React, { Component } from "react";
import styled from "styled-components";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { moodDescriptions } from "../../models/mood";
import dateFormat from "dateformat";
import MoodService from "../../services/MoodService";
import { Line } from "../../styles/Line";
import Mood from "../../models/mood";
import { User } from "firebase";

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
  user: User;
  mood: Mood;
  removeMood: (mood: Mood) => void;
};

export default class Entry extends Component<Props> {
  async deleteMood(): Promise<void> {
    MoodService.deleteMood(this.props.user, this.props.mood.moodId!);
    this.props.removeMood(this.props.mood);
  }

  render() {
    return (
      <Line data-testid="Entry">
        <EntryText>
          <EntryHeader>{moodDescriptions[this.props.mood.value]}</EntryHeader>
          <EntrySubHeader>
            {dateFormat(this.props.mood.date, " dddd h:MM tt")}
          </EntrySubHeader>
        </EntryText>
        <DeleteOutline onClick={() => this.deleteMood()} />
      </Line>
    );
  }
}
