import React from "react";
import styled from "styled-components";
import Popup from "./Popup";
import notify from "../../assets/svgs/Notify.svg";

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Svg = styled.img`
  width: 80%;
`;

const Title = styled.div`
  text-align: center;
  width: 100%;
  font-size: 18px;
  color: var(--main);
  margin-top: 30px;
`;

const Description = styled.div`
  font-size: 14px;
  margin: 10px 0 12px 0;
  color: var(--sub);
  width: 100%;
  text-align: center;
  line-height: 1.5;
`;

type Props = {
  open: boolean;
  close: () => void;
  action: string;
  tryAgain: () => void;
};

const Failed = (props: Props) => {
  return (
    <Popup
      open={true}
      close={() => props.close()}
      content={
        <Content>
          <Svg src={notify}></Svg>
          <Title>{props.action + " Failed"}</Title>
          <Description>
            {"Ensure you have internet connection and try again"}
          </Description>
        </Content>
      }
      submit={() => props.tryAgain()}
      showButton={true}
      buttonText={"Try Again"}
    />
  );
};

export default Failed;
