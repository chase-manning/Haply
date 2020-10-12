import React from "react";
import styled from "styled-components";
import { StatModel } from "../../models/StatModel";
import Stat from "../shared/Stat";
import { useSelector } from "react-redux";
import { selectStats } from "../../state/dataSlice";

const StyledAnalytics = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Analytics = () => {
  const stats = useSelector(selectStats);

  return (
    <StyledAnalytics>
      {stats.map((stat: StatModel) => (
        <Stat stat={stat} />
      ))}
    </StyledAnalytics>
  );
};

export default Analytics;
