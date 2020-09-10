import React, { Component } from "react";
import styled from "styled-components";
import Stat from "../shared/Stat";
import { CircularProgress } from "@material-ui/core";
import { User } from "firebase";
import { StatModel, StatType, DataPoint } from "../../models/StatModel";
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
      dataPoints: weekDays.map((weekDay: string) => {
        return {
          label: weekDay.substring(0, 1),
          value: this.dateAverage(moods, "ddd", weekDay),
        };
      }),
    });

    const months: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    stats.push({
      title: "Feeling by Month",
      type: StatType.Bar,
      dataPoints: months.map((month: string) => {
        return {
          label: month.substring(0, 1),
          value: Math.round(this.dateAverage(moods, "mmm", month)),
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

  dateAverage(moods: Mood[], format: string, value: string): number {
    let dayList: Mood[] = moods.filter(
      (mood: Mood) => dateFormat(mood.date, format) === value
    );
    return dayList.length === 0
      ? 0
      : Math.round(
          (dayList.map((day: Mood) => day.value).reduce((a, b) => a + b) /
            dayList.length) *
            10
        ) / 10;
  }
}
