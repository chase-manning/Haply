import React from "react";
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

const AcheivementReward = (props: Props) => {
  return (
    <Reward>
      {!props.unlocked && (
        <RewardIcon color={"var(--sub)"}>
          <LockOutlinedIcon fontSize={"inherit"} />
        </RewardIcon>
      )}
      {props.unlocked && (
        <RewardIcon color={"var(--primary)"}>
          <DoneOutlinedIcon fontSize={"inherit"} />
        </RewardIcon>
      )}
      <RewardDescription>{props.description}</RewardDescription>
      {props.color && <Color color={props.color!} />}
    </Reward>
  );
};

export default AcheivementReward;
