import React, { Component } from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import MoodService from "../../services/MoodService";
import Mood, { MoodResponse } from "../../models/mood";

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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: auto;
`;

class EntriesState {
  moods: MoodResponse[] = [];
}

export default class Entries extends Component {
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
      entries.push(<Entry mood={mood} />);
    });

    return (
      <StyledEntries data-testid="Entries">
        <Header>Entries</Header>
        <TabContent>{entries}</TabContent>
      </StyledEntries>
    );
  }

  async getMoods(): Promise<void> {
    const response = await MoodService.getMoods();
    const moods: MoodResponse[] = await response.json();
    console.log(moods);
    this.setState({ moods: moods });
  }
}
