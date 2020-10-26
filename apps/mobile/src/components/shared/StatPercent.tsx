import React from "react";
import styled from "styled-components";

const StyledStatPercent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type PercentProps = {
  positive: boolean;
};

const Percent = styled.div`
  font-size: 80px;
  color: ${(props: PercentProps) =>
    props.positive ? "var(--primary)" : "var(--highlight)"};
`;

type Props = {
  percent: number;
};

const StatPercent = (props: Props) => {
  return (
    <StyledStatPercent>
      <Percent positive={props.percent >= 0}>
        {Math.round(props.percent * 100) + "%"}{" "}
      </Percent>
    </StyledStatPercent>
  );
};

export default StatPercent;
