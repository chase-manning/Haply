import React, { useEffect, useRef, useState } from "react";
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
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const loadingSteps = useSelector(selectLoadingSteps);
  const loadingStepsRef = useRef(loadingSteps);
  loadingStepsRef.current = loadingSteps;

  const [ms, setMs] = useState(0);
  const msRef = useRef(ms);
  msRef.current = ms;

  const [stepsComplete, setStepsComplete] = useState(0);
  const stepsCompleteRef = useRef(stepsComplete);
  stepsCompleteRef.current = stepsComplete;

  const [percent, setPercent] = useState(0);
  const percentRef = useRef(percent);
  percentRef.current = percent;

  const percentFomatted = Math.round(percent * 100) + "%";

  const getStepsComplete = () =>
    loadingStepsRef.current.filter((step: boolean) => !step).length;

  const getModifier = () => {
    const interval = 1 / loadingSteps.length;
    let multiplier = 0.177 * Math.log(msRef.current) - 0.541;
    multiplier = Math.min(Math.max(multiplier, 0), 0.9);
    return multiplier * interval;
  };

  const updateLoading = () => {
    const newStepsComplete = getStepsComplete();
    if (stepsCompleteRef.current === newStepsComplete) {
      const basePercent = newStepsComplete / loadingStepsRef.current.length;
      setPercent(basePercent * getModifier());
      setMs(msRef.current + 100);
    } else {
      setStepsComplete(newStepsComplete);
      setMs(0);
    }
    if (percentRef.current !== 1) setTimeout(() => updateLoading(), 100);
  };

  useEffect(
    () => updateLoading(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (percent === 1) return null;

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
