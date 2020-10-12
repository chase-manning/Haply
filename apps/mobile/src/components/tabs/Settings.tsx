import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../state/userSlice";
import {
  selectRandomReminders,
  selectRemindersEnabled,
  toggleRemindersEnabled,
  toggleRandomReminders,
} from "../../state/settingsSlice";
import { Mode, toggleMode, selectMode } from "../../state/tempSlice";
import { selectDarkModeUnlocked } from "../../state/dataSlice";
import { showLogin } from "../../state/navigationSlice";
import Setting from "../shared/Setting";
import ReminderPopup from "../shared/ReminderPopup";
import ThemePopup from "../shared/ThemePopup";
import TagPopup from "../shared/TagPopup";

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

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser)!;
  const remindersEnabled = useSelector(selectRemindersEnabled)!;
  const randomReminders = useSelector(selectRandomReminders)!;
  const mode = useSelector(selectMode);
  const darkModeUnlocked = useSelector(selectDarkModeUnlocked);

  return (
    <StyledSettings>
      <Header>Profile</Header>
      <Setting
        label={"Cloud Sync"}
        isToggle={true}
        toggleOn={!user.isAnonymous}
        clickFunction={dispatch(showLogin)}
      />

      <Header>Reminders</Header>
      <Setting
        label={"Reminders"}
        isToggle={true}
        toggleOn={remindersEnabled}
        clickFunction={dispatch(toggleRemindersEnabled)}
      />
      <Setting
        label={"Random Range"}
        isToggle={true}
        toggleOn={randomReminders}
        clickFunction={dispatch(toggleRandomReminders)}
      />
      <Setting
        label={"Reminder Frequency"}
        isToggle={false}
        popup={<ReminderPopup />}
      />

      <Header>Settings</Header>
      <Setting label={"Theme"} isToggle={false} popup={<ThemePopup />} />
      {darkModeUnlocked && (
        <Setting
          label={"Dark Mode"}
          isToggle={true}
          toggleOn={mode === Mode.Dark}
          clickFunction={dispatch(toggleMode)}
        />
      )}
      <Setting label={"Tags"} isToggle={false} popup={<TagPopup />} />

      <Header>Contact</Header>
      <Setting
        label={"Suggest a Feature"}
        isToggle={false}
        clickFunction={() => window.open("mailto:me@chasemanning.co.nz")}
      />
      <Setting
        label={"Report an Issue"}
        isToggle={false}
        clickFunction={() => window.open("mailto:me@chasemanning.co.nz")}
      />
      <Setting
        label={"Say Hi"}
        isToggle={false}
        clickFunction={() => window.open("mailto:me@chasemanning.co.nz")}
      />

      <Header>About</Header>
      <Setting
        label={"Created By"}
        isToggle={false}
        clickFunction={() => window.open("https://chasemanning.co.nz/")}
      />
      <Setting
        label={"Source Code"}
        isToggle={false}
        clickFunction={() =>
          window.open("https://github.com/chase-manning/Haply/")
        }
      />
      <Setting
        label={"License"}
        isToggle={false}
        clickFunction={() =>
          window.open(
            "https://github.com/chase-manning/Haply/blob/master/LICENSE"
          )
        }
      />
    </StyledSettings>
  );
};

export default Settings;
