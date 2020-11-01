import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AchievementModel from "../../models/AchievementModel";
import { selectAchievements } from "../../state/dataSlice";
import { selectAchievementsLoading } from "../../state/loadingSlice";
import { Card, Header } from "../../styles/Shared";
import Acheivement from "../shared/Achievement";
import AchievementPopupContent from "../shared/AchievementPopupContent";
import LoadingLine from "../shared/LoadingLine";
import Popup from "../shared/Popup";

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

class State {
  popupAchievement?: AchievementModel;
}

const Achievements = () => {
  const [state, setState] = useState(new State());

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
                <Acheivement
                  achievement={achievment}
                  openPopup={() => setState({ popupAchievement: achievment })}
                />
              ))}
            </AchievementsList>
          </Card>
        </AchievementSection>
      )}
      {inProgressAchievements.length > 0 && ( //TODO Remove this duplication
        <AchievementSection>
          <Header>In Progress</Header>
          <Card>
            <AchievementsList>
              {inProgressAchievements.map((achievment: AchievementModel) => (
                <Acheivement
                  achievement={achievment}
                  openPopup={() => setState({ popupAchievement: achievment })}
                />
              ))}
            </AchievementsList>
          </Card>
        </AchievementSection>
      )}
      <Popup
        open={!!state.popupAchievement}
        content={
          <AchievementPopupContent achievement={state.popupAchievement!} />
        }
        showButton={false}
        close={() => setState({ popupAchievement: undefined })}
      ></Popup>
    </StyledAchievements>
  );
};

export default Achievements;
