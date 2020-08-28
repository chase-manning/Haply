import React, { Component } from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import MoodService from "../../services/MoodService";
import Mood from "../../models/mood";

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

class EntriesState {
  moods: Mood[] = [];
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
      entries.push(<Entry />);
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
    const moods: Mood[] = await response.json();
    this.setState({ moods: moods });
    console.log(this.state);
  }
}
