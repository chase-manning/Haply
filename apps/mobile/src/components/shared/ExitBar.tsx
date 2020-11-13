import React from "react";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";

const TopBar = styled.div`
  width: 100%;
  color: var(--main);
`;

type Props = {
  exit: () => void;
  hideExit?: boolean;
};

const ExitBar = (props: Props) => {
  return (
    <TopBar>{!props.hideExit && <Close onClick={() => props.exit()} />}</TopBar>
  );
};

export default ExitBar;
