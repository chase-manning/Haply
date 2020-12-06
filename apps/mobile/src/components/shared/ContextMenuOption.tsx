import React from "react";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";

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

export type Option = {
  text: string;
  icon?: JSX.Element;
  click?: () => void;
};

type Props = {
  option: Option;
  multiSelect: boolean;
  selected: boolean;
  add?: () => void;
  remove?: () => void;
  close: () => void;
};

const ContextMenuOption = (props: Props) => {
  return (
    <Option
      key={props.option.text}
      onClick={() => {
        if (!props.multiSelect) {
          if (props.option.click) props.option.click();
          props.close();
        } else {
          if (props.selected && props.remove) props.remove();
          else if (!props.selected && props.add) props.add();
        }
      }}
    >
      {props.multiSelect && (
        <OptionIcon multiSelect={true} selected={props.selected}>
          <CheckIcon fontSize={"small"} />
        </OptionIcon>
      )}
      {props.option.icon && (
        <OptionIcon multiSelect={props.multiSelect} selected={props.selected}>
          {props.option.icon}
        </OptionIcon>
      )}
      <OptionText selected={props.selected}>{props.option.text}</OptionText>
    </Option>
  );
};

export default ContextMenuOption;
