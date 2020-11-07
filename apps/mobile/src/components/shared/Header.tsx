import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectActiveTabText } from "../../state/navigationSlice";

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-top);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: var(--shadow);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const HeaderText = styled.div`
  width: 100%;
  margin-top: 35px;
  margin-bottom: 25px;
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

function Header() {
  const headerText: string = useSelector(selectActiveTabText);
  return (
    <StyledHeader>
      <HeaderText>{headerText}</HeaderText>
    </StyledHeader>
  );
}

export default Header;
