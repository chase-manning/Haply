import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import { StatModel } from "../../models/StatModel";
import {
  selectAchievements,
  selectStats,
  setAchievementAsOld,
  setStatAsOld,
} from "../../state/dataSlice";
import AchievementPopupContent from "./AchievementPopupContent";
import Popup from "./Popup";
import Stat from "./Stat";

const StyledAlerts = styled.div``;

const AlertPopup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const AlertHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--main);
`;

const Alerts = () => {
  const dispatch = useDispatch();
  const achievements = useSelector(selectAchievements);
  const newAchievements = achievements.filter(
    (achievment: AchievementModel) => achievment.isNew
  );
  const stats = useSelector(selectStats);
  const newStats = stats.filter((stat: StatModel) => stat.isNew);

  return (
    <StyledAlerts>
      <Popup
        open={newAchievements.length > 0 && newAchievements.length < 5}
        content={
          <AlertPopup>
            <AlertHeader>Achievement Unlocked!</AlertHeader>
            <AchievementPopupContent achievement={newAchievements[0]} />
          </AlertPopup>
        }
        showButton={true}
        close={() =>
          dispatch(
            setAchievementAsOld(achievements.indexOf(newAchievements[0]))
          )
        }
        buttonText={"Awesome!"}
      />
      <Popup
        open={
          (newAchievements.length === 0 || newAchievements.length >= 5) &&
          newStats.length > 0 &&
          newStats.length < 3
        }
        content={
          <AlertPopup>
            <AlertHeader>New Analytic Unlocked!</AlertHeader>
            <Stat stat={newStats[0]} />
          </AlertPopup>
        }
        showButton={true}
        close={() => dispatch(setStatAsOld(stats.indexOf(newStats[0])))}
        buttonText={"Awesome!"}
      />
    </StyledAlerts>
  );
};

export default Alerts;
