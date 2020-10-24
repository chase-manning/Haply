import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import { selectAchievements } from "../../state/dataSlice";
import Acheivement from "./Achievement";
import Popup from "./Popup";

const StyledAlerts = styled.div``;

const Alerts = () => {
  const achievements = useSelector(selectAchievements);
  const newAchievements = achievements.filter(
    (achievment: AchievementModel) => achievment.isNew
  );

  return (
    <StyledAlerts>
      {newAchievements.length > 0 && (
        <Popup
          content={<Acheivement achievement={newAchievements[0]} />}
          showButton={true}
          close={() => console.log("meow")}
        />
      )}
    </StyledAlerts>
  );
};

export default Alerts;
