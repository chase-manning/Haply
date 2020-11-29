import React from "react";
import styled from "styled-components";
import Popup from "./Popup";

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
      content={<p>meow</p>}
      submit={() => props.tryAgain()}
      showButton={true}
      buttonText={"Try Again"}
    />
  );
};

export default Failed;
