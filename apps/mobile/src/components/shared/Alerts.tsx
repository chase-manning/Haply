import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import { selectAchievements } from "../../state/dataSlice";
import AchievementPopupContent from "./AchievementPopupContent";
import Popup from "./Popup";

const StyledAlerts = styled.div``;

const AchievmentAlertPopup = styled.div`
  display: flex;
  flex-direction: column;
`;

const AchievementAlertHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--main);
`;

const Alerts = () => {
  const achievements = useSelector(selectAchievements);
  const newAchievements = achievements.filter(
    (achievment: AchievementModel) => achievment.isNew
  );

  return (
    <StyledAlerts>
      <Popup
        open={newAchievements.length > 0}
        content={
          <AchievmentAlertPopup>
            <AchievementAlertHeader>
              Achievement Unlocked!
            </AchievementAlertHeader>
            <AchievementPopupContent achievement={newAchievements[0]} />
          </AchievmentAlertPopup>
        }
        showButton={true}
        close={() => console.log("meow")}
        buttonText={"Awesome!"}
      />
    </StyledAlerts>
  );
};

export default Alerts;
