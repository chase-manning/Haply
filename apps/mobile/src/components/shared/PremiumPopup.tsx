import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { showPremium } from "../../state/navigationSlice";
import Popup from "./Popup";
import nature from "../../assets/svgs/Nature.svg";

const StyledPremiumPopup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  color: var(--main);
  font-size: 18px;
  margin-top: 25px;
  margin-bottom: 15px;
  text-align: center;
`;

const Description = styled.div`
  width: 100%;
  color: var(--sub);
  font-size: 11px;
`;

type Props = {
  open: boolean;
  header: string;
  description: string;
  close: () => void;
};

const PremiumPopup = (props: Props) => {
  const dispatch = useDispatch();
  return (
    <Popup
      open={props.open}
      content={
        <StyledPremiumPopup>
          <img src={nature} alt="Premium Illustration" width="80%" />
          <Header>{props.header}</Header>
          <Description>{props.description}</Description>
        </StyledPremiumPopup>
      }
      showButton={true}
      close={() => props.close}
      submit={() => dispatch(showPremium())}
      buttonText={"Go Premium"}
    />
  );
};

export default PremiumPopup;
