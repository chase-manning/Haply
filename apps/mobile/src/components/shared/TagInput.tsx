import React, { useState } from "react";
import styled from "styled-components";

const StyledTagInput = styled.div`
  color: var(--primary);
  display: inline-block;
  min-width: 50px;
  min-height: 28px;
  border-bottom: solid 2px var(--primary);
  margin-right: 10px;
  position: relative;
`;

const TagClickHandler = styled.button`
  width: 100%;
  height: 28px;
  top: 0;
  left: 0;
  position: absolute;
`;

const TagOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-mid);
  border-radius: 10px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  z-index: 2;
  font-size: 16px;
`;

type TagOptionProps = {
  selected: boolean;
};

const TagOption = styled.div`
  color: ${(props: TagOptionProps) =>
    props.selected ? "var(--primary)" : "var(--main)"};
  padding: 5px 0;
  white-space: nowrap;
`;

const TagExit = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: var(--main-light);
`;

class State {
  tags: string[] = [];
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
      <TagClickHandler onClick={() => setState({ ...state, open: true })} />
      {state.open && (
        <TagExit
          onClick={() => {
            setState({ ...state, open: false });
            props.setTags(state.tags);
          }}
        />
      )}
      {state.open && (
        <TagOptions>
          {props.tags.map((tag: string) => (
            <TagOption
              key={tag}
              selected={state.tags.indexOf(tag) >= 0}
              onClick={() => {
                const index = state.tags.indexOf(tag);
                const newFeelings = state.tags;
                if (index >= 0) newFeelings.splice(index, 1);
                else newFeelings.push(tag);
                setState({ ...state, tags: newFeelings });
              }}
            >
              {tag}
            </TagOption>
          ))}
        </TagOptions>
      )}
    </StyledTagInput>
  );
};

export default TagInput;
