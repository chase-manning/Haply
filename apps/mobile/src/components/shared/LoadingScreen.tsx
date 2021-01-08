import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import feelingAmazing from "../../assets/svgs/SuperThankYou.svg";
import {
  selectDataLoading,
  selectLoadingPercent,
} from "../../state/loadingSlice";

const StyledLoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-mid);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const Image = styled.img`
  width: 100%;
`;

const BarContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 10px;
  background-color: var(--primary-light);
  border-radius: 5px;
`;

type LoadingProgresProps = {
  percentComplete: number;
};

const Progress = styled.div`
  height: 100%;
  border-radius: 5px;
  width: ${(props: LoadingProgresProps) => {
    return props.percentComplete * 100 + "%";
  }};
  background-color: var(--primary);
  transition: all 0.5s ease-out;
`;

const LoadingScreen = () => {
  const loading = useSelector(selectDataLoading);
  const loadingPercent = useSelector(selectLoadingPercent);

  if (!loading) return null;
  return (
    <StyledLoadingScreen>
      <Content>
        <Image src={feelingAmazing} />
        <BarContainer>
          <Progress percentComplete={loadingPercent} />
        </BarContainer>
      </Content>
    </StyledLoadingScreen>
  );
};

export default LoadingScreen;
