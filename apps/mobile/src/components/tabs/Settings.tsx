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
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import SettingService from "../../services/SettingService";

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
  width: 70%;
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

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PopupHeader = styled.div`
  color: var(--sub);
  font-size: 14px;
  margin-bottom: 10px;
`;

const FrequencyItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FrequencyInput = styled.input`
  width: 40%;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  background-color: var(--bg-top);
  color: var(--main);
`;
const FrequencySelect = styled.select`
  width: 50%;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  background-color: var(--bg-top);
  color: var(--main);
`;

const FrequencyOption = styled.option``;

const FrequencySecondItem = styled.div`
  margin-top: 20px;
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
  reminderFrequencyPopupOpen: boolean = false;
  reminderFrequencyMinimumInput: number = 3;
  reminderFrequencyMinimumDropdown: string = "Hours";
  reminderFrequencyMaximumInput: number = 3;
  reminderFrequencyMaximumDropdown: string = "Hours";
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
  toggleRandomReminders: () => void;
  setReminderFrequencies: (min: number, max: number) => void;
};

export default class Settings extends Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = new State();
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleMinInputChange = this.handleMinInputChange.bind(this);
    this.handleMinDropdownChange = this.handleMinDropdownChange.bind(this);
    this.handleMaxInputChange = this.handleMaxInputChange.bind(this);
    this.handleMaxDropdownChange = this.handleMaxDropdownChange.bind(this);
  }

  async componentDidMount() {
    await this.setReminderFrequencies();
  }

  handleTagChange(event: any): void {
    this.setState({
      newTag: event.target.value,
    });
  }

  async handleMinInputChange(event: any): Promise<void> {
    await this.setState({
      reminderFrequencyMinimumInput: event.target.value,
    });
    this.updateFrequencyState();
  }

  async handleMinDropdownChange(event: any): Promise<void> {
    await this.setState({
      reminderFrequencyMinimumDropdown: event.target.value,
    });
    this.updateFrequencyState();
  }

  async handleMaxInputChange(event: any): Promise<void> {
    await this.setState({
      reminderFrequencyMaximumInput: event.target.value,
    });
    this.updateFrequencyState();
  }

  async handleMaxDropdownChange(event: any): Promise<void> {
    await this.setState({
      reminderFrequencyMaximumDropdown: event.target.value,
    });
    this.updateFrequencyState();
  }

  setReminderFrequencies(): void {
    this.setState({
      reminderFrequencyMinimumInput: this.getFrequencyInputFromMinutes(
        this.props.settings.frequencyMinutesMin
      ),
    });
    this.setState({
      reminderFrequencyMinimumDropdown: this.getFrequencyDropdownFromMinutes(
        this.props.settings.frequencyMinutesMin
      ),
    });
    this.setState({
      reminderFrequencyMaximumInput: this.getFrequencyInputFromMinutes(
        this.props.settings.frequencyMinutesMax
      ),
    });
    this.setState({
      reminderFrequencyMaximumDropdown: this.getFrequencyDropdownFromMinutes(
        this.props.settings.frequencyMinutesMax
      ),
    });
  }

  updateFrequencyState(): void {
    this.props.setReminderFrequencies(
      this.minFrequency,
      this.props.settings.randomReminders
        ? this.maxFrequency
        : this.minFrequency
    );
  }

  get minFrequency(): number {
    console.log("State Min Input: " + this.state.reminderFrequencyMinimumInput);
    console.log(
      this.getFrequencyMultiplier(this.state.reminderFrequencyMinimumDropdown)
    );
    return (
      this.state.reminderFrequencyMinimumInput *
      this.getFrequencyMultiplier(this.state.reminderFrequencyMinimumDropdown)
    );
  }

  get maxFrequency(): number {
    return (
      this.state.reminderFrequencyMaximumInput *
      this.getFrequencyMultiplier(this.state.reminderFrequencyMaximumDropdown)
    );
  }

  getFrequencyInputFromMinutes(minutes: number): number {
    console.log(minutes);
    if (minutes < 60) return minutes;
    else if (minutes < 60 * 24) return minutes / 60;
    else return minutes / (60 * 24);
  }

  getFrequencyDropdownFromMinutes(minutes: number): string {
    console.log(minutes);
    if (minutes < 60) return "Minutes";
    else if (minutes < 60 * 24) return "Hours";
    else return "Days";
  }

  getFrequencyMultiplier(frequencyDropdown: string): number {
    if (frequencyDropdown === "Minutes") return 1;
    else if (frequencyDropdown === "Hours") return 60;
    else return 60 * 24;
  }

  render() {
    return (
      <StyledSettings data-testid="Settings">
        <Header>Profile</Header>
        <Line onClick={() => this.props.login()}>
          <Label>Cloud Sync</Label>
          <Value>
            <Toggle on={!this.props.user.isAnonymous}>
              {!this.props.user.isAnonymous ? (
                <ToggleOnIcon fontSize={"large"} />
              ) : (
                <ToggleOffIcon fontSize={"large"} />
              )}
            </Toggle>
          </Value>
        </Line>
        <Header>Reminders</Header>
        <Line onClick={() => this.props.toggleRemindersEnabled()}>
          <Label>Reminders</Label>
          <Value>
            <Toggle on={this.props.settings.remindersEnabled}>
              {this.props.settings.remindersEnabled ? (
                <ToggleOnIcon fontSize={"large"} />
              ) : (
                <ToggleOffIcon fontSize={"large"} />
              )}
            </Toggle>
          </Value>
        </Line>
        <Line onClick={() => this.props.toggleRandomReminders()}>
          <Label>Random Range</Label>
          <Value>
            <Toggle on={this.props.settings.randomReminders}>
              {this.props.settings.randomReminders ? (
                <ToggleOnIcon fontSize={"large"} />
              ) : (
                <ToggleOffIcon fontSize={"large"} />
              )}
            </Toggle>
          </Value>
        </Line>
        <Line
          onClick={() => this.setState({ reminderFrequencyPopupOpen: true })}
        >
          <Label>Reminder Frequency</Label>
          <Value></Value>
          <ChevronRight />
        </Line>
        <Header>Settings</Header>
        <Line onClick={() => this.setState({ themePopupOpen: true })}>
          <Label>Theme</Label>
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
              <Toggle on={this.props.mode === Mode.Dark}>
                {this.props.mode === Mode.Dark ? (
                  <ToggleOnIcon fontSize={"large"} />
                ) : (
                  <ToggleOffIcon fontSize={"large"} />
                )}
              </Toggle>
            </Value>
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
          <ChevronRight />
        </Line>
        <Line
          onClick={() => window.open("https://github.com/chase-manning/Haply/")}
        >
          <Label>Source Code</Label>
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
          <ChevronRight />
        </Line>
        {this.state.reminderFrequencyPopupOpen && (
          <Popup
            content={
              <PopupContent>
                <PopupHeader>
                  {this.props.settings.randomReminders
                    ? "At Minumum Remind me Every:"
                    : "Remind me Every:"}
                </PopupHeader>
                <FrequencyItem>
                  <FrequencyInput
                    value={this.state.reminderFrequencyMinimumInput}
                    onChange={this.handleMinInputChange}
                    type="number"
                  />
                  <FrequencySelect
                    value={this.state.reminderFrequencyMinimumDropdown}
                    onChange={this.handleMinDropdownChange}
                  >
                    <FrequencyOption>Minutes</FrequencyOption>
                    <FrequencyOption>Hours</FrequencyOption>
                    <FrequencyOption>Days</FrequencyOption>
                  </FrequencySelect>
                </FrequencyItem>
                {this.props.settings.randomReminders && (
                  <FrequencySecondItem>
                    <PopupHeader>At Maximum Remind me Every:</PopupHeader>
                    <FrequencyItem>
                      <FrequencyInput
                        value={this.state.reminderFrequencyMaximumInput}
                        onChange={this.handleMaxInputChange}
                        type="number"
                      />
                      <FrequencySelect
                        value={this.state.reminderFrequencyMaximumDropdown}
                        onChange={this.handleMaxDropdownChange}
                      >
                        <FrequencyOption>Minutes</FrequencyOption>
                        <FrequencyOption>Hours</FrequencyOption>
                        <FrequencyOption>Days</FrequencyOption>
                      </FrequencySelect>
                    </FrequencyItem>
                  </FrequencySecondItem>
                )}
              </PopupContent>
            }
            showButton={true}
            closePopup={() => this.closeRemindersPopup()}
          />
        )}

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

  async closeRemindersPopup(): Promise<void> {
    await this.setState({ reminderFrequencyPopupOpen: false });
    await this.saveSetting();
  }

  async saveSetting(): Promise<void> {
    await SettingService.createSetting(this.props.user, this.props.settings);
  }
}
