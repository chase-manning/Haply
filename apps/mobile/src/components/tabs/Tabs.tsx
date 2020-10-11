import React, { Component } from "react";
import styled from "styled-components";

import Achievements from "./Achievements";
import Entries from "./Entries";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { Mode, SettingsModel } from "../../models/state";
import { Tab, selectActiveTab } from "../../state/navigationSlice";
import { NOTFOUND } from "dns";
import { User } from "firebase";
import Mood from "../../models/mood";
import { StatModel } from "../../models/StatModel";
import AchievementModel from "../../models/AchievementModel";
import { useSelector, useDispatch } from "react-redux";

const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

type Props = {
  user: User;
  login: () => void;
  moods: Mood[];
  removeMood: (mood: Mood) => void;
  stats: StatModel[];
  achivements: AchievementModel[];
  colorPrimary: string;
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

const Tabs = (props: Props) => {
  const activeTab = useSelector(selectActiveTab); //TODO should this be outside of the render line in App?

  let tabContents;
  if (activeTab === Tab.Profile)
    tabContents = <Achievements achievements={props.achivements} />;
  else if (activeTab === Tab.Entries)
    tabContents = (
      <Entries
        removeMood={(mood: Mood) => props.removeMood(mood)}
        moods={props.moods}
        user={props.user}
      />
    );
  else if (activeTab === Tab.Stats)
    tabContents = (
      <Analytics
        stats={props.stats}
        moods={props.moods}
        user={props.user}
        colorPrimary={props.colorPrimary}
      />
    );
  else if (activeTab === Tab.Settings)
    tabContents = (
      <Settings
        user={props.user}
        login={() => props.login()}
        colorPrimary={props.colorPrimary}
        achievements={props.achivements}
        setColorPrimary={props.setColorPrimary}
        mode={props.mode}
        toggleMode={() => props.toggleMode()}
        tagOptions={props.tagOptions}
        removeTag={props.removeTag}
        addTag={props.addTag}
        settings={props.settings}
        toggleRemindersEnabled={props.toggleRemindersEnabled}
        toggleRandomReminders={props.toggleRandomReminders}
        setReminderFrequencies={props.setReminderFrequencies}
      />
    );
  else throw NOTFOUND;

  return <StyledTabs>{tabContents}</StyledTabs>;
};

export default Tabs;
