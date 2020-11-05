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
  transition: all 0.8s ease-in-out;
  color: var(--bg-mid);
  justify-content: space-between;
`;

const TextArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Description = styled.div`
  width: 100%;
  font-size: 15px;
  line-height: 1.3;
`;

type Props = {
  position: string;
  illustration: JSX.Element;
  header: string;
  description: string;
};

const WelcomePage = (props: Props) => {
  return (
    <StyledWelcomePage position={props.position}>
      {props.illustration}
      <TextArea>
        <Header>{props.header}</Header>
        <Description>{props.description}</Description>
      </TextArea>
    </StyledWelcomePage>
  );
};

export default WelcomePage;
