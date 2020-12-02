import React, { useState } from "react";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import ContextMenu from "./ContextMenu";
import TagSelector from "./TagSelector";

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
  height: 28px;
  top: 0;
  left: 0;
  position: absolute;
`;

const Options = styled.div`
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

const Option = styled.div`
  padding: 5px 0;
  display: flex;
  align-items: center;
`;

type OptionIconProps = {
  selected: boolean;
};

const OptionIcon = styled.div`
  color: ${(props: OptionIconProps) =>
    props.selected ? "var(--primary)" : "var(--bg-mid)"};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

type OptionTextProps = {
  selected: boolean;
};

const OptionText = styled.div`
  color: ${(props: OptionTextProps) =>
    props.selected ? "var(--primary)" : "var(--main)"};
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Exit = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: var(--main-light);
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
