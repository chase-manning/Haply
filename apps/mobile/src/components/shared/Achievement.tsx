import React, { Component } from "react";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import Popup from "./Popup";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import { inherits } from "util";

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
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
  background-color: white;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-top: solid 2px rgba(255, 255, 255, 0.5);
  border-left: solid 2px rgba(255, 255, 255, 0.5);
`;

const Progress = styled.div`
  width: 80%;
  height: 4px;
  border-radius: 2px;
  background-color: var(--primary-light);
  margin-top: 5px;
`;

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const SvgDetails = styled.img`
  width: 100%;
  filter: ${(props: SvgProps) => {
    return props.isComplete ? "grayscale(0%)" : "grayscale(100%)";
  }};
  opacity: ${(props: SvgProps) => {
    return props.isComplete ? "1" : "0.5";
  }};
`;

const Title = styled.div`
  text-align: center;
  width: 100%;
  font-size: 16px;
  color: var(--main);
  margin-top: 30px;
`;

const Description = styled.div`
  font-size: 12px;
  margin: 10px 0 12px 0;
  color: var(--sub);
  width: 70%;
  text-align: center;
  line-height: 1.5;
`;

const RewardsHeader = styled.div`
  color: var(--main);
  font-size: 14px;
  padding-top: 12px;
  margin-bottom: 6px;
  border-top: solid 1px var(--sub);
  text-align: center;
  width: 80%;
`;

const Reward = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  align-items: center;
`;

type RewardIconProps = {
  color: string;
};

const RewardIcon = styled.div`
  color: ${(props: RewardIconProps) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RewardDescription = styled.div`
  color: var(--sub);
  margin-left: 5px;
`;

type ColorProps = {
  color: string;
};

const Color = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props: ColorProps) => props.color};
  margin-left: 5px;
`;

type Props = {
  achievement: AchievementModel;
};

class State {
  detailsOpen: boolean = false;
}

export default class Acheivement extends Component<Props> {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  render() {
    return (
      <StyledAcheivement data-testid="Achievement">
        <Icon onClick={() => this.setState({ detailsOpen: true })}>
          <Svg
            src={this.props.achievement.svg}
            isComplete={this.props.achievement.percentComplete === 1}
          />
          <Overlay />
        </Icon>
        {this.props.achievement.percentComplete < 1 && (
          <Progress>
            <Complete
              percentComplete={this.props.achievement.percentComplete}
            />
          </Progress>
        )}
        {this.state.detailsOpen && (
          <Popup
            content={
              <PopupContent>
                <SvgDetails
                  src={this.props.achievement.svg}
                  isComplete={this.props.achievement.percentComplete === 1}
                />
                <Title>{this.props.achievement.title}</Title>
                <Description>{this.props.achievement.description}</Description>
                <RewardsHeader>Rewards</RewardsHeader>
                <Reward>
                  {this.props.achievement.percentComplete !== 1 && (
                    <RewardIcon color={"var(--sub)"}>
                      <LockOutlinedIcon fontSize={"inherit"} />
                    </RewardIcon>
                  )}
                  {this.props.achievement.percentComplete === 1 && (
                    <RewardIcon color={"var(--primary)"}>
                      <DoneOutlinedIcon fontSize={"inherit"} />
                    </RewardIcon>
                  )}
                  <RewardDescription>Theme Color</RewardDescription>
                  <Color color={this.props.achievement.colorPrimary} />
                </Reward>
              </PopupContent>
            }
            showButton={false}
            closePopup={() => this.setState({ detailsOpen: false })}
          ></Popup>
        )}
      </StyledAcheivement>
    );
  }
}
