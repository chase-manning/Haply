import React, { Component } from "react";
import styled from "styled-components";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";

const Reward = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  align-items: center;
  margin-bottom: 5px;
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
  unlocked: boolean;
  description: string;
  color?: string;
};

export default class AcheivementReward extends Component<Props> {
  render() {
    return (
      <Reward>
        {!this.props.unlocked && (
          <RewardIcon color={"var(--sub)"}>
            <LockOutlinedIcon fontSize={"inherit"} />
          </RewardIcon>
        )}
        {this.props.unlocked && (
          <RewardIcon color={"var(--primary)"}>
            <DoneOutlinedIcon fontSize={"inherit"} />
          </RewardIcon>
        )}
        <RewardDescription>{this.props.description}</RewardDescription>
        {this.props.color && <Color color={this.props.color!} />}
      </Reward>
    );
  }
}
