import React from "react";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import AcheivementReward from "./AchievementReward";

const StyledAchievementPopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type SvgDetailsProps = {
  isComplete: boolean;
};

const SvgDetails = styled.img`
  width: 80%;
  filter: ${(props: SvgDetailsProps) => {
    return props.isComplete ? "grayscale(0%)" : "grayscale(100%)";
  }};
  opacity: ${(props: SvgDetailsProps) => {
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

type Props = {
  achievement: AchievementModel;
};

const AchievementPopupContent = (props: Props) => {
  return (
    <StyledAchievementPopupContent>
      <SvgDetails
        src={props.achievement.svg}
        isComplete={props.achievement.percentComplete === 1}
      />
      <Title>{props.achievement.title}</Title>
      <Description>{props.achievement.description}</Description>
      <RewardsHeader>Rewards</RewardsHeader>
      <AcheivementReward
        unlocked={props.achievement.percentComplete === 1}
        description={"Theme Color"}
        color={props.achievement.colorPrimary}
      />
      {props.achievement.unlocks.map((unlock: string) => (
        <AcheivementReward
          unlocked={props.achievement.percentComplete === 1}
          description={unlock}
        />
      ))}
    </StyledAchievementPopupContent>
  );
};

export default AchievementPopupContent;
