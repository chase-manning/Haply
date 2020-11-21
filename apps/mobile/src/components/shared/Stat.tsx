import React from "react";
import styled from "styled-components";
import { Card } from "../../styles/Shared";
import { StatModel, StatType } from "../../models/StatModel";
import StatBar from "./StatBar";
import StatChart from "./StatChart";
import noData from "../../assets/svgs/NoData.svg";
import StatPercent from "./StatPercent";
import StatComparison from "./StatComparison";

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--main);
`;

const LockedStat = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Svg = styled.img`
  width: 40%;
`;

const Description = styled.div`
  font-size: 12px;
  margin-top: 15px;
  color: var(--sub);
  width: 100%;
  text-align: center;
  line-height: 1.5;
`;

const ProgressBar = styled.div`
  width: 70%;
  margin-top: 10px;
  height: 6px;
  border-radius: 3px;
  background-color: var(--primary-light);
`;

type CompleteProps = {
  percentComplete: number;
};

const Complete = styled.div`
  height: 6px;
  border-radius: 3px;
  background-color: var(--primary);
  width: ${(props: CompleteProps) => {
    return props.percentComplete * 100 + "%";
  }};
`;

type Props = {
  stat: StatModel;
};

const Stat = (props: Props) => {
  return (
    <Card>
      <Header>{props.stat.title}</Header>
      {props.stat.locked && (
        <LockedStat>
          <Svg src={noData} />
          <Description>{props.stat.lockedMessage}</Description>
          <ProgressBar>
            <Complete percentComplete={props.stat.percentComplete} />
          </ProgressBar>
        </LockedStat>
      )}
      {!props.stat.locked && props.stat.type === StatType.Bar && (
        <StatBar dataPoints={props.stat.dataPoints}></StatBar>
      )}
      {!props.stat.locked && props.stat.type === StatType.Chart && (
        <StatChart dataPoints={props.stat.dataPoints}></StatChart>
      )}
      {!props.stat.locked && props.stat.type === StatType.Percent && (
        <StatPercent percent={props.stat.dataPoints[0].value} />
      )}
      {!props.stat.locked && props.stat.type === StatType.Comparison && (
        <StatComparison dataPoints={props.stat.dataPoints} />
      )}
    </Card>
  );
};

export default Stat;
