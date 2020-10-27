import React from "react";
import styled from "styled-components";
import { Icon } from "../../styles/Shared";

const StyledDynamicIcon = styled.div`
  position: relative;
  width: 35px;
  height: 35px;
  margin-right: 15px;
`;

type IconOverlayProps = {
  opacity: number;
};

const IconOverlay = styled.div`
  background-color: var(--bg-mid);
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props: IconOverlayProps) => props.opacity};
`;

type Props = {
  percent: number;
  value: number;
};

const DynamicIcon = (props: Props) => {
  return (
    <StyledDynamicIcon>
      <IconOverlay opacity={1}>
        <Icon secondary={true}>{props.value}</Icon>
      </IconOverlay>
      <IconOverlay opacity={props.percent}>
        <Icon>{props.value}</Icon>
      </IconOverlay>
    </StyledDynamicIcon>
  );
};

export default DynamicIcon;
