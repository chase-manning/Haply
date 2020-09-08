import React, { Component } from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import MoodService from "../../services/MoodService";
import { MoodResponse } from "../../models/mood";
import CircularProgress from "@material-ui/core/CircularProgress";
import { User } from "firebase";
import noData from "../../assets/svgs/undraw_empty_xct9.svg";

const StyledEntries = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  overflow: auto;
`;

const NoDataContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoDataHeader = styled.div`
  font-size: 16px;
  color: var(--main);
  margin-top: 30px;
`;

const NoDataSub = styled.div`
  font-size: 12px;
  margin-top: 15px;
  color: var(--sub);
  width: 70%;
  text-align: center;
  line-height: 1.5;
`;

class EntriesState {
  isLoading: boolean = true;
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
    if (this.state.moods.length > 0) {
      this.state.moods.forEach((mood) => {
        entries.push(
          <Entry
            removeMood={(moodId: string) => this.removeMood(moodId)}
            mood={mood}
          />
        );
      });
    }

    const content = this.state.isLoading ? ( //TODO Split out NoData into seperate component
      <CircularProgress style={{ color: "var(--primary)" }} />
    ) : this.state.moods.length === 0 ? (
      <NoDataContainer>
        <NoData>
          <img src={noData} alt="No Data Found Illustration" width="60%" />
          <NoDataHeader>No Entries</NoDataHeader>
          <NoDataSub>
            Record how you are Feeling. New Entries will appear here.
          </NoDataSub>
        </NoData>
      </NoDataContainer>
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
    this.setState({ moods: moods, isLoading: false });
  }
}
