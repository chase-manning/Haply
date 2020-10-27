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

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.div`
  color: var(--sub);
  text-align: left;
`;

const Value = styled.div`
  color: var(--main);
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
        <Content>
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
        </Content>
      </Card>
    </StyledSettings>
  );
};

export default Setting;
