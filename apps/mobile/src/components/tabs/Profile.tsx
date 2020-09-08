import React, { Component } from "react";
import styled from "styled-components";
import MoodService from "../../services/MoodService";
import { User } from "firebase";
import Achievement from "../shared/Achievement";
import Mood, { MoodResponse } from "../../models/mood";
import { CircularProgress } from "@material-ui/core";
import dateFormat from "dateformat";
import AchievementModel from "../../models/AchievementModel";

import nightOwl from "../../assets/svgs/undraw_working_late_pukg.svg";
import firstSteps from "../../assets/svgs/undraw_stepping_up_g6oo.svg";
import theJourney from "../../assets/svgs/undraw_through_the_park_lxnl.svg";

const StyledProfile = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Acheivements = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
`;

class ProfileState {
  moods: Mood[] = [];
  isLoading: boolean = true;
}

type Props = {
  user: User;
};

export default class Profile extends Component<Props> {
  state: ProfileState;

  constructor(props: any) {
    super(props);
    this.state = new ProfileState();
  }

  componentDidMount() {
    this.getMoods();
  }

  render() {
    let achievements: any[] = [];
    this.achievements.forEach((achievement: AchievementModel) => {
      achievements.push(<Achievement achievement={achievement} />);
    });

    return (
      <StyledProfile data-testid="Profile">
        {this.state.isLoading && (
          <CircularProgress
            style={{ color: "var(--primary)", marginTop: "20px" }}
          />
        )}
        {!this.state.isLoading && <Acheivements>{achievements}</Acheivements>}
      </StyledProfile>
    );
  }

  async getMoods(): Promise<void> {
    const response: any = await MoodService.getMoods(this.props.user.uid);

    const moodResponses: MoodResponse[] = await response.json();

    let moods: Mood[] = [];
    console.log(moodResponses);
    moodResponses.forEach((moodResponse: MoodResponse) => {
      moods.push(moodResponse.data);
    });

    this.setState({ moods: moods, isLoading: false });
  }

  get achievements(): AchievementModel[] {
    let achievementList: AchievementModel[] = [];

    // First Steps
    achievementList.push(
      new AchievementModel(firstSteps, this.state.moods.length >= 1 ? 1 : 0)
    );

    // Night Owl
    achievementList.push(
      new AchievementModel(
        nightOwl,
        this.state.moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour >= 21 || hour <= 4;
        })
          ? 1
          : 0
      )
    );

    // The Journey
    achievementList.push(
      new AchievementModel(
        firstSteps,
        Math.min(this.state.moods.length / 10, 1)
      )
    );

    return achievementList;
  }
}
