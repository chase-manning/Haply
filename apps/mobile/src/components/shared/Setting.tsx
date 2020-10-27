import React from "react";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import { Card } from "../../styles/Shared";

const StyledSettings = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  color: var(--sub);
  width: 70%;
  text-align: left;
`;

const Value = styled.div`
  color: var(--main);
  width: 30%;
`;

type ToggleProps = {
  on: boolean;
};

const Toggle = styled.div`
  color: ${(props: ToggleProps) =>
    props.on ? "var(--primary)" : "var(--sub)"};
  display: flex;
  align-items: center;
`;

type Props = {
  label: string;
  isToggle: boolean;
  toggleOn?: boolean;
  clickFunction: () => void;
};

const Setting = (props: Props) => {
  return (
    <StyledSettings>
      <Card onClick={() => props.clickFunction()}>
        <Label>{props.label}</Label>
        {props.isToggle ? (
          <Value>
            <Toggle on={props.toggleOn!}>
              {props.toggleOn ? (
                <ToggleOnIcon fontSize={"large"} />
              ) : (
                <ToggleOffIcon fontSize={"large"} />
              )}
            </Toggle>
          </Value>
        ) : (
          <ChevronRight />
        )}
      </Card>
    </StyledSettings>
  );
};

export default Setting;
