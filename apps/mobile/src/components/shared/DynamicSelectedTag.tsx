import React from "react";
import styled from "styled-components";
import { SelectedTag } from "../../styles/Shared";

const StyledDynamicSelectedTag = styled.div`
  position: relative;
  display: inline-block;
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
  tag: string;
  includeMargin: boolean;
};

const DynamicSelectedTag = (props: Props) => {
  return (
    <StyledDynamicSelectedTag>
      <SelectedTag hightlightColor={true} includeMargin={props.includeMargin}>
        {props.tag}
      </SelectedTag>

      <Overlay opacity={props.percent}>
        <SelectedTag includeMargin={props.includeMargin}>
          {props.tag}
        </SelectedTag>
      </Overlay>
    </StyledDynamicSelectedTag>
  );
};

export default DynamicSelectedTag;
