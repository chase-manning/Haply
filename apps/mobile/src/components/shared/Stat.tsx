import React, { Component } from "react";
import styled from "styled-components";
import { Day } from "../../services/AnalyticsService";

const StyledStat = styled.div`
  width: 100%;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 20px;
`;

const Chart = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ChartRow = styled.div`
  height: 150px;
  width: 20px;
  display: flex;
  flex-direction: column;
`;

const Column = styled.div`
  height: 90%;
  width: 100%;
  background-color: var(--primary-light);
  border-radius: 10px;
  position: relative;
`;

type FilledPercentage = {
  value: string;
};

const Filled = styled.div`
  position: absolute;
  left: 0;
  border-radius: 10px;
  bottom: 0;
  height: ${(props: FilledPercentage) => props.value};
  width: 100%;
  background-color: var(--primary);
`;

const Label = styled.div`
  width: 100%;
  color: var(--sub);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

type Props = {
  days: Day[];
};

export default class Entry extends Component<Props> {
  render() {
    let columns: any = [];
    this.props.days.forEach((day: Day) => {
      columns.push(
        <ChartRow>
          <Column>
            <Filled value={day.percent}></Filled>
          </Column>
          <Label>{day.dayletter}</Label>
        </ChartRow>
      );
    });

    return (
      <StyledStat data-testid="Stat">
        <Header>Daily Mood</Header>
        <Chart>{columns}</Chart>
      </StyledStat>
    );
  }
}
