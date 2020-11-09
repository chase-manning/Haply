import React from "react";
import styled from "styled-components";
import noData from "../../assets/svgs/Empty.svg";

const StyledNoData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoDataHeader = styled.div`
  font-size: 16px;
  color: var(--main);
  margin-top: 30px;
`;

const NoDataSub = styled.div`
  font-size: 12px;
  margin-top: 15px;
  color: var(--sub);
  width: 70%;
  text-align: center;
  line-height: 1.5;
`;

type Props = {
  show: boolean;
  text?: string;
};

const NoData = (props: Props) => {
  if (!props.show) return null;

  return (
    <StyledNoData>
      <img src={noData} alt="No Data Found Illustration" width="60%" />
      <NoDataHeader>No Entries</NoDataHeader>
      <NoDataSub>{props.text ? props.text : "No data found"}</NoDataSub>
    </StyledNoData>
  );
};

export default NoData;
