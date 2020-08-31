import React, { Component } from "react";
import styled from "styled-components";

const StyledStats = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Stat = styled.div`
  width: 100%;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  font-size: 20px;
`;

const Chart = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
`;

const ChartRow = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
`;

const Column = styled.div`
  height: 90%;
  width: 100%;
  background-color: var(--primary-light);
  border-radius: 10px;
  position: relative;
`;

const Filled = styled.div`
  position: absolute;
  left: 0;
  border-radius: 10px;
  bottom: 0;
  height: 60%;
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

export default class Stats extends Component {
  render() {
    return (
      <StyledStats data-testid="Stats">
        <Stat>
          <Header>Mood by Day</Header>
          <Chart>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
            <ChartRow>
              <Column>
                <Filled></Filled>
              </Column>
              <Label>M</Label>
            </ChartRow>
          </Chart>
        </Stat>
      </StyledStats>
    );
  }
}
