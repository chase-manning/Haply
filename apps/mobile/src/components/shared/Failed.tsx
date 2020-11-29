import React from "react";
import styled from "styled-components";
import { Header } from "../../styles/Shared";
import Popup from "./Popup";
import notify from "../../assets/svgs/Notify.svg";

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Svg = styled.img`
  width: 80%;
`;

type Props = {
  open: boolean;
  close: () => void;
  action: string;
  tryAgain: () => void;
};

const Failed = (props: Props) => {
  if (!props.open) return null;

  return (
    <Popup
      open={props.open}
      close={() => props.close()}
      content={
        <Content>
          <Header>{props.action + " Failed"}</Header>
          <Svg src={notify}></Svg>
        </Content>
      }
      submit={() => props.tryAgain()}
      showButton={true}
      buttonText={"Try Again"}
    />
  );
};

export default Failed;
