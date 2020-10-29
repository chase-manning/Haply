import React from "react";
import styled from "styled-components";

const StyledFeature = styled.div`
  display: flex;
  width: 100%;
  margin: 12px 0;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  width: 20%;
`;

const ScaleIcon = styled.div`
  transform: scale(0.65);
`;

const Circle = styled.div`
  width: 24px;
  height: 24px;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bg-mid);
  border-radius: 50%;
  font-size: 10px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const Header = styled.div`
  color: var(--main);
  font-size: 16px;
  margin-bottom: 5px;
`;

const Description = styled.div`
  color: var(--sub);
  font-size: 11px;
`;

type Props = {
  header: string;
  description: string;
  icon: JSX.Element;
};

const PremiumFeature = (props: Props) => {
  return (
    <StyledFeature>
      <Icon>
        <Circle>
          <ScaleIcon>{props.icon}</ScaleIcon>
        </Circle>
      </Icon>
      <Text>
        <Header>{props.header}</Header>
        <Description>{props.description}</Description>
      </Text>
    </StyledFeature>
  );
};

export default PremiumFeature;
