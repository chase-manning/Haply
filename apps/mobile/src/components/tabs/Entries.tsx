import React, { Component } from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import Mood from "../../models/mood";
import { User } from "firebase";
import noData from "../../assets/svgs/Empty.svg";

const StyledEntries = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const NoDataContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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

type Props = {
  user: User;
  moods: Mood[];
  removeMood: (mood: Mood) => void;
};

export default class Entries extends Component<Props> {
  render() {
    const content =
      this.props.moods.length === 0 ? (
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
        this.entries
      );

    return <StyledEntries data-testid="Entries">{content}</StyledEntries>;
  }

  get entries(): JSX.Element[] {
    return this.props.moods
      .slice(0, 30)
      .map((mood: Mood) => (
        <Entry
          user={this.props.user}
          removeMood={(mood: Mood) => this.props.removeMood(mood)}
          mood={mood}
        />
      ));
  }
}
