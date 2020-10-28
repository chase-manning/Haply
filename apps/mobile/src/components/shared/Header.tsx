import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectActiveTabText } from "../../state/navigationSlice";

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  padding-top: 20px;
  background-color: var(--bg-top);
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  font-size: 18px;
  transition: all 0.2s ease-out;

  &:active:hover {
    transform: scale(0.99);
    box-shadow: var(--shadow-clicked);
  }
`;

function Header() {
  const headerText: string = useSelector(selectActiveTabText);
  return <StyledHeader>{headerText}</StyledHeader>;
}

export default Header;
