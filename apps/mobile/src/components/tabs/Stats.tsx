import React, { Component } from "react";
import styled from "styled-components";
import Stat from "../shared/Stat";
import { CircularProgress } from "@material-ui/core";
import { User } from "firebase";
import { StatModel, StatType, Column } from "../../models/StatModel";
import Mood, { MoodResponse } from "../../models/mood";
import MoodService from "../../services/MoodService";
import dateFormat from "dateformat";

const StyledStats = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

class StatsState {
  stats: any = [];
}

type Props = {
  user: User;
};

export default class Stats extends Component<Props> {
  state: StatsState;

  constructor(props: any) {
    super(props);
    this.state = new StatsState();
  }

  componentDidMount() {
    this.populateStats();
  }

  render() {
    return (
      <StyledStats data-testid="Stats">
        {this.state.stats.length === 0 && (
          <CircularProgress style={{ color: "var(--primary)" }} />
        )}
        {this.state.stats}
      </StyledStats>
    );
  }

  async populateStats(): Promise<void> {
    let moods: Mood[] = await this.getMoods();
    let stats: StatModel[] = [];

    // Feeling by Week Day
    const weekDays: string[] = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
    stats.push({
      title: "Feeling by Week Day",
      type: StatType.Bar,
      columns: weekDays.map((weekDay: string) => {
        return {
          label: weekDay.substring(0, 1),
          percent: this.dailyAverage(moods, weekDay) / 10,
        };
      }),
    });

    // End Processing
    this.setState({
      stats: stats.map((stat: StatModel) => <Stat stat={stat} />),
    });
  }

  async getMoods(): Promise<Mood[]> {
    const response: any = await MoodService.getMoods(
      this.props.user.uid,
      "date"
    );

    const moodResponses: MoodResponse[] = await response.json();

    let moods: Mood[] = [];
    moodResponses.forEach((moodResponse: MoodResponse) => {
      moods.push(moodResponse.data);
    });
    return moods;
  }

  dailyAverage(moods: Mood[], day: string): number {
    let dayList: Mood[] = moods.filter(
      (mood: Mood) => dateFormat(mood.date, "ddd") === day
    );
    return dayList.length === 0
      ? 0
      : dayList.map((day: Mood) => day.value).reduce((a, b) => a + b) /
          dayList.length;
  }
}
