import React, { Component } from "react";
import styled from "styled-components";
import { Line } from "../../styles/Line";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { User } from "firebase";
import Popup from "../shared/Popup";
import AchievementModel from "../../models/AchievementModel";
import { Mode, SettingsModel } from "../../models/state";
import { SelectedTags, SelectedTag } from "../../styles/Shared";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";

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

const TagIcon = styled.div`
  font-size: 14px;
  margin-left: 2px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddTag = styled.div`
  height: 24px;
  border-radius: 12px;
  background-color: var(--sub-light);
  color: var(--sub);
  display: inline-block;
  font-size: 14px;
`;

const AddTagContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`;

const AddTagText = styled.div`
  font-size: 12px;
  float: left;
`;

const TagInput = styled.input`
  width: 100%;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  background-color: var(--bg-top);
  color: var(--main);
`;

class State {
  themePopupOpen: boolean = false;
  tagsPopupOpen: boolean = false;
  newTag: string = "";
  newTagPopupOpen: boolean = false;
}

type Props = {
  user: User;
  login: () => void;
  colorPrimary: string;
  achievements: AchievementModel[];
  setColorPrimary: (colorPrimary: string) => void;
  mode: Mode;
  toggleMode: () => void;
  tagOptions: string[];
  removeTag: (tag: string) => void;
  addTag: (tag: string) => void;
  settings: SettingsModel;
  toggleRemindersEnabled: () => void;
};

export default class Settings extends Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = new State();
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  handleTagChange(event: any): void {
    this.setState({
      newTag: event.target.value,
    });
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
        <Header>Reminders</Header>
        <Line onClick={() => this.props.toggleRemindersEnabled()}>
          <Label>Reminders</Label>
          <Value>
            {this.props.settings.remindersEnabled ? "Enabled" : "Disabled"}
          </Value>
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
        {this.props.achievements.some(
          (achievement: AchievementModel) =>
            achievement.unlocks.indexOf("Dark Mode") >= 0 &&
            achievement.percentComplete === 1
        ) && (
          <Line onClick={() => this.props.toggleMode()}>
            <Label>Dark Mode</Label>
            <Value>
              {this.props.mode === Mode.Dark ? "Enabled" : "Disabled"}
            </Value>
            <ChevronRight />
          </Line>
        )}
        <Line onClick={() => this.setState({ tagsPopupOpen: true })}>
          <Label>Tags</Label>
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
                    .filter(
                      (achievement: AchievementModel) =>
                        achievement.colorPrimary !== "" &&
                        achievement.percentComplete === 1
                    )
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
          />
        )}
        {this.state.tagsPopupOpen && (
          <Popup
            content={
              <PopupContent>
                <SelectedTags>
                  {this.props.tagOptions.map((tagOption: string) => (
                    <SelectedTag
                      onClick={() => this.props.removeTag(tagOption)}
                      includeMargin={true}
                    >
                      {tagOption}
                      <TagIcon>
                        <CloseIcon fontSize={"inherit"} />
                      </TagIcon>
                    </SelectedTag>
                  ))}
                  <AddTag>
                    <AddTagContent
                      onClick={() => this.setState({ newTagPopupOpen: true })}
                    >
                      <AddTagText>Add</AddTagText>
                      <TagIcon>
                        <AddIcon fontSize={"inherit"} />
                      </TagIcon>
                    </AddTagContent>
                    {this.state.newTagPopupOpen && (
                      <Popup
                        content={
                          <PopupContent>
                            <TagInput
                              value={this.state.newTag}
                              placeholder="New Tag..."
                              onChange={this.handleTagChange}
                            />
                          </PopupContent>
                        }
                        closePopup={() => {
                          this.props.addTag(this.state.newTag);
                          this.setState({ newTagPopupOpen: false, newTag: "" });
                        }}
                        showButton={true}
                      />
                    )}
                  </AddTag>
                </SelectedTags>
              </PopupContent>
            }
            showButton={true}
            closePopup={() => this.setState({ tagsPopupOpen: false })}
          />
        )}
      </StyledSettings>
    );
  }
}
