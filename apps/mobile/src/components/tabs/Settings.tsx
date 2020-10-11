import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Popup from "../shared/Popup";
import AchievementModel from "../../models/AchievementModel";
import { SelectedTags, SelectedTag, Line } from "../../styles/Shared";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import SettingService from "../../services/SettingService";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../state/userSlice";
import {
  selectFrequencyMinutesMax,
  selectFrequencyMinutesMin,
  selectNextNotification,
  selectRandomReminders,
  selectRemindersEnabled,
  toggleRemindersEnabled,
  toggleRandomReminders,
  updateNextNotification,
} from "../../state/settingsSlice";
import {
  Mode,
  selectColorPrimary,
  toggleMode,
  selectTagOptions,
  setColorPrimary,, selectMode, removeTagOption, addTagOption
} from "../../state/tempSlice";
import { selectAchievements } from "../../state/dataSlice";
import { showLogin } from "../../state/navigationSlice";

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

const ColorOption = styled.button`
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

const AddTagContent = styled.button`
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

const getFrequencyInputFromMinutes = (minutes: number): number => {
  if (minutes < 60) return minutes;
  else if (minutes < 60 * 24) return minutes / 60;
  else return minutes / (60 * 24);
};

const getFrequencyDropdownFromMinutes = (minutes: number): string => {
  if (minutes < 60) return "Minutes";
  else if (minutes < 60 * 24) return "Hours";
  else return "Days";
};

const getFrequencyMultiplier = (frequencyDropdown: string): number => {
  if (frequencyDropdown === "Minutes") return 1;
  else if (frequencyDropdown === "Hours") return 60;
  else return 60 * 24;
};

const frequency = (input: number, period: string) =>
  input * getFrequencyMultiplier(period);

