import React, { useState } from "react";
import styled from "styled-components";
import { ExpandButton } from "../../styles/Shared";

type EntryNoteProps = {
  open: boolean;
};

const StyledEntryNote = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-top: 10px;
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
