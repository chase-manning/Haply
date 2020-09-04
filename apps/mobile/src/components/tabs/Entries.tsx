import React, { Component } from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import MoodService from "../../services/MoodService";
import { MoodResponse } from "../../models/mood";
import CircularProgress from "@material-ui/core/CircularProgress";
import { User } from "firebase";

const StyledEntries = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class EntriesState {
  moods: MoodResponse[] = [];
}

type Props = {
  user: User;
};

export default class Entries extends Component<Props> {
  state: EntriesState;

  constructor(props: any) {
    super(props);
    this.state = new EntriesState();
  }

  componentDidMount() {
    this.getMoods();
  }

  render() {
    const entries: JSX.Element[] = [];
    this.state.moods.forEach((mood) => {
      entries.push(
        <Entry
          removeMood={(moodId: string) => this.removeMood(moodId)}
          mood={mood}
        />
      );
    });

    const content =
      entries.length === 0 ? (
        <CircularProgress style={{ color: "var(--primary)" }} />
      ) : (
        entries
      );

    return <StyledEntries data-testid="Entries">{content}</StyledEntries>;
  }

  removeMood(moodId: string): void {
    const moods: MoodResponse[] = this.state.moods.filter(
      (mood) => mood.id !== moodId
    );
    this.setState({ moods: moods });
  }

  async getMoods(): Promise<void> {
    const response = await MoodService.getMoods(
      this.props.user.uid,
      "date",
      20
    );
    const moods: MoodResponse[] = await response.json();
    this.setState({ moods: moods });
  }
}
