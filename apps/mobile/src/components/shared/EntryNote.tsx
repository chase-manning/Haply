import React, { useState } from "react";
import styled from "styled-components";

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

type EntryNoteProps = {
  open: boolean;
};

const StyledEntryNote = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-top: 15px;
  width: 100%;
  height: ${(props: EntryNoteProps) => (props.open ? "auto" : "26px")};
  overflow: hidden;
  position: relative;
`;

class State {
  expanded: boolean = false;
}

type Props = {
  note: string;
};

const EntryNote = (props: Props) => {
  const [state, setState] = useState(new State());

  if (!props.note || props.note.length === 0) return null;

  return (
    <StyledEntryNote
      onClick={() => setState({ ...state, expanded: !state.expanded })}
      open={state.expanded || props.note.length < 90}
    >
      {props.note.substring(0, 20000000) +
        (props.note.length > 2000000 ? "..." : "")}
      <ExpandButton
        show={!state.expanded && props.note.length >= 90}
        secondLine={true}
      >
        ...more
      </ExpandButton>
    </StyledEntryNote>
  );
};

export default EntryNote;
