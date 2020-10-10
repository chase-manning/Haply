import React, { Component } from "react";
import styled from "styled-components";
import { Card } from "../../styles/Shared";
import { StatModel, StatType } from "../../models/StatModel";
import StatBar from "./StatBar";
import StatChart from "./StatChart";
import noData from "../../assets/svgs/NoData.svg";

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--main);
`;

const LockedStat = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Svg = styled.img`
  width: 40%;
`;

const Description = styled.div`
  font-size: 12px;
  margin-top: 15px;
  color: var(--sub);
  width: 100%;
  text-align: center;
  line-height: 1.5;
`;

const ProgressBar = styled.div`
  width: 70%;
  margin-top: 10px;
  height: 6px;
  border-radius: 3px;
  background-color: var(--primary-light);
`;

type CompleteProps = {
  percentComplete: number;
};

const Complete = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: var(--primary);
  width: ${(props: CompleteProps) => {
    return props.percentComplete * 100 + "%";
  }};
`;

type Props = {
  stat: StatModel;
  colorPrimary: string;
};

export default class Stat extends Component<Props> {
  render() {
    return (
      <Card data-testid="Stat">
        <Header>{this.props.stat.title}</Header>
        {this.props.stat.locked && (
          <LockedStat>
            <Svg src={noData} />
            <Description>{this.props.stat.lockedMessage}</Description>
            <ProgressBar>
              <Complete percentComplete={this.props.stat.percentComplete} />
            </ProgressBar>
          </LockedStat>
        )}
        {!this.props.stat.locked && this.props.stat.type === StatType.Bar && (
          <StatBar dataPoints={this.props.stat.dataPoints}></StatBar>
        )}
        {!this.props.stat.locked && this.props.stat.type === StatType.Chart && (
          <StatChart
            dataPoints={this.props.stat.dataPoints}
            colorPrimary={this.props.colorPrimary}
          ></StatChart>
        )}
      </Card>
    );
  }
}
