import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import { selectAchievements } from "../../state/dataSlice";
import Acheivement from "../shared/Achievement";

const StyledAchievements = styled.div`
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const Achievements = () => {
  const achievements = useSelector(selectAchievements);

  return (
    <StyledAchievements>
      {achievements.map((achievment: AchievementModel) => (
        <Acheivement achievement={achievment} />
      ))}
    </StyledAchievements>
  );
};

export default Achievements;
