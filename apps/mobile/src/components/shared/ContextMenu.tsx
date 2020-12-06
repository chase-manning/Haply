import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";

const StyledContextMenu = styled.div``;

const Options = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) scaleY(0);
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
  multiSelect: boolean;
  selected: boolean;
};

const OptionIcon = styled.div`
  color: ${(props: OptionIconProps) =>
    props.multiSelect
      ? props.selected
        ? "var(--primary)"
        : "var(--bg-mid)"
      : "var(--main)"};
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
  const contextMenuRef = useRef<HTMLHeadingElement>(null);
  const optionsRef = useRef<HTMLHeadingElement>(null);

  const isSelected = (option: string) => state.selected.indexOf(option) >= 0;

  const setOptionsPosition = (
    left: string,
    right: string,
    translateX: string
  ) => {
    let options = optionsRef.current;
    if (!options) return;
    options.style.left = left;
    options.style.right = right;
    const scale = "scaleY(" + (props.open ? "1" : "0") + ")";
    options.style.transform = "translateX(" + translateX + ") " + scale;
  };

  const correctPosition = () => {
    const padding = 10;
    let options = optionsRef.current;
    const contextMenu = contextMenuRef.current;
    if (!contextMenu || !options) return;
    const contextPosition = contextMenu.getBoundingClientRect();

    setOptionsPosition("50%", "auto", "-50%");

    let optionsPosition = options.getBoundingClientRect();
    const rightMax = window.outerWidth - padding;
    if (optionsPosition.x < padding) {
      const position = -contextPosition.x + padding;
      setOptionsPosition("0", "auto", position + "px");
    } else if (optionsPosition.x + optionsPosition.width > rightMax) {
      const position = rightMax - contextPosition.x - contextPosition.width;
      setOptionsPosition("auto", "0", position + "px");
    }
  };

  useEffect(() => {
    correctPosition();
  }, [props.open]);

  return (
    <StyledContextMenu ref={contextMenuRef}>
      {props.open && (
        <Exit
          onClick={() => {
            props.close(state.selected);
          }}
        />
      )}
      <Options ref={optionsRef}>
        {props.options.map((option: Option) => (
          <Option
            key={option.text}
            onClick={() => {
              if (!props.multiSelect) {
                if (option.click) option.click();
                props.close([option.text]);
                return;
              } else {
                let newSelected = state.selected;
                const index = newSelected.indexOf(option.text);
                if (index > -1) newSelected.splice(index, 1);
                else newSelected.push(option.text);
                setState({ ...state, selected: newSelected });
              }
            }}
          >
            {props.multiSelect && (
              <OptionIcon multiSelect={true} selected={isSelected(option.text)}>
                <CheckIcon fontSize={"small"} />
              </OptionIcon>
            )}
            {option.icon && (
              <OptionIcon
                multiSelect={props.multiSelect}
                selected={isSelected(option.text)}
              >
                {option.icon}
              </OptionIcon>
            )}
            <OptionText selected={isSelected(option.text)}>
              {option.text}
            </OptionText>
          </Option>
        ))}
      </Options>
    </StyledContextMenu>
  );
};

export default ContextMenu;
