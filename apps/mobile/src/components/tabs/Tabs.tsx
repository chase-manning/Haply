import React, { Component } from "react";
import styled from "styled-components";

import Profile from "./Profile";
import Entries from "./Entries";
import Stats from "./Stats";
import Settings from "./Settings";
import { Tab } from "../../models/state";
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
};

export default class Tabs extends Component<Props> {
  render() {
    let activeTab;
    if (this.props.activeTab === Tab.Profile)
      activeTab = (
        <Profile
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
        <Stats
          stats={this.props.stats}
          moods={this.props.moods}
          user={this.props.user}
        />
      );
    else if (this.props.activeTab === Tab.Settings)
      activeTab = (
        <Settings user={this.props.user} login={() => this.props.login()} />
      );
    else throw NOTFOUND;

    return <StyledTabs data-testid="Tabs">{activeTab}</StyledTabs>;
  }
}
