import React, { Component } from "react";
import styled from "styled-components";
import MoodService from "../../services/MoodService";
import { User } from "firebase";
import Achievement from "../shared/Achievement";
import Mood, { MoodResponse } from "../../models/mood";
import { CircularProgress } from "@material-ui/core";
import dateFormat from "dateformat";
import AchievementModel from "../../models/AchievementModel";

import firstSteps from "../../assets/svgs/undraw_relaunch_day_902d.svg";
import nightOwl from "../../assets/svgs/undraw_working_late_pukg.svg";
import earlyBird from "../../assets/svgs/undraw_japan_ubgk.svg";
import theJourney from "../../assets/svgs/undraw_home_cinema_l7yl.svg";
import settleIn from "../../assets/svgs/undraw_decorative_friends_q2np.svg";
import forBreakfast from "../../assets/svgs/undraw_breakfast_psiw.svg";
import aHabbit from "../../assets/svgs/undraw_icon_design_qvdf.svg";

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
    const response: any = await MoodService.getMoods(
      this.props.user.uid,
      "date"
    );

    const moodResponses: MoodResponse[] = await response.json();

    let moods: Mood[] = [];
    console.log(moodResponses);
    moodResponses.forEach((moodResponse: MoodResponse) => {
      moods.push(moodResponse.data);
    });

    this.setState({ moods: moods, isLoading: false });
  }

  get achievements(): AchievementModel[] {
    // TODO Change this to only run once
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

    // Early Bird
    achievementList.push(
      new AchievementModel(
        earlyBird,
        this.state.moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour >= 5 || hour <= 7;
        })
          ? 1
          : 0
      )
    );

    // The Journey
    achievementList.push(
      new AchievementModel(
        theJourney,
        Math.min(this.state.moods.length / 10, 1)
      )
    );

    // Settle In
    achievementList.push(
      new AchievementModel(settleIn, Math.min(this.state.moods.length / 100, 1))
    );

    // For Breakfast
    achievementList.push(
      new AchievementModel(
        forBreakfast,
        Math.min(this.state.moods.length / 1000, 1)
      )
    );

    // For Breakfast
    achievementList.push(
      new AchievementModel(
        forBreakfast,
        Math.min(this.state.moods.length / 1000, 1)
      )
    );

    let maxDays: number = 1;
    let currentDays: number = 1;
    let lastDate: number = -1;

    this.state.moods.forEach((mood: Mood) => {
      let day: number = Number.parseInt(dateFormat(mood.date, "d"));
      console.log(day);
      if (day === lastDate - 1) currentDays++;
      lastDate = day;
      if (currentDays > maxDays) maxDays = currentDays;
    });

    // A Habbit
    achievementList.push(
      new AchievementModel(aHabbit, Math.min(maxDays / 7, 1))
    );

    // A Routine
    achievementList.push(
      new AchievementModel(forBreakfast, Math.min(maxDays / 30, 1))
    );

    // A Lifestyle
    achievementList.push(
      new AchievementModel(forBreakfast, Math.min(maxDays / 365, 1))
    );

    return achievementList;
  }
}
