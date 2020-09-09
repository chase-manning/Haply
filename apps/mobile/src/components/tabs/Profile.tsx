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
import earlyBird from "../../assets/svgs/undraw_japan_ubgk.svg";
import lunchDate from "../../assets/svgs/undraw_eating_together_tjhx.svg";
import nightOwl from "../../assets/svgs/undraw_working_late_pukg.svg";
import feelingAmazing from "../../assets/svgs/undraw_super_thank_you_obwk.svg";
import slowDay from "../../assets/svgs/undraw_book_reading_kx9s.svg";
import activeDay from "../../assets/svgs/undraw_hiking_d24r.svg";
import meatyDay from "../../assets/svgs/undraw_Hamburger_8ge6.svg";
import theJourney from "../../assets/svgs/undraw_home_cinema_l7yl.svg";
import settleIn from "../../assets/svgs/undraw_decorative_friends_q2np.svg";
import forBreakfast from "../../assets/svgs/undraw_breakfast_psiw.svg";
import aHabbit from "../../assets/svgs/undraw_icon_design_qvdf.svg";
import aRoutine from "../../assets/svgs/undraw_my_universe_lxnl.svg";
import aLifestyle from "../../assets/svgs/undraw_snap_the_moment_oyn6.svg";

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

    // Early Bird
    achievementList.push(
      new AchievementModel(
        earlyBird,
        this.state.moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour >= 5 && hour <= 6;
        })
          ? 1
          : 0
      )
    );

    // Lunch Date
    achievementList.push(
      new AchievementModel(
        lunchDate,
        this.state.moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour === 12;
        })
          ? 1
          : 0
      )
    );

    // Night Owl
    achievementList.push(
      new AchievementModel(
        nightOwl,
        this.state.moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour >= 21 || hour <= 3;
        })
          ? 1
          : 0
      )
    );

    // Feeling Amazing
    achievementList.push(
      new AchievementModel(
        feelingAmazing,
        this.state.moods.some((mood: Mood) => mood.value === 10) ? 1 : 0
      )
    );

    const days: string[] = this.state.moods.map((mood: Mood) =>
      dateFormat(mood.date, "d - m - yyyy")
    );

    let dayCount: number = 0;
    days.forEach((day: string) => {
      let count: number = days.filter((day2: string) => day2 === day).length;
      if (count > dayCount) dayCount = count;
    });

    const todaysCount: number = days.filter(
      (day: string) => day === dateFormat(new Date(), "d - m - yyyy")
    ).length;

    // Slow Day
    achievementList.push(
      new AchievementModel(slowDay, dayCount >= 5 ? 1 : todaysCount / 5)
    );

    // Active Day
    achievementList.push(
      new AchievementModel(activeDay, dayCount >= 20 ? 1 : todaysCount / 20)
    );

    // Meaty Day
    achievementList.push(
      new AchievementModel(meatyDay, dayCount >= 50 ? 1 : todaysCount / 50)
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

    let maxDays: number = 1;
    let currentDays: number = 1;
    let lastDate: number = -1;

    this.state.moods.forEach((mood: Mood) => {
      let day: number = Number.parseInt(dateFormat(mood.date, "d"));
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
      new AchievementModel(aRoutine, Math.min(maxDays / 30, 1))
    );

    // A Lifestyle
    achievementList.push(
      new AchievementModel(aLifestyle, Math.min(maxDays / 365, 1))
    );

    return achievementList.sort(function (a, b) {
      return b.percentComplete - a.percentComplete;
    });
  }
}
