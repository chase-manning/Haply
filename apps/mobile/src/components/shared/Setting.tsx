import React from "react";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import { Card, Icon } from "../../styles/Shared";

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

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  color: var(--main);
  text-align: left;
  font-size: 15px;
`;

const Chevron = styled.div`
  color: var(--sub);
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
  icon: JSX.Element;
};

const Setting = (props: Props) => {
  return (
    <StyledSettings>
      <Card onClick={() => props.clickFunction()}>
        <Content>
          <LeftSide>
            <Icon>{props.icon}</Icon>
            <Label>{props.label}</Label>
          </LeftSide>
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
            <Chevron>
              <ChevronRight />
            </Chevron>
          )}
        </Content>
      </Card>
    </StyledSettings>
  );
};

export default Setting;
