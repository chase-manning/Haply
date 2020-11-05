import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  selectShowWelcome,
  showWelcome,
  hideWelcome,
} from "../../state/navigationSlice";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
import WelcomePage from "./WelcomePage";
import sadAsset from "../../assets/svgs/AWholeYear.svg";
const { Storage } = CapacitorPlugins;

const StyledWelcome = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
  padding: 40px;
  justify-content: space-between;
`;

const BlobConatiner = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
`;

const Svg = styled.img`
  width: 100%;
`;

const WelcomePages = styled.div`
  width: 100%;
  height: 60%;
  position: relative;
`;

const PageIndicators = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
`;

type PageIndicatorProps = {
  active: boolean;
};

const PageIndicator = styled.div`
  width: ${(props: PageIndicatorProps) => (props.active ? "24px" : "6px")};
  height: 6px;
  border-radius: 3px;
  background-color: var(--highlight);
  margin: 2px;
  opacity: ${(props: PageIndicatorProps) => (props.active ? "1" : "0.5")};
  transition: all 0.2s;
`;

const NavBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Next = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--highlight);
`;

const ArrowPointTransform = styled.div`
  transform: translate(15px, 14px);
`;

const ArrowPoint = styled.div`
  border-right: solid 2px var(--bg-mid);
  border-bottom: solid 2px var(--bg-mid);
  width: 30px;
  height: 30px;
  transform: rotate(-45deg);
`;

const ArrowLine = styled.div`
  width: 80px;
  border-bottom: solid 2px var(--bg-mid);
  transform: translate(-30px, -2px);
`;

class State {
  page: number = 0;
}

const Welcome = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const show = useSelector(selectShowWelcome);

  useEffect(() => {
    Storage.get({ key: "welcomed" }).then((result: any) => {
      let ret: { value: any } = result;
      if (ret.value) {
        dispatch(hideWelcome());
      } else {
        dispatch(showWelcome());
      }
    });
  }, []);

  if (!show) return null;

  return (
    <StyledWelcome>
      <BlobConatiner>
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          width="170%"
        >
          <path
            fill="var(--highlight)"
            d="M39.3,-54.1C50.6,-45.9,59.1,-33.9,62.2,-21C65.3,-8.1,63,5.8,59.4,20.1C55.9,34.5,51.2,49.3,41.2,59.7C31.1,70.2,15.5,76.2,-0.3,76.7C-16.2,77.1,-32.4,72,-39.5,60.6C-46.6,49.2,-44.7,31.5,-45,17.6C-45.4,3.8,-48.1,-6.4,-50,-21.1C-51.8,-35.8,-53,-55.1,-44.5,-64.3C-36,-73.4,-18,-72.4,-2,-69.6C14,-66.8,28,-62.3,39.3,-54.1Z"
            transform="translate(100 100)"
          />
        </svg>
      </BlobConatiner>
      <div />
      <WelcomePages>
        <WelcomePage
          position={
            state.page < 0 ? "right" : state.page === 0 ? "middle" : "left"
          }
          header={"Welcome to Haply Mood Tracker"}
          description={
            "Congratulations on taking a great step towards a deeper understanding of your emotional and mental fluctuations"
          }
          illustration={<Svg src={sadAsset} />}
        />
        <WelcomePage
          position={
            state.page < 1 ? "right" : state.page === 1 ? "middle" : "left"
          }
          header={"Welcome to Haply Mood Tracker"}
          description={
            "Congratulations on taking a great step towards a deeper understanding of your emotional and mental fluctuations"
          }
          illustration={<Svg src={sadAsset} />}
        />
        <WelcomePage
          position={
            state.page < 2 ? "right" : state.page === 2 ? "middle" : "left"
          }
          header={"Welcome to Haply Mood Tracker"}
          description={
            "Congratulations on taking a great step towards a deeper understanding of your emotional and mental fluctuations"
          }
          illustration={<Svg src={sadAsset} />}
        />
        <WelcomePage
          position={
            state.page < 3 ? "right" : state.page === 3 ? "middle" : "left"
          }
          header={"Welcome to Haply Mood Tracker"}
          description={
            "Congratulations on taking a great step towards a deeper understanding of your emotional and mental fluctuations"
          }
          illustration={<Svg src={sadAsset} />}
        />
      </WelcomePages>
      <PageIndicators>
        <PageIndicator active={state.page === 0} />
        <PageIndicator active={state.page === 1} />
        <PageIndicator active={state.page === 2} />
        <PageIndicator active={state.page === 3} />
      </PageIndicators>
      <NavBar>
        <div />
        <Next
          onClick={() => {
            if (state.page === 3) dispatch(hideWelcome());
            setState({ ...state, page: state.page + 1 });
          }}
        >
          <ArrowPointTransform>
            <ArrowPoint />
          </ArrowPointTransform>
          <ArrowLine />
        </Next>
      </NavBar>
    </StyledWelcome>
  );
};

export default Welcome;
