import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import ContextMenuOption, { Option } from "./ContextMenuOption";

const StyledContextMenu = styled.div`
  position: absolute;
  bottom: 0;
  height: 0;
  left: 0;
  width: 100%;
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
  overflow-y: auto;
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

  const setOptionsPosition = (
    left: string,
    right: string,
    pos: string,
    maxHeight?: string
  ) => {
    let options = optionsRef.current;
    if (!options) return;
    options.style.left = left;
    options.style.right = right;
    options.style.transform = "translateX(" + pos + ") ";
    if (maxHeight) options.style.maxHeight = maxHeight;
  };

  const correctPosition = () => {
    const padding = 10;
    let options = optionsRef.current;
    const contextMenu = contextMenuRef.current;
    if (!contextMenu || !options) return;
    const contextPosition = contextMenu.getBoundingClientRect();

    const maxHeight = window.innerHeight - contextPosition.y - padding + "px";
    setOptionsPosition("50%", "auto", "-50%", maxHeight);

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

  useLayoutEffect(() => {
    correctPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  if (!props.open) return null;

  return (
    <StyledContextMenu ref={contextMenuRef}>
      <Exit
        onClick={() => {
          props.close(state.selected);
        }}
      />
      <Options ref={optionsRef}>
        {props.options.map((option: Option) => (
          <ContextMenuOption
            key={option.text}
            option={option}
            multiSelect={props.multiSelect}
            selected={state.selected.indexOf(option.text) >= 0}
            close={() => props.close([option.text])}
            add={() => {
              let newSelected = state.selected;
              newSelected.push(option.text);
              setState({ ...state, selected: newSelected });
            }}
            remove={() => {
              let newSelected = state.selected;
              newSelected.splice(newSelected.indexOf(option.text), 1);
              setState({ ...state, selected: newSelected });
            }}
          />
        ))}
      </Options>
    </StyledContextMenu>
  );
};

export default ContextMenu;
