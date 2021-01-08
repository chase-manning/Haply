import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import feelingAmazing from "../../assets/svgs/SuperThankYou.svg";
import {
  selectDataLoading,
  selectLoadingSteps,
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Incomplete = styled.div`
  height: 10px;
  background-color: var(--primary-light);
  border-radius: 5px;
  flex: 1;
`;

type LoadingProgresProps = { width: string };
const Complete = styled.div`
  height: 100%;
  border-radius: 5px;
  width: ${(props: LoadingProgresProps) => props.width};
  background-color: var(--primary);
  transition: all 0.5s ease-out;
`;

const Percent = styled.div`
  margin-left: 10px;
  color: var(--main);
  font-size: 12px;
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  color: var(--main);
  font-size: 20px;
  margin-top: 20px;
`;

const LoadingScreen = () => {
  const loading = useSelector(selectDataLoading);
  const loadingSteps = useSelector(selectLoadingSteps);
  const [ms, setMs] = useState(0);
  const [stepsComplete, setStepsComplete] = useState(0);
  const [percent, setPercent] = useState(0);

  const percentFomatted = Math.round(percent * 100) + "%";

  // -0.812 + 0.23 ln x

  const getStepsComplete = () =>
    loadingSteps.filter((step: boolean) => step).length;

  const updateLoading = () => {
    const newStepsComplete = getStepsComplete();
    if (stepsComplete === newStepsComplete) {
      const basePercent = loadingSteps.length / newStepsComplete;
      const modifier = 0.23 * Math.log(ms);
      const newPercent = basePercent + modifier;
      setPercent(newPercent);
      setMs(ms + 100);
    } else {
      setStepsComplete(newStepsComplete);
      setMs(0);
    }
    setTimeout(() => updateLoading(), 100);
  };

  if (!loading) return null;

  return (
    <StyledLoadingScreen>
      <Content>
        <Image src={feelingAmazing} />
        <BarContainer>
          <Incomplete>
            <Complete width={percentFomatted} />
          </Incomplete>
          <Percent>{percentFomatted}</Percent>
        </BarContainer>
        <Text>Loading...</Text>
      </Content>
    </StyledLoadingScreen>
  );
};

export default LoadingScreen;
