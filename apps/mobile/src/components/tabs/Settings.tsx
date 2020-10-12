import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Popup from "../shared/Popup";
import AchievementModel from "../../models/AchievementModel";
import { SelectedTags, SelectedTag, Line } from "../../styles/Shared";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../state/userSlice";
import {
  selectRandomReminders,
  selectRemindersEnabled,
  toggleRemindersEnabled,
  toggleRandomReminders,
} from "../../state/settingsSlice";
import {
  Mode,
  selectColorPrimary,
  toggleMode,
  selectTagOptions,
  setColorPrimary,, selectMode, removeTagOption, addTagOption
} from "../../state/tempSlice";
import { selectAchievements, selectDarkModeUnlocked } from "../../state/dataSlice";
import { showLogin } from "../../state/navigationSlice";
import Setting from "../shared/Setting"
import ReminderPopup from "../shared/ReminderPopup";

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
}

const Settings = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const user = useSelector(selectUser)!;
  const remindersEnabled = useSelector(selectRemindersEnabled)!;
  const randomReminders = useSelector(selectRandomReminders)!;
  const colorPrimary = useSelector(selectColorPrimary);
  const mode = useSelector(selectMode);
  const tagOptions = useSelector(selectTagOptions);
  const achievements = useSelector(selectAchievements);
  const darkModeUnlocked = useSelector(selectDarkModeUnlocked);

  return (
    <StyledSettings data-testid="Settings">
      <Header>Profile</Header>
      <Setting label={"Cloud Sync"} isToggle={true} toggleOn={!user.isAnonymous} clickFunction={dispatch(showLogin)}/>

      <Header>Reminders</Header>
      <Setting label={"Reminders"} isToggle={true} toggleOn={remindersEnabled} clickFunction={dispatch(toggleRemindersEnabled)}/>
      <Setting label={"Random Range"} isToggle={true} toggleOn={randomReminders} clickFunction={dispatch(toggleRandomReminders)}/>
      <Setting label={"Reminder Frequency"} isToggle={false} popup={<ReminderPopup />}/>

      <Header>Settings</Header>
      <Setting label={"Theme"} isToggle={false} popup={<div>TODO</div>}/>
      { darkModeUnlocked && (
      <Setting label={"Dark Mode"} isToggle={true} toggleOn={mode === Mode.Dark} clickFunction={dispatch(toggleMode)}/>
      )}
      <Setting label={"Tags"} isToggle={false} popup={<div>TODO</div>}/>

      <Header>Contact</Header>
      <Setting label={"Suggest a Feature"} isToggle={false} clickFunction={() => window.open("mailto:me@chasemanning.co.nz")}/>
      <Setting label={"Report an Issue"} isToggle={false} clickFunction={() => window.open("mailto:me@chasemanning.co.nz")}/>
      <Setting label={"Say Hi"} isToggle={false} clickFunction={() => window.open("mailto:me@chasemanning.co.nz")}/>

      <Header>About</Header>
      <Setting label={"Created By"} isToggle={false} clickFunction={() => window.open("https://chasemanning.co.nz/")}/>
      <Setting label={"Source Code"} isToggle={false} clickFunction={() => window.open("https://github.com/chase-manning/Haply/")}/>
      <Setting label={"License"} isToggle={false} clickFunction={() => window.open("https://github.com/chase-manning/Haply/blob/master/LICENSE")}/>

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
