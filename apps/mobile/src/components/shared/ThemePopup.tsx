import React from "react";
import styled from "styled-components";
import Popup from "../shared/Popup";
import AchievementModel from "../../models/AchievementModel";
import { useSelector } from "react-redux";
import { selectColorPrimary } from "../../state/settingsSlice";
import { selectAchievements } from "../../state/dataSlice";

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ColorOptions = styled.div`
  width: 100%;
  display: grid;
  grid-row-gap: 10px;
  align-items: center;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

type ColorOptionProps = {
  selected: boolean;
  color: string;
};

const ColorOption = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props: ColorOptionProps) =>
    props.selected ? "solid 2px " + props.color : "none"};
`;

type ColorProps = {
  color: string;
};

const Color = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props: ColorProps) => props.color};
`;

const UnlockText = styled.div`
  width: 100%;
  text-align: center;
  color: var(--sub);
  font-size: 14px;
  margin-top: 20px;
`;

type Props = {
  open: boolean;
  closePopup: () => void;
  defaultColor: string;
  setTheme: (color: string) => void;
  currentColor: string;
};

const ThemePopup = (props: Props) => {
  const achievements = useSelector(selectAchievements);
  const unlockedAchievements = achievements.filter(
    (achievement: AchievementModel) =>
      achievement.colorPrimary !== "" && achievement.percentComplete === 1
  );

  return (
    <Popup
      open={props.open}
      content={
        <PopupContent>
          <ColorOptions>
            <ColorOption
              onClick={() => props.setTheme(props.defaultColor)}
              selected={props.defaultColor === props.currentColor}
              color={props.currentColor}
            >
              <Color color={props.defaultColor} />
            </ColorOption>
            {unlockedAchievements.map((achievement: AchievementModel) => (
              <ColorOption
                key={achievement.colorPrimary}
                onClick={() => props.setTheme(achievement.colorPrimary)}
                selected={achievement.colorPrimary === props.currentColor}
                color={props.currentColor}
              >
                <Color color={achievement.colorPrimary} />
              </ColorOption>
            ))}
          </ColorOptions>
          {unlockedAchievements.length < 4 && (
            <UnlockText>Complete Achievements for more</UnlockText>
          )}
        </PopupContent>
      }
      showButton={true}
      close={() => props.closePopup()}
    />
  );
};

export default ThemePopup;
