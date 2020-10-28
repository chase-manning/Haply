import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import {
  selectAchievements,
  selectAchievementsLoading,
} from "../../state/dataSlice";
import { Card, Header } from "../../styles/Shared";
import Acheivement from "../shared/Achievement";
import LoadingLine from "../shared/LoadingLine";

const StyledAchievements = styled.div`
  width: 100%;
  padding: 15px 30px;
  position: relative;
`;

const AchievementSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const AchievementsList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 15px;
`;

const Achievements = () => {
  const achievements = useSelector(selectAchievements);
  const achievementsLoading = useSelector(selectAchievementsLoading);

  const completedAchievements = achievements.filter(
    (achievement: AchievementModel) => achievement.percentComplete === 1
  );
  const inProgressAchievements = achievements.filter(
    (achievement: AchievementModel) => achievement.percentComplete < 1
  );

  return (
    <StyledAchievements>
      <LoadingLine loading={achievementsLoading} />
      {completedAchievements.length > 0 && (
        <AchievementSection>
          <Header>Completed</Header>
          <Card>
            <AchievementsList>
              {completedAchievements.map((achievment: AchievementModel) => (
                <Acheivement achievement={achievment} />
              ))}
            </AchievementsList>
          </Card>
        </AchievementSection>
      )}
      {inProgressAchievements.length > 0 && (
        <AchievementSection>
          <Header>In Progress</Header>
          <Card>
            <AchievementsList>
              {inProgressAchievements.map((achievment: AchievementModel) => (
                <Acheivement achievement={achievment} />
              ))}
            </AchievementsList>
          </Card>
        </AchievementSection>
      )}
    </StyledAchievements>
  );
};

export default Achievements;
