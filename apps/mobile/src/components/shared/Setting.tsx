import React from "react";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { Card, Icon } from "../../styles/Shared";

type StyledSettingsProps = {
  hightlight: boolean;
};

const StyledSettings = styled.div`
  margin-top: ${(props: StyledSettingsProps) =>
    props.hightlight ? "15px" : "0"};
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
  color: ${(props: LabelProps) =>
    props.highlight ? "var(--bg-mid)" : "var(--main)"};
  text-align: left;
  font-size: 15px;
  margin-left: 15px;
`;

type ChevronProps = {
  highlight?: boolean;
};

const Chevron = styled.div`
  color: ${(props: ChevronProps) =>
    props.highlight ? "var(--bg-mid)" : "var(--sub)"};
`;

const LinkIcon = styled.div`
  color: var(--sub);
  margin-right: 5px;
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

export enum SettingType {
  Toggle,
  Popup,
  Link,
}

type Props = {
  type: SettingType;
  label: string;
  toggleOn?: boolean;
  clickFunction: () => void;
  icon: JSX.Element;
  highlight?: boolean;
};

const Setting = (props: Props) => {
  return (
    <StyledSettings hightlight={!!props.highlight}>
      <Card highlight={props.highlight}>
        <Content onClick={() => props.clickFunction()}>
          <LeftSide>
            <Icon highlight={props.highlight}>{props.icon}</Icon>
            <Label highlight={props.highlight}>{props.label}</Label>
          </LeftSide>
          {props.type === SettingType.Toggle && (
            <Value>
              <Toggle enabled={!!props.toggleOn}>
                {props.toggleOn ? (
                  <ToggleOnIcon fontSize={"large"} />
                ) : (
                  <ToggleOffIcon fontSize={"large"} />
                )}
              </Toggle>
            </Value>
          )}
          {props.type === SettingType.Popup && (
            <Chevron highlight={props.highlight}>
              <ChevronRight />
            </Chevron>
          )}
          {props.type === SettingType.Link && (
            <LinkIcon>
              <OpenInNewIcon fontSize={"small"} />
            </LinkIcon>
          )}
        </Content>
      </Card>
    </StyledSettings>
  );
};

export default Setting;
