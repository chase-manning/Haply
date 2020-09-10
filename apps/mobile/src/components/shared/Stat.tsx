import React, { Component } from "react";
import styled from "styled-components";
import { Card } from "../../styles/Card";
import { StatModel, StatType } from "../../models/StatModel";
import StatBar from "./StatBar";
import StatChart from "./StatChart";

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 20px;
`;

type Props = {
  stat: StatModel;
};

export default class Stat extends Component<Props> {
  render() {
    return (
      <Card data-testid="Stat">
        <Header>{this.props.stat.title}</Header>
        {this.props.stat.type === StatType.Bar && (
          <StatBar dataPoints={this.props.stat.dataPoints}></StatBar>
        )}
        {this.props.stat.type === StatType.Chart && (
          <StatChart dataPoints={this.props.stat.dataPoints}></StatChart>
        )}
      </Card>
    );
  }
}
