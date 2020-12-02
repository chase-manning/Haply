import React, { useState } from "react";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";

const StyledContextMenu = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
  selected: string[] = [];
}

export type Option = {
  text: string;
  icon?: JSX.Element;
  click?: () => void;
};

type Props = {
  open: boolean;
  options: Option[];
  close: (selected: string[]) => void;
  multiSelect: boolean;
};

const ContextMenu = (props: Props) => {
  const [state, setState] = useState(new State());

  if (!props.open) return null;

  return (
    <StyledContextMenu>
      {props.open && (
        <Exit
          onClick={() => {
            props.close(state.selected);
          }}
        />
      )}
      {props.open && (
        <Options>
          {props.options.map((option: Option) => (
            <Option
              key={option.text}
              onClick={() => {
                if (!props.multiSelect) {
                  if (option.click) option.click();
                  props.close([option.text]);
                  return;
                } else {
                  const newSelected = state.selected;
                  newSelected.push(option.text);
                  setState({ ...state, selected: newSelected });
                }
              }}
            >
              {props.multiSelect && (
                <OptionIcon selected={state.selected.indexOf(option.text) >= 0}>
                  <CheckIcon fontSize={"small"} />
                </OptionIcon>
              )}
              {option.icon && (
                <OptionIcon selected={state.selected.indexOf(option.text) >= 0}>
                  {option.icon}
                </OptionIcon>
              )}
              <OptionText selected={state.selected.indexOf(option.text) >= 0}>
                {option.text}
              </OptionText>
            </Option>
          ))}
        </Options>
      )}
    </StyledContextMenu>
  );
};

export default ContextMenu;
