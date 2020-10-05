import React, { Component } from "react";
import styled from "styled-components";

import Achievements from "./Achievements";
import Entries from "./Entries";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { Mode, Tab, SettingsModel } from "../../models/state";
import { NOTFOUND } from "dns";
import { User } from "firebase";
import Mood from "../../models/mood";
import { StatModel } from "../../models/StatModel";
import AchievementModel from "../../models/AchievementModel";

const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

type Props = {
  user: User;
  activeTab: Tab;
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

export default class Tabs extends Component<Props> {
  render() {
    let activeTab;
    if (this.props.activeTab === Tab.Profile)
      activeTab = (
        <Achievements
          achievements={this.props.achivements}
          moods={this.props.moods}
          user={this.props.user}
        />
      );
    else if (this.props.activeTab === Tab.Entries)
      activeTab = (
        <Entries
          removeMood={(mood: Mood) => this.props.removeMood(mood)}
          moods={this.props.moods}
          user={this.props.user}
        />
      );
    else if (this.props.activeTab === Tab.Stats)
      activeTab = (
        <Analytics
          stats={this.props.stats}
          moods={this.props.moods}
          user={this.props.user}
          colorPrimary={this.props.colorPrimary}
        />
      );
    else if (this.props.activeTab === Tab.Settings)
      activeTab = (
        <Settings
          user={this.props.user}
          login={() => this.props.login()}
          colorPrimary={this.props.colorPrimary}
          achievements={this.props.achivements}
          setColorPrimary={this.props.setColorPrimary}
          mode={this.props.mode}
          toggleMode={() => this.props.toggleMode()}
          tagOptions={this.props.tagOptions}
          removeTag={this.props.removeTag}
          addTag={this.props.addTag}
          settings={this.props.settings}
          toggleRemindersEnabled={this.props.toggleRemindersEnabled}
          toggleRandomReminders={this.props.toggleRandomReminders}
          setReminderFrequencies={this.props.setReminderFrequencies}
        />
      );
    else throw NOTFOUND;

    return <StyledTabs data-testid="Tabs">{activeTab}</StyledTabs>;
  }
}
