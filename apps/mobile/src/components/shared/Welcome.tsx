import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  selectShowWelcome,
  showWelcome,
  hideWelcome,
} from "../../state/navigationSlice";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
import hookedAsset from "../../assets/svgs/Hooked.svg";
import walkingOutsideAsset from "../../assets/svgs/WalkingOutside.svg";
import designSprintAsset from "../../assets/svgs/DesignSprint.svg";
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

const Section = styled.div`
  width: 100%;
  height: 30%;
  position: relative;
`;

type SvgProps = {
  position: string;
};

const Svg = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 80%;
  transform: ${(props: SvgProps) =>
    props.position === "left"
      ? "translate(-200%, -50%)"
      : props.position === "middle"
      ? "translate(-50%, -50%)"
      : "translate(100%, -50%)"};
  transition: all 0.8s ease-in-out;
`;

type TextAreaProps = {
  active: boolean;
};

const TextArea = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  opacity: ${(props: TextAreaProps) => (props.active ? "1" : "0")};
  transition: ${(props: TextAreaProps) =>
    props.active
      ? "0.4s opacity 0.4s ease-in-out"
      : "opacity 0.4s ease-in-out"};
  transform: translateY(-50%);
`;

const Header = styled.div`
  width: 100%;
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Description = styled.div`
  width: 100%;
  font-size: 15px;
  line-height: 1.3;
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
  background-color: ${(props: PageIndicatorProps) =>
    props.active ? "var(--primary)" : "var(--sub)"};
  margin: 2px;
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
      <div />
      <Section>
        <Svg
          position={
            state.page < 0 ? "right" : state.page === 0 ? "middle" : "left"
          }
          src={hookedAsset}
        />
        <Svg
          position={
            state.page < 1 ? "right" : state.page === 1 ? "middle" : "left"
          }
          src={walkingOutsideAsset}
        />
        <Svg
          position={
            state.page < 2 ? "right" : state.page === 2 ? "middle" : "left"
          }
          src={designSprintAsset}
        />
        <Svg
          position={
            state.page < 3 ? "right" : state.page === 3 ? "middle" : "left"
          }
          src={hookedAsset}
        />
        <Svg
          position={
            state.page < 4 ? "right" : state.page === 4 ? "middle" : "left"
          }
          src={hookedAsset}
        />
        <Svg
          position={
            state.page < 5 ? "right" : state.page === 5 ? "middle" : "left"
          }
          src={hookedAsset}
        />
      </Section>
      <Section>
        <TextArea active={state.page === 0}>
          <Header>Welcome to Haply Mood Tracker</Header>
          <Description>
            Congratulations on taking a great step towards a deeper
            understanding of your emotional and mental fluctuations
          </Description>
        </TextArea>
        <TextArea active={state.page === 1}>
          <Header>Record your Mood Throughout the Day</Header>
          <Description>
            Stop every now and again to take a moment and think about how you
            are feeling
          </Description>
        </TextArea>
        <TextArea active={state.page === 2}>
          <Header>Use Tags to Track your Activities</Header>
          <Description>
            Track where you are, what you are doing, who you are with and more
            with Tags
          </Description>
        </TextArea>
        <TextArea active={state.page === 3}>
          <Header>Get Personalised Insights into your Feelings</Header>
          <Description>
            Keep tracking your mood to unlock personalised insights into what
            makes you feel great
          </Description>
        </TextArea>
        <TextArea active={state.page === 4}>
          <Header>Complete Achievement for Unique Rewards</Header>
          <Description>
            By completing achievements you can unlock new themes and even new
            features in Haply
          </Description>
        </TextArea>
        <TextArea active={state.page === 5}>
          <Header>Let's Create your First Mood!</Header>
        </TextArea>
      </Section>
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
