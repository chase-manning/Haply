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

const Content = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;

type LabelProps = {
  highlight?: boolean;
};

const Label = styled.div`
  color: ${(props: LabelProps) => (props.highlight ? "white" : "var(--main)")};
  text-align: left;
  font-size: 15px;
`;

type ChevronProps = {
  highlight?: boolean;
};

const Chevron = styled.div`
  color: ${(props: ChevronProps) => (props.highlight ? "white" : "var(--sub)")};
`;

const Value = styled.div`
  color: var(--main);
`;

type ToggleProps = {
  enabled: boolean;
};

const Toggle = styled.div`
  color: ${(props: ToggleProps) =>
    props.enabled ? "var(--primary)" : "var(--sub)"};
  display: flex;
  align-items: center;
`;

type Props = {
  label: string;
  isToggle: boolean;
  toggleOn?: boolean;
  clickFunction: () => void;
  icon: JSX.Element;
  highlight?: boolean;
};

const Setting = (props: Props) => {
  return (
    <StyledSettings>
      <Card highlight={props.highlight}>
        <Content onClick={() => props.clickFunction()}>
          <LeftSide>
            <Icon highlight={props.highlight}>{props.icon}</Icon>
            <Label highlight={props.highlight}>{props.label}</Label>
          </LeftSide>
          {props.isToggle ? (
            <Value>
              <Toggle enabled={!!props.toggleOn}>
                {props.toggleOn ? (
                  <ToggleOnIcon fontSize={"large"} />
                ) : (
                  <ToggleOffIcon fontSize={"large"} />
                )}
              </Toggle>
            </Value>
          ) : (
            <Chevron highlight={props.highlight}>
              <ChevronRight />
            </Chevron>
          )}
        </Content>
      </Card>
    </StyledSettings>
  );
};

export default Setting;
