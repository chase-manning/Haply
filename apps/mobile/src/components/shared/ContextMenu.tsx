import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";

const StyledContextMenu = styled.div``;

type OptionsTransformProps = {
  open: boolean;
};

const OptionsTransform = styled.div`
  /* transform: ${(props: OptionsTransformProps) =>
    props.open ? "scaleY(1)" : "scaleY(0)"};
  transition: scale 0.1s 1s ease-in-out; */
`;

type OptionsProps = {
  open: boolean;
};

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
  /* display: ${(props: OptionsProps) => (props.open ? "flex" : "none")}; */
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

  const correctPosition = () => {
    let options = optionsRef.current;
    const contextMenu = contextMenuRef.current;
    const padding = 20;

    if (!options || !contextMenu) return;

    options.style.left = "50%";
    options.style.right = "auto";
    options.style.transform = `translateX(-50%) scaleY(${props.open ? 1 : 0})`;

    if (options.getBoundingClientRect().x < padding) {
      const left = contextMenu.getBoundingClientRect().x;
      options.style.left = "0px";
      options.style.right = "auto";
      let meowmeow = `translateX(${-left + padding}px) scaleY(${
        props.open ? 1 : 0
      })`;
      options.style.transform = meowmeow;
    }

    if (
      options.getBoundingClientRect().x +
        options.getBoundingClientRect().width >
      window.outerWidth - padding
    ) {
      console.log("righting");
      const right =
        window.outerWidth -
        contextMenu.getBoundingClientRect().x -
        contextMenu.getBoundingClientRect().width;
      console.log(right);
      options.style.right = "0px";
      options.style.left = "auto";
      console.log(options.style.transform);
      //   options.style.transform = `translateX(${right - padding}px)`;
      let meowmeow = `translateX(${right - padding}px) scaleY(${
        props.open ? 1 : 0
      })`;
      console.log(meowmeow);
      options.style.transform = meowmeow;
      console.log(options.style.transform);
    }
  };

  useEffect(() => {
    correctPosition();
  }, [props.open]);

  return (
    <StyledContextMenu ref={contextMenuRef} onChange={() => correctPosition()}>
      {props.open && (
        <Exit
          onClick={() => {
            props.close(state.selected);
          }}
        />
      )}
      <Options ref={optionsRef} open={props.open}>
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
