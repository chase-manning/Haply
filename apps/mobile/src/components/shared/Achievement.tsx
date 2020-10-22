import React, { useState } from "react";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import Popup from "./Popup";
import AcheivementReward from "./AchievementReward";

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
  position: absolute;
  top: 50%;
  left: 50%;
  filter: ${(props: SvgProps) => {
    return props.isComplete ? "grayscale(0%)" : "grayscale(100%)";
  }};
  opacity: ${(props: SvgProps) => {
    return props.isComplete ? "1" : "0.5";
  }};
`;

const Shadow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 5px;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
`;

const Icon = styled.button`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
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

type Props = {
  achievement: AchievementModel;
};

class State {
  detailsOpen: boolean = false;
}

const Acheivement = (props: Props) => {
  const [state, setState] = useState(new State());

  return (
    <StyledAcheivement>
      <Shadow>
        <Icon onClick={() => setState({ detailsOpen: true })}>
          <Svg
            src={props.achievement.svg}
            isComplete={props.achievement.percentComplete === 1}
          />
          <Overlay />
        </Icon>
      </Shadow>
      {props.achievement.percentComplete < 1 && (
        <Progress>
          <Complete percentComplete={props.achievement.percentComplete} />
        </Progress>
      )}
      {state.detailsOpen && (
        <Popup
          content={
            <PopupContent>
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
            </PopupContent>
          }
          showButton={false}
          close={() => setState({ detailsOpen: false })}
        ></Popup>
      )}
    </StyledAcheivement>
  );
};

export default Acheivement;
