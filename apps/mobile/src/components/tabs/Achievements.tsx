import React, { Component } from "react";
import styled from "styled-components";
import { User } from "firebase";
import Mood from "../../models/mood";
import AchievementModel from "../../models/AchievementModel";
import Acheivement from "../shared/Achievement";

const StyledAchievements = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Acheivements = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
`;

type Props = {
  user: User;
  moods: Mood[];
  achievements: AchievementModel[];
};

export default class Achievements extends Component<Props> {
  render() {
    return (
      <StyledAchievements data-testid="Profile">
        <Acheivements>
          {this.props.achievements.map((achievment: AchievementModel) => (
            <Acheivement achievement={achievment} />
          ))}
        </Acheivements>
      </StyledAchievements>
    );
  }
}
