import React, { Component } from "react";
import styled from "styled-components";
import { User } from "firebase";
import Mood from "../../models/mood";
import { StatModel } from "../../models/StatModel";
import Stat from "../shared/Stat";

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
  stats: StatModel[];
};

export default class Stats extends Component<Props> {
  render() {
    return <StyledStats data-testid="Stats">{this.stats}</StyledStats>;
  }

  get stats(): JSX.Element[] {
    return this.props.stats.map((stat: StatModel) => <Stat stat={stat} />);
  }
}
