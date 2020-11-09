import React from "react";
import styled from "styled-components";
import { Icon } from "../../styles/Shared";
import { useDispatch } from "react-redux";
import { showMoodDateSearch } from "../../state/navigationSlice";

const StyledDynamicIcon = styled.div`
  position: relative;
  width: 35px;
  height: 35px;
`;

type OverlayProps = {
  opacity: number;
};

const Overlay = styled.div`
  background-color: var(--bg-mid);
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props: OverlayProps) => props.opacity};
`;

type Props = {
  percent: number;
  value: number;
  date?: string;
};

const DynamicIcon = (props: Props) => {
  const dispatch = useDispatch();
  return (
    <StyledDynamicIcon
      onClick={() => {
        if (props.date) dispatch(showMoodDateSearch(props.date));
      }}
    >
      <Overlay opacity={1}>
        <Icon secondary={true}>{props.value}</Icon>
      </Overlay>
      <Overlay opacity={props.percent}>
        <Icon>{props.value}</Icon>
      </Overlay>
      <Overlay opacity={props.percent < 0 ? 1 : 0}>
        <Icon noData={true}>{props.value}</Icon>
      </Overlay>
    </StyledDynamicIcon>
  );
};

export default DynamicIcon;
