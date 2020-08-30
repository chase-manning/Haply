import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import State, { Tab } from "../models/state";
import Capture from "./overlays/Capture";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  background-color: white;
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg);
`;

export default class App extends Component {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  render() {
    const moodOverlay = this.state.moodShowing ? (
      <Capture closeCapture={() => this.setState({ moodShowing: false })} />
    ) : null;

    return (
      <StyledApp data-testid="App">
        <Header>{this.headerText}</Header>
        <TabContent>
          <Tabs activeTab={this.state.activeTab} />
        </TabContent>
        <NavBar
          activeTab={this.state.activeTab}
          setActiveTab={(tab: Tab) => this.setState({ activeTab: tab })}
          showCapture={() => {
            this.setState({ moodShowing: true });
          }}
        />
        {moodOverlay}
      </StyledApp>
    );
  }

  get headerText(): string {
    const activeTab: Tab = this.state.activeTab;
    if (activeTab === Tab.Profile) return "Profile";
    else if (activeTab === Tab.Entries) return "Entries";
    else if (activeTab === Tab.Stats) return "Stats";
    else if (activeTab === Tab.Settings) return "Settings";
    else return "Error";
  }
}
