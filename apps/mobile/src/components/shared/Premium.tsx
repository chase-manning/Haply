import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectPremium } from "../../state/navigationSlice";

const StyledPremium = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
`;

const Premium = () => {
  const premium = useSelector(selectPremium);
  if (!premium) return null;
  return <StyledPremium></StyledPremium>;
};

export default Premium;
