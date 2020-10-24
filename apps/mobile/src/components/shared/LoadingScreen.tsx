import React from "react";
import styled from "styled-components";
import feelingAmazing from "../../assets/svgs/SuperThankYou.svg";

const StyledLoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const LoadingBarContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 10px;
  background-color: var(--primary-light);
  border-radius: 5px;
`;

type LoadingProgresProps = {
  percentComplete: number;
};

const LoadingProgress = styled.div`
  height: 100%;
  border-radius: 5px;
  width: ${(props: LoadingProgresProps) => {
    return props.percentComplete * 100 + "%";
  }};
  background-color: var(--primary);
  transition: all 0.5s ease-out;
`;

type Props = {
  loading: boolean;
  percentComplete: number;
};

const LoadingScreen = (props: Props) => {
  if (!props.loading) return null;
  return (
    <StyledLoadingScreen>
      <LoadingContent>
        <img
          src={feelingAmazing}
          alt="Haply Loading Illustration"
          width="100%"
        />
        <LoadingBarContainer>
          <LoadingProgress percentComplete={props.percentComplete} />
        </LoadingBarContainer>
      </LoadingContent>
    </StyledLoadingScreen>
  );
};

export default LoadingScreen;
