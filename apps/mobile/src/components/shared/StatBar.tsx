import React, { Component } from "react";
import styled from "styled-components";
import { Column } from "../../models/StatModel";

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
`;

type Props = {
  columns: Column[];
};

export default class StatBar extends Component<Props> {
  render() {
    let columns: any = [];
    this.props.columns.forEach((colum: Column) => {
      columns.push(
        <ChartRow>
          <StyledColumn>
            <Filled value={colum.percent}></Filled>
          </StyledColumn>
          <Label>{colum.label}</Label>
        </ChartRow>
      );
    });

    return <Chart data-testid="StatBar">{columns}</Chart>;
  }
}
