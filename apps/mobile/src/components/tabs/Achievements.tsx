import React, { Component } from "react";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import Acheivement from "../shared/Achievement";

const StyledAchievements = styled.div`
  width: 100%;
  padding: 20px;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
`;

type Props = {
  achievements: AchievementModel[];
};

export default class Achievements extends Component<Props> {
  render() {
    return (
      <StyledAchievements>
        {this.props.achievements.map((achievment: AchievementModel) => (
          <Acheivement achievement={achievment} />
        ))}
      </StyledAchievements>
    );
  }
}
