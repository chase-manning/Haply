import React from "react";
import styled from "styled-components";
import { StatModel } from "../../models/StatModel";
import Stat from "../shared/Stat";
import { useSelector } from "react-redux";
import { selectStats } from "../../state/dataSlice";
import { selectStatsLoading } from "../../state/loadingSlice";
import LoadingLine from "../shared/LoadingLine";

const StyledAnalytics = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
`;

const Analytics = () => {
  const stats = useSelector(selectStats);
  const analyticsLoading = useSelector(selectStatsLoading);

  return (
    <StyledAnalytics>
      <LoadingLine loading={analyticsLoading} />
      {stats.map((stat: StatModel) => (
        <Stat key={stat.title} stat={stat} />
      ))}
    </StyledAnalytics>
  );
};

export default Analytics;
