import React from "react";
import styled from "styled-components";
import { DataPoint } from "../../models/StatModel";

const Chart = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ChartRow = styled.div`
  height: 150px;
  width: 20px;
  display: flex;
  flex-direction: column;
`;

const StyledColumn = styled.div`
  height: 90%;
  width: 100%;
  background-color: var(--primary-light);
  border-radius: 10px;
  position: relative;
`;

type FilledPercentage = {
  value: number;
};

const Filled = styled.div`
  position: absolute;
  left: 0;
  border-radius: 10px;
  bottom: 0;
  height: ${(props: FilledPercentage) => props.value * 100 + "%"};
  width: 100%;
  background-color: var(--primary);
`;

const Label = styled.div`
  width: 100%;
  color: var(--sub);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 16px;
`;

type Props = {
  dataPoints: DataPoint[];
};

const StatBar = (props: Props) => {
  return (
    <Chart>
      {props.dataPoints.map((dataPoint: DataPoint) => {
        return (
          <ChartRow>
            <StyledColumn>
              <Filled value={dataPoint.value / 10}></Filled>
            </StyledColumn>
            <Label>{dataPoint.label}</Label>
          </ChartRow>
        );
      })}
    </Chart>
  );
};

export default StatBar;
