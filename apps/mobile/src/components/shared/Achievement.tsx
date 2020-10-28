import React, { useState } from "react";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import Popup from "./Popup";
import AchievementPopupContent from "./AchievementPopupContent";

const StyledAcheivement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-color: var(--bg-mid);
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
      <Popup
        open={state.detailsOpen}
        content={<AchievementPopupContent achievement={props.achievement} />}
        showButton={false}
        close={() => setState({ detailsOpen: false })}
      ></Popup>
    </StyledAcheivement>
  );
};

export default Acheivement;
