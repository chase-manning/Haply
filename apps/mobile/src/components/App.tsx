import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import State, { Tab } from "../models/state";
import Capture from "./overlays/Capture";
import firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const firebaseConfig = {
  apiKey: "AIzaSyAHtDNHcNnaty3hDN9DKkRVCTLRDVeGC0w",
  authDomain: "happiness-software.firebaseapp.com",
  databaseURL: "https://happiness-software.firebaseio.com",
  projectId: "happiness-software",
  storageBucket: "happiness-software.appspot.com",
  messagingSenderId: "293873304513",
  appId: "1:293873304513:web:49a1114e1603ed6978e540",
  measurementId: "G-0KC720H0FM",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 60px 0;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: solid 1px var(--border);
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
`;

const OverlayContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default class App extends Component {
  state: State;
  unregisterAuthObserver: any;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged((user) => {
        this.setState({ user: user });
      });

    if (this.state.user) return;
    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const moodOverlay = this.state.moodShowing ? (
      <Capture
        user={this.state.user!}
        closeCapture={() => this.setState({ moodShowing: false })}
      />
    ) : null;

    return (
      <StyledApp data-testid="App">
        {!!this.state.user && (
          <div>
            <TabContent>
              <Tabs
                user={this.state.user!}
                activeTab={this.state.activeTab}
                login={() => this.setState({ loggingIn: true })}
              />
            </TabContent>
            <Header>{this.headerText}</Header>
            <NavBar
              activeTab={this.state.activeTab}
              setActiveTab={(tab: Tab) => this.setState({ activeTab: tab })}
              showCapture={() => {
                this.setState({ moodShowing: true });
              }}
            />
            {moodOverlay}
          </div>
        )}
        {!!this.state.loggingIn &&
          (this.state.user?.isAnonymous || !this.state.user) && (
            <OverlayContainer>
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebaseApp.auth()}
              />
            </OverlayContainer>
          )}
      </StyledApp>
    );
  }

  get headerText(): string {
    const activeTab: Tab = this.state.activeTab;
    if (activeTab === Tab.Profile) return "Achievements";
    else if (activeTab === Tab.Entries) return "Entries";
    else if (activeTab === Tab.Stats) return "Stats";
    else if (activeTab === Tab.Settings) return "More";
    else return "Error";
  }
}
