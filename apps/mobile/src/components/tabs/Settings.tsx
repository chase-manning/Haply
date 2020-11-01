import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRandomReminders,
  selectRemindersEnabled,
  toggleRemindersEnabled,
  toggleRandomReminders,
  selectMode,
  toggleMode,
  Mode,
} from "../../state/settingsSlice";
import { selectDarkModeUnlocked } from "../../state/dataSlice";
import { showLogin } from "../../state/navigationSlice";
import Setting from "../shared/Setting";
import ReminderPopup from "../shared/ReminderPopup";
import ThemePopup from "../shared/ThemePopup";
import TagPopup from "../shared/TagPopup";
import { selectUser } from "../../state/userSlice";
import { firebaseApp } from "../../components/shared/Login";
import { Header } from "../../styles/Shared";

import CloudOutlinedIcon from "@material-ui/icons/CloudOutlined";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import CasinoOutlinedIcon from "@material-ui/icons/CasinoOutlined";
import HourglassEmptyOutlinedIcon from "@material-ui/icons/HourglassEmptyOutlined";
import FormatPaintOutlinedIcon from "@material-ui/icons/FormatPaintOutlined";
import Brightness2OutlinedIcon from "@material-ui/icons/Brightness2Outlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import BugReportOutlinedIcon from "@material-ui/icons/BugReportOutlined";
import EmojiPeopleOutlinedIcon from "@material-ui/icons/EmojiPeopleOutlined";
import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";
import SecurityIcon from "@material-ui/icons/Security";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import LoadingLine from "../shared/LoadingLine";
import { selectSettingsLoading } from "../../state/loadingSlice";

const StyledSettings = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 30px;
  position: relative;
`;

class State {
  reminderPopupOpen: boolean = false;
  tagPopupOpen: boolean = false;
  themePopupOpen: boolean = false;
}

const Settings = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const remindersEnabled = useSelector(selectRemindersEnabled)!;
  const randomReminders = useSelector(selectRandomReminders)!;
  const mode = useSelector(selectMode);
  const darkModeUnlocked = useSelector(selectDarkModeUnlocked);
  const user = useSelector(selectUser);
  const settingsLoading = useSelector(selectSettingsLoading);

  return (
    <StyledSettings>
      <LoadingLine loading={settingsLoading} />
      <Header>Profile</Header>
      <Setting
        label={"Cloud Sync"}
        isToggle={true}
        toggleOn={!user.isAnonymous}
        clickFunction={async () => {
          if (user.isAnonymous) {
            dispatch(showLogin());
          } else {
            await firebaseApp.auth().signOut();
            await firebaseApp.auth().signInAnonymously();
          }
        }}
        icon={<CloudOutlinedIcon />}
      />

      <Header>Reminders</Header>
      <Setting
        label={"Reminders"}
        isToggle={true}
        toggleOn={remindersEnabled}
        clickFunction={() => dispatch(toggleRemindersEnabled())}
        icon={<NotificationsOutlinedIcon />}
      />
      <Setting
        label={"Random Range"}
        isToggle={true}
        toggleOn={randomReminders}
        clickFunction={() => dispatch(toggleRandomReminders())}
        icon={<CasinoOutlinedIcon />}
      />
      <Setting
        label={"Reminder Frequency"}
        isToggle={false}
        clickFunction={() => setState({ ...state, reminderPopupOpen: true })}
        icon={<HourglassEmptyOutlinedIcon />}
      />

      <Header>Settings</Header>
      <Setting
        label={"Theme"}
        isToggle={false}
        clickFunction={() => setState({ ...state, themePopupOpen: true })}
        icon={<FormatPaintOutlinedIcon />}
      />
      {darkModeUnlocked && (
        <Setting
          label={"Dark Mode"}
          isToggle={true}
          toggleOn={mode === Mode.Dark}
          clickFunction={() => dispatch(toggleMode())}
          icon={<Brightness2OutlinedIcon />}
        />
      )}
      <Setting
        label={"Tags"}
        isToggle={false}
        clickFunction={() => setState({ ...state, tagPopupOpen: true })}
        icon={<LocalOfferOutlinedIcon />}
      />

      <Header>Contact</Header>
      <Setting
        label={"Suggest a Feature"}
        isToggle={false}
        clickFunction={() => window.open("mailto:hello@haply.app")}
        icon={<EmojiObjectsOutlinedIcon />}
      />
      <Setting
        label={"Report an Issue"}
        isToggle={false}
        clickFunction={() => window.open("mailto:hello@haply.app")}
        icon={<BugReportOutlinedIcon />}
      />
      <Setting
        label={"Say Hi"}
        isToggle={false}
        clickFunction={() => window.open("mailto:hello@haply.app")}
        icon={<EmojiPeopleOutlinedIcon />}
      />

      <Header>About</Header>
      <Setting
        label={"Created By"}
        isToggle={false}
        clickFunction={() => window.open("https://chasemanning.co.nz/")}
        icon={<FaceOutlinedIcon />}
      />
      <Setting
        label={"Privacy Policy"}
        isToggle={false}
        clickFunction={() => window.open("https://haply.app/privacy-policy")}
        icon={<SecurityIcon />}
      />
      <Setting
        label={"Terms & Conditions"}
        isToggle={false}
        clickFunction={() =>
          window.open("https://haply.app/terms-and-conditions")
        }
        icon={<VerifiedUserOutlinedIcon />}
      />

      <ReminderPopup
        open={state.reminderPopupOpen}
        closePopup={() => setState({ ...state, reminderPopupOpen: false })}
      />
      <TagPopup
        open={state.tagPopupOpen}
        closePopup={() => setState({ ...state, tagPopupOpen: false })}
      />
      <ThemePopup
        open={state.themePopupOpen}
        closePopup={() => setState({ ...state, themePopupOpen: false })}
      />
    </StyledSettings>
  );
};

export default Settings;
