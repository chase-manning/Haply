import React, { Component } from "react";
import styled from "styled-components";
import { Line } from "../../styles/Line";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { User } from "firebase";
import Popup from "../shared/Popup";
import AchievementModel from "../../models/AchievementModel";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";

const StyledSettings = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const Header = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 5px;
  font-size: 16px;
  color: var(--main);
`;

const Label = styled.div`
  color: var(--sub);
  width: 50%;
`;

const Value = styled.div`
  color: var(--main);
  width: 50%;
`;

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ColorOptions = styled.div`
  width: 100%;
  display: grid;
  grid-row-gap: 10px;
  align-items: center;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

type ColorOptionProps = {
  selected: boolean;
};

const ColorOption = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props: ColorOptionProps) =>
    props.selected ? "solid 2px var(--primary)" : "none"};
`;

type ColorProps = {
  color: string;
};

const Color = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props: ColorProps) => props.color};
`;

class State {
  themePopupOpen: boolean = false;
}

type Props = {
  user: User;
  login: () => void;
  colorPrimary: string;
  achievements: AchievementModel[];
  setColorPrimary: (colorPrimary: string) => void;
};

export default class Settings extends Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = new State();
  }

  render() {
    return (
      <StyledSettings data-testid="Settings">
        <Header>Profile</Header>
        <Line onClick={() => this.props.login()}>
          <Label>Cloud Sync</Label>
          <Value>{this.props.user.isAnonymous ? "Disabled" : "Enabled"}</Value>
          <ChevronRight />
        </Line>
        <Header>Settings</Header>
        <Line onClick={() => this.setState({ themePopupOpen: true })}>
          <Label>Theme</Label>
          <Value>
            <Color color={this.props.colorPrimary} />
          </Value>
          <ChevronRight />
        </Line>
        <Header>Contact</Header>
        <Line onClick={() => window.open("mailto:me@chasemanning.co.nz")}>
          <Label>Suggest a Feature</Label>
          <ChevronRight />
        </Line>
        <Line onClick={() => window.open("mailto:me@chasemanning.co.nz")}>
          <Label>Report an Issue</Label>
          <ChevronRight />
        </Line>
        <Line onClick={() => window.open("mailto:me@chasemanning.co.nz")}>
          <Label>Say Hi</Label>
          <ChevronRight />
        </Line>
        <Header>About</Header>
        <Line onClick={() => window.open("https://chasemanning.co.nz/")}>
          <Label>Created By</Label>
          <Value>Chase Manning</Value>
          <ChevronRight />
        </Line>
        <Line
          onClick={() => window.open("https://github.com/chase-manning/Haply/")}
        >
          <Label>Source Code</Label>
          <Value>GitHub</Value>
          <ChevronRight />
        </Line>
        <Line
          onClick={() =>
            window.open(
              "https://github.com/chase-manning/Haply/blob/master/LICENSE"
            )
          }
        >
          <Label>License</Label>
          <Value>MIT</Value>
          <ChevronRight />
        </Line>

        {this.state.themePopupOpen && (
          <Popup
            content={
              <PopupContent>
                <ColorOptions>
                  {this.props.achievements
                    // .filter(
                    //   (achievement: AchievementModel) =>
                    //     achievement.colorPrimary !== ""
                    // )
                    .map((achievement: AchievementModel) => (
                      <ColorOption
                        onClick={() =>
                          this.props.setColorPrimary(achievement.colorPrimary)
                        }
                        selected={
                          achievement.colorPrimary === this.props.colorPrimary
                        }
                      >
                        <Color color={achievement.colorPrimary} />
                      </ColorOption>
                    ))}
                </ColorOptions>
              </PopupContent>
            }
            showButton={true}
            closePopup={() => this.setState({ themePopupOpen: false })}
          ></Popup>
        )}
      </StyledSettings>
    );
  }
}
