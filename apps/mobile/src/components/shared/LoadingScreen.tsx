import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import feelingAmazing from "../../assets/svgs/SuperThankYou.svg";
import { selectLoadingSteps } from "../../state/loadingSlice";

const StyledLoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-mid);
  transition: background-color 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
`;

const Image = styled.img`
  width: 70%;
`;

const BarContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Incomplete = styled.div`
  height: 10px;
  background-color: var(--primary-light);
  transition: background-color 0.5s;
  border-radius: 5px;
  flex: 1;
`;

type LoadingProgresProps = { width: string };
const Complete = styled.div`
  height: 100%;
  border-radius: 5px;
  width: ${(props: LoadingProgresProps) => props.width};
  background-color: var(--primary);
  transition: background-color 0.5s;
  transition: width 1s;
`;

const Percent = styled.div`
  margin-left: 10px;
  color: var(--main);
  transition: color 0.5s;
  font-size: 14px;
  min-width: 40px;
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  color: var(--main);
  transition: color 0.5s;
  font-size: 18px;
  margin-top: 15px;
`;

const LoadingScreen = () => {
  const loadingSteps = useSelector(selectLoadingSteps);
  const [ms, setMs] = useState(0);
  const [stepsComplete, setStepsComplete] = useState(0);
  const [percent, setPercent] = useState(0);

  const completeRef = useRef<HTMLHeadingElement>(null);
  const incompleteRef = useRef<HTMLHeadingElement>(null);

  const getActualPercent = () => {
    if (!completeRef.current || !incompleteRef.current) return 1;
    const completeWidth = completeRef.current.getBoundingClientRect().width;
    const incompleteWidth = incompleteRef.current.getBoundingClientRect().width;
    return completeWidth / incompleteWidth;
  };

  const formatPercent = (percentNumber: number) => {
    return Math.min(Math.round(percentNumber * 100), 100) + "%";
  };

  const updateLoading = () => {
    const newStepsComplete = loadingSteps.filter((step: boolean) => !step)
      .length;
    if (stepsComplete === newStepsComplete) {
      const basePercent = newStepsComplete / loadingSteps.length;
      const interval = 1 / loadingSteps.length;
      let multiplier = 0.177 * Math.log(ms) - 0.541;
      multiplier = Math.min(Math.max(multiplier, 0), 0.9);
      const modifier = multiplier * interval;
      setPercent(basePercent + modifier);
      setMs(ms + 100);
    } else {
      setStepsComplete(newStepsComplete);
      setMs(0);
    }
    if (getActualPercent() < 1)
      setTimeout(() => updateLoadingRef.current(), 100);
  };

  const updateLoadingRef = useRef(updateLoading);
  updateLoadingRef.current = updateLoading;

  useEffect(() => updateLoadingRef.current(), []);

  if (getActualPercent() >= 1 && percent >= 1) return null;

  return (
    <StyledLoadingScreen>
      <Content>
        <Image src={feelingAmazing} />
        <BarContainer>
          <Incomplete ref={incompleteRef}>
            <Complete ref={completeRef} width={formatPercent(percent)} />
          </Incomplete>
          <Percent>{formatPercent(getActualPercent())}</Percent>
        </BarContainer>
        <Text>Loading...</Text>
      </Content>
    </StyledLoadingScreen>
  );
};

export default LoadingScreen;
