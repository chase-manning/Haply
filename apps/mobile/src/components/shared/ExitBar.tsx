import React from "react";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";

const TopBar = styled.div`
  width: 100%;
  color: var(--main);
`;

type Props = {
  exit: () => void;
};

const ExitBar = (props: Props) => {
  return (
    <TopBar>
      <Close onClick={() => props.exit()} />
    </TopBar>
  );
};

export default ExitBar;
