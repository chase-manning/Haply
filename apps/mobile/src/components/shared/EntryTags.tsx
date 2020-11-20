import React, { useState } from "react";
import styled from "styled-components";
import { ExpandButton } from "../../styles/Shared";
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
