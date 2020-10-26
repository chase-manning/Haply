import React from "react";
import styled from "styled-components";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const StyledStatPercent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type ContentProps = {
  positive: boolean;
};

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props: ContentProps) =>
    props.positive ? "var(--primary)" : "var(--highlight)"};
`;

const DirectionIndicator = styled.div`
  margin-right: 20px;
`;

const Percent = styled.div`
  font-size: 40px;
`;

type Props = {
  percent: number;
};

const StatPercent = (props: Props) => {
  return (
    <StyledStatPercent>
      <Content positive={props.percent >= 0}>
        <DirectionIndicator>
          {props.percent >= 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </DirectionIndicator>
        <Percent>{Math.round(props.percent * 100) + "%"} </Percent>
      </Content>
    </StyledStatPercent>
  );
};

export default StatPercent;
