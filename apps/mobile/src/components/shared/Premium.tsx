import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { hidePremium, selectPremium } from "../../state/navigationSlice";
import ExitBar from "./ExitBar";

const StyledPremium = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-mid);
  display: flex;
  flex-direction: column;
`;

const Premium = () => {
  const dispatch = useDispatch();
  const premium = useSelector(selectPremium);
  if (!premium) return null;
  return (
    <StyledPremium>
      <ExitBar exit={() => dispatch(hidePremium())} />
    </StyledPremium>
  );
};

export default Premium;
