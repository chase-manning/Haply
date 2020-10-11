import React, { Component } from "react";
import styled from "styled-components";
import { User } from "firebase";
import Mood from "../../models/mood";
import { StatModel } from "../../models/StatModel";
import Stat from "../shared/Stat";

const StyledAnalytics = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

type Props = {
  moods: Mood[];
  stats: StatModel[];
  colorPrimary: string;
};

export default class Analytics extends Component<Props> {
  render() {
    return <StyledAnalytics data-testid="Stats">{this.stats}</StyledAnalytics>;
  }

  get stats(): JSX.Element[] {
    return this.props.stats.map((stat: StatModel) => (
      <Stat stat={stat} colorPrimary={this.props.colorPrimary} />
    ));
  }
}
