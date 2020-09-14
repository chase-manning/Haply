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
};

export default class Tabs extends Component<Props> {
  render() {
    let activeTab;
    if (this.props.activeTab === Tab.Profile)
      activeTab = <Profile moods={this.props.moods} user={this.props.user} />;
    else if (this.props.activeTab === Tab.Entries)
      activeTab = (
        <Entries
          removeMood={(mood: Mood) => this.props.removeMood(mood)}
          moods={this.props.moods}
          user={this.props.user}
        />
      );
    else if (this.props.activeTab === Tab.Stats)
      activeTab = <Stats moods={this.props.moods} user={this.props.user} />;
    else if (this.props.activeTab === Tab.Settings)
      activeTab = (
        <Settings user={this.props.user} login={() => this.props.login()} />
      );
    else throw NOTFOUND;

    return <StyledTabs data-testid="Tabs">{activeTab}</StyledTabs>;
  }
}
