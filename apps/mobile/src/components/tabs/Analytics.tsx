import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { StatModel } from "../../models/StatModel";
import Stat from "../shared/Stat";
import { useSelector } from "react-redux";
import { selectColorPrimary } from "../../state/tempSlice";

const StyledAnalytics = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

type Props = {
  moods: Mood[];
  stats: StatModel[];
};

const Analytics = (props: Props) => {
  const colorPrimary = useSelector(selectColorPrimary);

  return (
    <StyledAnalytics data-testid="Stats">
      {props.stats.map((stat: StatModel) => (
        <Stat stat={stat} colorPrimary={colorPrimary} />
      ))}
    </StyledAnalytics>
  );
};

export default Analytics;
