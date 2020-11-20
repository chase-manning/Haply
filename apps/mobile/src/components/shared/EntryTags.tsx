import React, { useState } from "react";
import styled from "styled-components";
import DynamicSelectedTag from "./DynamicSelectedTag";

type StyledEntryTagsProps = {
  open: boolean;
};

const StyledEntryTags = styled.div`
  margin-top: 15px;
  color: var(--sub);
  font-size: 12px;
  align-items: center;
  width: 100%;
  overflow: hidden;
  height: ${(props: StyledEntryTagsProps) => (props.open ? "auto" : "25px")};
  position: relative;
`;

type ExpandButtonProps = {
  show: boolean;
  secondLine: boolean;
};

const ExpandButton = styled.div`
  display: ${(props: ExpandButtonProps) => (props.show ? "flex" : "none")};
  position: absolute;
  top: ${(props: ExpandButtonProps) => (props.secondLine ? "15px" : "9px")};
  right: 0;
  background-color: var(--bg-mid);
  padding: 1px;
  font-size: 10px;
  color: var(--sub);
  box-shadow: -5px -0px 5px 2px var(--bg-mid);
`;

class State {
  expanded: boolean = false;
}

type Props = {
  tags: string[];
  percent: number;
};

const EntryTags = (props: Props) => {
  const [state, setState] = useState(new State());

  if (!props.tags || props.tags.length === 0) return null;

  return (
    <StyledEntryTags
      onClick={() => setState({ ...state, expanded: !state.expanded })}
      open={state.expanded}
    >
      {props.tags.map((tag: string) => (
        <DynamicSelectedTag
          tag={tag}
          percent={props.percent}
          key={tag}
          includeMargin={true}
        />
      ))}
      <ExpandButton
        show={!state.expanded && props.tags.length >= 3}
        secondLine={false}
      >
        ...more
      </ExpandButton>
    </StyledEntryTags>
  );
};

export default EntryTags;
