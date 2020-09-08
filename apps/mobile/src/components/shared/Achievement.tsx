import React, { Component } from "react";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";

const StyledAcheivement = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  align-items: center;
  padding: 10px;
`;

type SvgProps = {
  isComplete: boolean;
};

const Svg = styled.img`
  width: 220%;
  transform: translate(-50%, -50%);
  position: relative;
  top: 50%;
  left: 50%;
  filter: ${(props: SvgProps) => {
    return props.isComplete ? "grayscale(0%)" : "grayscale(100%)";
  }};
  opacity: ${(props: SvgProps) => {
    return props.isComplete ? "1" : "0.5";
  }};
`;

const Icon = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  width: 80%;
  height: 4px;
  border-radius: 2px;
  background-color: var(--primary-light);
  margin-top: 5px;
`;

type CompleteProps = {
  percentComplete: number;
};

const Complete = styled.div`
  width: ${(props: CompleteProps) => {
    return props.percentComplete * 100 + "%";
  }};
  height: 4px;
  border-radius: 2px;
  background-color: var(--primary);
`;

type Props = {
  achievement: AchievementModel;
};

export default class Acheivement extends Component<Props> {
  render() {
    return (
      <StyledAcheivement data-testid="Achievement">
        <Icon>
          <Svg
            src={this.props.achievement.svg}
            isComplete={this.props.achievement.percentComplete === 1}
          />
        </Icon>
        {this.props.achievement.percentComplete < 1 && (
          <Progress>
            <Complete
              percentComplete={this.props.achievement.percentComplete}
            />
          </Progress>
        )}
      </StyledAcheivement>
    );
  }
}
