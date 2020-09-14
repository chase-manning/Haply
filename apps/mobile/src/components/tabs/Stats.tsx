import React, { Component } from "react";
import styled from "styled-components";
import Stat from "../shared/Stat";
import { User } from "firebase";
import { StatModel, StatType, DataPoint } from "../../models/StatModel";
import Mood from "../../models/mood";
import dateFormat from "dateformat";

const StyledStats = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

type Props = {
  user: User;
  moods: Mood[];
};

export default class Stats extends Component<Props> {
  render() {
    return <StyledStats data-testid="Stats">{this.stats}</StyledStats>;
  }

  get stats(): JSX.Element[] {
    let stats: StatModel[] = [];

    stats.push(this.createStatLine(this.props.moods, "d/m/yyyy", 1, "Day"));
    stats.push(
      this.createStatLine(this.props.moods, "m/yyyy", 365 / 12, "Month")
    );
    stats.push(this.createStatLine(this.props.moods, "yyyy", 365, "Year"));

    stats.push(
      this.createStatBar(
        this.props.moods,
        "ddd",
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "Day",
        true
      )
    );

    stats.push(
      this.createStatBar(
        this.props.moods,
        "mmm",
        [
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
        ],
        "Month",
        true
      )
    );

    stats.push(
      this.createStatBar(
        this.props.moods,
        "H",
        [
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
        ],
        "Hour",
        false
      )
    );

    stats.sort(function (a, b) {
      return b.percentComplete - a.percentComplete;
    });

    stats.sort(function (a: any, b: any) {
      return b.locked + a.locked;
    });

    return stats.map((stat: StatModel) => <Stat stat={stat} />);
  }

  createStatLine(
    moods: Mood[],
    format: string,
    daysIncrement: number,
    periodName: string
  ): StatModel {
    let periods: string[] = [];

    for (let i: number = 0; i < 20; i++) {
      periods.push(
        dateFormat(
          new Date().setDate(new Date().getDate() - i * daysIncrement),
          format
        )
      );
    }

    const dataPoints: DataPoint[] = periods
      .filter((period: string) => this.dateAverage(moods, format, period) >= 0)
      .map((period: string) => {
        return {
          label: "",
          value: this.dateAverage(moods, format, period),
        };
      })
      .reverse();

    return {
      title: "Feeling by " + periodName,
      type: StatType.Chart,
      locked: dataPoints.length < 3,
      lockedMessage:
        "Record your Feeling three " + periodName + "s in a row to unlock",
      percentComplete: dataPoints.length / 3,
      dataPoints: dataPoints,
    };
  }

  createStatBar(
    moods: Mood[],
    format: string,
    periods: string[],
    periodName: string,
    truncateLabel: boolean
  ): StatModel {
    let dataPoints: DataPoint[] = periods
      .filter((period: string) => this.dateAverage(moods, format, period) >= 0)
      .map((period: string) => {
        return {
          label: truncateLabel ? period.substring(0, 1) : period,
          value: this.dateAverage(moods, format, period),
        };
      });

    return {
      title: "Average Feeling by " + periodName,
      type: StatType.Bar,
      locked: dataPoints.length < periods.length,
      lockedMessage: "Record a feeling for every " + periodName + " to unlock",
      percentComplete: dataPoints.length / periods.length,
      dataPoints: dataPoints,
    };
  }

  dateAverage(moods: Mood[], format: string, value: string): number {
    let dayList: Mood[] = moods.filter(
      (mood: Mood) => dateFormat(mood.date, format) === value
    );
    return dayList.length === 0
      ? -1
      : Math.round(
          (dayList.map((day: Mood) => day.value).reduce((a, b) => a + b) /
            dayList.length) *
            10
        ) / 10;
  }
}
