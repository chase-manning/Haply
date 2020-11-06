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
import aWholeYear from "../../assets/svgs/AWholeYear.svg";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
const { Storage } = CapacitorPlugins;

const StyledWelcome = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--bg-mid);
  display: flex;
  flex-direction: column;
  padding: 40px;
  justify-content: space-between;
`;

const BlobConatiner = styled.div`
  width: 100%;
  height: 50%;
  top: 0;
  left: 0;
  position: fixed;
  opacity: 0.5;
`;

const Svg = styled.img`
  width: 100%;
`;

const WelcomePages = styled.div`
  width: 100%;
  height: 60%;
  position: relative;
`;

const BottomBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PageIndicators = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
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
  transition: all 0.8s;
`;

const NavBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

type NextProps = {
  final: boolean;
};

const Next = styled.button`
  width: ${(props: NextProps) => (props.final ? "160px" : "70px")};
  height: 70px;
  border-radius: 35px;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bg-mid);
  font-size: 20px;
  transition: width 0.8s ease-in-out;
  position: relative;
`;

type NextArrowProps = {
  active: boolean;
};

const NextArrow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props: NextArrowProps) => (props.active ? "1" : "0")};
  transition: all 0.4s;
`;

type NextTextProps = {
  active: boolean;
};

const NextText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props: NextTextProps) => (props.active ? "1" : "0")};
  transition: 0.4s all 0.4s;
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
          height="100%"
        >
          <path
            fill="var(--primary)"
            d="M37.8,-50.1C48.3,-44.3,55.8,-32.4,64.7,-18C73.5,-3.6,83.7,13.5,78.7,24.6C73.7,35.7,53.6,40.9,38,46.5C22.4,52,11.2,57.9,-0.3,58.3C-11.8,58.7,-23.6,53.8,-39.4,48.3C-55.2,42.8,-75,36.8,-82.4,24.4C-89.8,11.9,-84.8,-7,-73.9,-18.9C-63.1,-30.8,-46.3,-35.7,-33,-40.7C-19.7,-45.6,-9.8,-50.6,1.9,-53.2C13.6,-55.8,27.2,-56,37.8,-50.1Z"
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
          illustration={<Svg src={aWholeYear} />}
        />
        <WelcomePage
          position={
            state.page < 1 ? "right" : state.page === 1 ? "middle" : "left"
          }
          header={"Record your Mood Throughout the Day"}
          description={
            "Stop every now and again to take a moment and think about how you are feeling"
          }
          illustration={<Svg src={aWholeYear} />}
        />
        <WelcomePage
          position={
            state.page < 2 ? "right" : state.page === 2 ? "middle" : "left"
          }
          header={"Use Tags to Track your Activities"}
          description={
            "Track where you are, what you are doing, who you are with and more with Tags"
          }
          illustration={<Svg src={aWholeYear} />}
        />
        <WelcomePage
          position={
            state.page < 3 ? "right" : state.page === 3 ? "middle" : "left"
          }
          header={"Get Personalised Insights into your Feelings"}
          description={
            "Keep tracking your mood to unlock personalised insights into what makes you feel great"
          }
          illustration={<Svg src={aWholeYear} />}
        />
        <WelcomePage
          position={
            state.page < 4 ? "right" : state.page === 4 ? "middle" : "left"
          }
          header={"Complete Achievement for Unique Rewards"}
          description={
            "By completing achievements you can unlock new themes and even new features in Haply"
          }
          illustration={<Svg src={aWholeYear} />}
        />
        <WelcomePage
          position={
            state.page < 5 ? "right" : state.page === 4 ? "middle" : "left"
          }
          header={"Let's Create your First Mood!"}
          description={""}
          illustration={<Svg src={aWholeYear} />}
        />
      </WelcomePages>
      <BottomBar>
        <PageIndicators>
          <PageIndicator active={state.page === 0} />
          <PageIndicator active={state.page === 1} />
          <PageIndicator active={state.page === 2} />
          <PageIndicator active={state.page === 3} />
          <PageIndicator active={state.page === 4} />
          <PageIndicator active={state.page === 5} />
        </PageIndicators>
        <NavBar>
          <div />
          <Next
            final={state.page === 5}
            onClick={() => {
              if (state.page === 5) dispatch(hideWelcome());
              setState({ ...state, page: state.page + 1 });
            }}
          >
            <NextArrow active={state.page !== 5}>
              <ArrowForwardIcon fontSize={"large"} />
            </NextArrow>
            <NextText active={state.page === 5}>I'm Ready!!</NextText>
          </Next>
        </NavBar>
      </BottomBar>
    </StyledWelcome>
  );
};

export default Welcome;
