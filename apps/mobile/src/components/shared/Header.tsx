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
  border-bottom: solid 1px var(--border);
  box-shadow: var(--shadow);
`;

function Header() {
  const headerText: string = useSelector(selectActiveTabText);
  return <StyledHeader>{headerText}</StyledHeader>;
}

export default Header;