const Settings = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const user = useSelector(selectUser)!;
  const remindersEnabled = useSelector(selectRemindersEnabled)!;
  const randomReminders = useSelector(selectRandomReminders)!;
  const frequencyMinutesMin = useSelector(selectFrequencyMinutesMin)!;
  const frequencyMinutesMax = useSelector(selectFrequencyMinutesMax)!;
  const nextNotification = useSelector(selectNextNotification)!;
  const colorPrimary = useSelector(selectColorPrimary);
  const mode = useSelector(selectMode);
  const tagOptions = useSelector(selectTagOptions);
  const achievements = useSelector(selectAchievements);

  useEffect(() => {
    setState({
      ...state,
      reminderFrequencyMinimumInput: getFrequencyInputFromMinutes(
        frequencyMinutesMin
      ),
      reminderFrequencyMinimumDropdown: getFrequencyDropdownFromMinutes(
        frequencyMinutesMin
      ),
      reminderFrequencyMaximumInput: getFrequencyInputFromMinutes(
        frequencyMinutesMax
      ),
      reminderFrequencyMaximumDropdown: getFrequencyDropdownFromMinutes(
        frequencyMinutesMax
      ),
    });
  });

  return (
    <StyledSettings data-testid="Settings">
      <Header>Profile</Header>
      <Line onClick={() => dispatch(showLogin)}>
        <Label>Cloud Sync</Label>
        <Value>
          <Toggle on={!user.isAnonymous}>
            {!user.isAnonymous ? (
              <ToggleOnIcon fontSize={"large"} />
            ) : (
              <ToggleOffIcon fontSize={"large"} />
            )}
          </Toggle>
        </Value>
      </Line>
      <Header>Reminders</Header>
      <Line onClick={() => dispatch(toggleRemindersEnabled)}>
        <Label>Reminders</Label>
        <Value>
          <Toggle on={remindersEnabled}>
            {remindersEnabled ? (
              <ToggleOnIcon fontSize={"large"} />
            ) : (
              <ToggleOffIcon fontSize={"large"} />
            )}
          </Toggle>
        </Value>
      </Line>
      <Line onClick={() => dispatch(toggleRandomReminders)}>
        <Label>Random Range</Label>
        <Value>
          <Toggle on={randomReminders}>
            {randomReminders ? (
              <ToggleOnIcon fontSize={"large"} />
            ) : (
              <ToggleOffIcon fontSize={"large"} />
            )}
          </Toggle>
        </Value>
      </Line>
      <Line
        onClick={() => setState({ ...state, reminderFrequencyPopupOpen: true })}
      >
        <Label>Reminder Frequency</Label>
        <Value></Value>
        <ChevronRight />
      </Line>
      <Header>Settings</Header>
      <Line onClick={() => setState({ ...state, themePopupOpen: true })}>
        <Label>Theme</Label>
        <ChevronRight />
      </Line>
      {achievements.some(
        (achievement: AchievementModel) =>
          achievement.unlocks.indexOf("Dark Mode") >= 0 &&
          achievement.percentComplete === 1
      ) && (
        <Line onClick={() => dispatch(toggleMode)}>
          <Label>Dark Mode</Label>
          <Value>
            <Toggle on={mode === Mode.Dark}>
              {mode === Mode.Dark ? (
                <ToggleOnIcon fontSize={"large"} />
              ) : (
                <ToggleOffIcon fontSize={"large"} />
              )}
            </Toggle>
          </Value>
        </Line>
      )}
      <Line onClick={() => setState({ ...state, tagsPopupOpen: true })}>
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
      {state.reminderFrequencyPopupOpen && (
        <Popup
          content={
            <PopupContent>
              <PopupHeader>
                {randomReminders
                  ? "At Minumum Remind me Every:"
                  : "Remind me Every:"}
              </PopupHeader>
              <FrequencyItem>
                <FrequencyInput
                  value={state.reminderFrequencyMinimumInput}
                  onChange={(event: any) => {
                    setState({
                      ...state,
                      reminderFrequencyMinimumInput: event.target.value,
                    });
                    props.setReminderFrequencies(
                      frequency(
                        state.reminderFrequencyMinimumInput,
                        state.reminderFrequencyMinimumDropdown
                      ),
                      randomReminders
                        ? frequency(
                            state.reminderFrequencyMaximumInput,
                            state.reminderFrequencyMaximumDropdown
                          )
                        : frequency(
                            state.reminderFrequencyMinimumInput,
                            state.reminderFrequencyMinimumDropdown
                          )
                    );
                  }}
                  type="number"
                />
                <FrequencySelect
                  value={state.reminderFrequencyMinimumDropdown}
                  onChange={(event: any) => {
                    setState({
                      ...state,
                      reminderFrequencyMinimumDropdown: event.target.value,
                    });
                    props.setReminderFrequencies(
                      frequency(
                        state.reminderFrequencyMinimumInput,
                        state.reminderFrequencyMinimumDropdown
                      ),
                      randomReminders
                        ? frequency(
                            state.reminderFrequencyMaximumInput,
                            state.reminderFrequencyMaximumDropdown
                          )
                        : frequency(
                            state.reminderFrequencyMinimumInput,
                            state.reminderFrequencyMinimumDropdown
                          )
                    );
                  }}
                >
                  <FrequencyOption>Minutes</FrequencyOption>
                  <FrequencyOption>Hours</FrequencyOption>
                  <FrequencyOption>Days</FrequencyOption>
                </FrequencySelect>
              </FrequencyItem>
              {randomReminders && (
                <FrequencySecondItem>
                  <PopupHeader>At Maximum Remind me Every:</PopupHeader>
                  <FrequencyItem>
                    <FrequencyInput
                      value={state.reminderFrequencyMaximumInput}
                      onChange={(event: any) => {
                        setState({
                          ...state,
                          reminderFrequencyMaximumInput: event.target.value,
                        });
                        props.setReminderFrequencies(
                          frequency(
                            state.reminderFrequencyMinimumInput,
                            state.reminderFrequencyMinimumDropdown
                          ),
                          randomReminders
                            ? frequency(
                                state.reminderFrequencyMaximumInput,
                                state.reminderFrequencyMaximumDropdown
                              )
                            : frequency(
                                state.reminderFrequencyMinimumInput,
                                state.reminderFrequencyMinimumDropdown
                              )
                        );
                      }}
                      type="number"
                    />
                    <FrequencySelect
                      value={state.reminderFrequencyMaximumDropdown}
                      onChange={(event: any) => {
                        setState({
                          ...state,
                          reminderFrequencyMaximumDropdown: event.target.value,
                        });
                        props.setReminderFrequencies(
                          frequency(
                            state.reminderFrequencyMinimumInput,
                            state.reminderFrequencyMinimumDropdown
                          ),
                          randomReminders
                            ? frequency(
                                state.reminderFrequencyMaximumInput,
                                state.reminderFrequencyMaximumDropdown
                              )
                            : frequency(
                                state.reminderFrequencyMinimumInput,
                                state.reminderFrequencyMinimumDropdown
                              )
                        );
                      }}
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
          close={async () => {
            await setState({ ...state, reminderFrequencyPopupOpen: false });
            await SettingService.createSetting(user, props.settings);
          }}
        />
      )}

      {state.themePopupOpen && (
        <Popup
          content={
            <PopupContent>
              <ColorOptions>
                {achievements
                  .filter(
                    (achievement: AchievementModel) =>
                      achievement.colorPrimary !== "" &&
                      achievement.percentComplete === 1
                  )
                  .map((achievement: AchievementModel) => (
                    <ColorOption
                      onClick={() =>
                        dispatch(setColorPrimary(achievement.colorPrimary))
                      }
                      selected={achievement.colorPrimary === colorPrimary}
                    >
                      <Color color={achievement.colorPrimary} />
                    </ColorOption>
                  ))}
              </ColorOptions>
            </PopupContent>
          }
          showButton={true}
          close={() => setState({ ...state, themePopupOpen: false })}
        />
      )}
      {state.tagsPopupOpen && (
        <Popup
          content={
            <PopupContent>
              <SelectedTags>
                {tagOptions.map((tagOption: string) => (
                  <SelectedTag
                    onClick={() => dispatch(removeTagOption(tagOption))}
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
                    onClick={() =>
                      setState({ ...state, newTagPopupOpen: true })
                    }
                  >
                    <AddTagText>Add</AddTagText>
                    <TagIcon>
                      <AddIcon fontSize={"inherit"} />
                    </TagIcon>
                  </AddTagContent>
                  {state.newTagPopupOpen && (
                    <Popup
                      content={
                        <PopupContent>
                          <TagInput
                            value={state.newTag}
                            placeholder="New Tag..."
                            onChange={(event: any) =>
                              setState({
                                ...state,
                                newTag: event.target.value,
                              })
                            }
                          />
                        </PopupContent>
                      }
                      showButton={true}
                      close={() =>
                        setState({
                          ...state,
                          newTagPopupOpen: false,
                          newTag: "",
                        })
                      }
                      submit={() => dispatch(addTagOption(state.newTag))}
                    />
                  )}
                </AddTag>
              </SelectedTags>
            </PopupContent>
          }
          showButton={true}
          close={() => setState({ ...state, tagsPopupOpen: false })}
        />
      )}
    </StyledSettings>
  );
};

export default Settings;
