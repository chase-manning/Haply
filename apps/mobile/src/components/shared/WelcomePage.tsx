import React from "react";
import styled from "styled-components";

type StyledWelcomePageProps = {
  position: string;
};

const StyledWelcomePage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transform: ${(props: StyledWelcomePageProps) =>
    props.position === "left"
      ? "translateX(-120%)"
      : props.position === "middle"
      ? "translateX(0)"
      : "translateX(120%)"};
  transition: all 1s ease-in-out;
`;

type Props = {
  position: string;
};

const WelcomePage = (props: Props) => {
  return <StyledWelcomePage position={props.position}>Meow</StyledWelcomePage>;
};

export default WelcomePage;
