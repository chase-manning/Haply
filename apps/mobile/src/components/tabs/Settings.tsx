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
  setColorPrimary,
  setColorSecondary,
  selectColorPrimary,
  selectColorSecondary,
  selectFeelings,
  selectPlaces,
  selectActivities,
  selectPeople,
  selectBlockFeelings,
  selectBlockPlaces,
  selectBlockActivities,
  selectBlockPeople,
  addFeeling,
  addPlace,
  addActivity,
  addPerson,
  removeFeeling,
  removePlace,
  removeActivity,
  removePerson,
} from "../../state/settingsSlice";
import { selectDarkModeUnlocked } from "../../state/dataSlice";
import {
  showLogin,
  showPremium,
  selectPasscode,
  enablePasscode,
  disablePasscode,
} from "../../state/navigationSlice";
import Setting from "../shared/Setting";
import ReminderPopup from "../shared/ReminderPopup";
import ThemePopup from "../shared/ThemePopup";
import TagPopup from "../shared/TagPopup";
import { selectUser } from "../../state/userSlice";
import { firebaseApp } from "../../components/shared/Login";
import { Header } from "../../styles/Shared";

import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CloudOutlinedIcon from "@material-ui/icons/CloudOutlined";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import CasinoOutlinedIcon from "@material-ui/icons/CasinoOutlined";
import HourglassEmptyOutlinedIcon from "@material-ui/icons/HourglassEmptyOutlined";
import FormatPaintOutlinedIcon from "@material-ui/icons/FormatPaintOutlined";
import BrushOutlinedIcon from "@material-ui/icons/BrushOutlined";
import Brightness2OutlinedIcon from "@material-ui/icons/Brightness2Outlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import BugReportOutlinedIcon from "@material-ui/icons/BugReportOutlined";
import EmojiPeopleOutlinedIcon from "@material-ui/icons/EmojiPeopleOutlined";
import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";
import SecurityIcon from "@material-ui/icons/Security";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import PlaceOutlinedIcon from "@material-ui/icons/PlaceOutlined";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";

import LoadingLine from "../shared/LoadingLine";
import { selectSettingsLoading } from "../../state/loadingSlice";
import { selectIsPremium } from "../../state/premiumSlice";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const StyledSettings = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 30px;
  position: relative;
`;

class State {
  reminderPopupOpen: boolean = false;
  feelingsOpen: boolean = false;
  placesOpen: boolean = false;
  activitiesOpen: boolean = false;
  peopleOpen: boolean = false;
  themePrimaryPopupOpen: boolean = false;
  themeSecondaryPopupOpen: boolean = false;
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
  const isPremium = useSelector(selectIsPremium);
  const colorPrimary = useSelector(selectColorPrimary);
  const colorSecondary = useSelector(selectColorSecondary);
  const passcode = useSelector(selectPasscode);
  const feelings = useSelector(selectFeelings);
  const places = useSelector(selectPlaces);
  const activities = useSelector(selectActivities);
  const people = useSelector(selectPeople);
  const feelingsBlocked = useSelector(selectBlockFeelings);
  const placesBlocked = useSelector(selectBlockPlaces);
  const activitiesBlocked = useSelector(selectBlockActivities);
  const peopleBlocked = useSelector(selectBlockPeople);

  return (
    <StyledSettings>
      <LoadingLine loading={settingsLoading} />
      {!isPremium && (
        <Setting
          highlight={true}
          label={"Get Haply Premium!"}
          isToggle={false}
          clickFunction={() => dispatch(showPremium())}
          icon={<FavoriteBorderIcon />}
        />
      )}
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

      <Header>Mood Choices</Header>
      <Setting
        label={"Feelings"}
        isToggle={false}
        clickFunction={() => setState({ ...state, feelingsOpen: true })}
        icon={<SentimentSatisfiedOutlinedIcon />}
      />
      <Setting
        label={"Places"}
        isToggle={false}
        clickFunction={() => setState({ ...state, placesOpen: true })}
        icon={<PlaceOutlinedIcon />}
      />
      <Setting
        label={"Activities"}
        isToggle={false}
        clickFunction={() => setState({ ...state, activitiesOpen: true })}
        icon={<DirectionsRunIcon />}
      />
      <Setting
        label={"People"}
        isToggle={false}
        clickFunction={() => setState({ ...state, peopleOpen: true })}
        icon={<PersonOutlineIcon />}
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
        label={"Passcode Protect"}
        isToggle={true}
        toggleOn={!!passcode}
        clickFunction={() => {
          if (passcode) dispatch(disablePasscode());
          else dispatch(enablePasscode(""));
        }}
        icon={<LockOutlinedIcon />}
      />
      <Setting
        label={"Theme Primary"}
        isToggle={false}
        clickFunction={() =>
          setState({ ...state, themePrimaryPopupOpen: true })
        }
        icon={<FormatPaintOutlinedIcon />}
      />
      <Setting
        label={"Theme Secondary"}
        isToggle={false}
        clickFunction={() =>
          setState({ ...state, themeSecondaryPopupOpen: true })
        }
        icon={<BrushOutlinedIcon />}
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
        open={state.feelingsOpen}
        closePopup={() => setState({ ...state, feelingsOpen: false })}
        tags={feelings}
        addTag={(tag: string) => dispatch(addFeeling(tag))}
        removeTag={(tag: string) => dispatch(removeFeeling(tag))}
        block={feelingsBlocked}
      />
      <TagPopup
        open={state.placesOpen}
        closePopup={() => setState({ ...state, placesOpen: false })}
        tags={places}
        addTag={(tag: string) => dispatch(addPlace(tag))}
        removeTag={(tag: string) => dispatch(removePlace(tag))}
        block={placesBlocked}
      />
      <TagPopup
        open={state.activitiesOpen}
        closePopup={() => setState({ ...state, activitiesOpen: false })}
        tags={activities}
        addTag={(tag: string) => dispatch(addActivity(tag))}
        removeTag={(tag: string) => dispatch(removeActivity(tag))}
        block={activitiesBlocked}
      />
      <TagPopup
        open={state.peopleOpen}
        closePopup={() => setState({ ...state, peopleOpen: false })}
        tags={people}
        addTag={(tag: string) => dispatch(addPerson(tag))}
        removeTag={(tag: string) => dispatch(removePerson(tag))}
        block={peopleBlocked}
      />
      <ThemePopup
        open={state.themePrimaryPopupOpen}
        closePopup={() => setState({ ...state, themePrimaryPopupOpen: false })}
        defaultColor={"#4071FE"}
        setTheme={(color: string) => dispatch(setColorPrimary(color))}
        currentColor={colorPrimary}
      />
      <ThemePopup
        open={state.themeSecondaryPopupOpen}
        closePopup={() =>
          setState({ ...state, themeSecondaryPopupOpen: false })
        }
        defaultColor={"#FF6584"}
        setTheme={(color: string) => dispatch(setColorSecondary(color))}
        currentColor={colorSecondary}
      />
    </StyledSettings>
  );
};

export default Settings;
