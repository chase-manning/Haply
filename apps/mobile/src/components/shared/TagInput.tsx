import React, { useState } from "react";
import styled from "styled-components";
import ContextMenu from "./ContextMenu";

const StyledTagInput = styled.div`
  color: var(--primary);
  display: inline-block;
  min-width: 50px;
  min-height: 28px;
  border-bottom: solid 2px var(--primary);
  margin-right: 10px;
  position: relative;
`;

const ClickHandler = styled.button`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
`;

class State {
  open: boolean = false;
}

type Props = {
  tags: string[];
  setTags: (tags: string[]) => void;
  text: string;
};

const TagInput = (props: Props) => {
  const [state, setState] = useState(new State());

  return (
    <StyledTagInput>
      {props.text}
      <ClickHandler onClick={() => setState({ ...state, open: true })} />
      <ContextMenu
        open={state.open}
        options={props.tags.map((tag: string) => {
          return {
            text: tag,
          };
        })}
        close={(selected: string[]) => {
          props.setTags(selected);
          setState({ ...state, open: false });
        }}
        multiSelect={true}
      />
    </StyledTagInput>
  );
};

export default TagInput;
