import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import State, { Tab } from "../models/state";
import CreateMood from "./overlays/CreateMood";
import firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import MoodService from "../services/MoodService";
import Mood, { MoodResponse } from "../models/mood";
import { StatModel } from "../models/StatModel";
import StatService from "../services/StatService";
import AchievementService from "../services/AchievementService";
import AchievementModel from "../models/AchievementModel";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { createGlobalStyle } from "styled-components";

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

const { PushNotifications } = Plugins;

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

type GlobalSyleProps = {
  colorPrimary: string;
};

const GlobalStyle = createGlobalStyle`
  :root {
    --main: black;
    --sub: #9399A9;
    --sub-light: rgba(147,154,169, 0.1);
    --primary: ${(props: GlobalSyleProps) => props.colorPrimary}; 
    --primary-light: ${(props: GlobalSyleProps) => props.colorPrimary + "18"};
    --highlight: #FF6584;
    --bg: #F9FAFC;
    --border: rgba(0,0,0,0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }
`;

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
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

const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 60px 0;
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
    firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });
      this.hardUpdate();
    });

    if (this.state.user) return;
    firebase
      .auth()
      .signInAnonymously()
      .then((meow: any) => {
        console.log("memqmqm");
        console.log(meow);
      })
      .catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });

    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        PushNotifications.register();
      } else {
        console.log("Push Notification Permission Failed");
        // alert("Error");
      }
    });

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        // alert("Push registration success, token: " + token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      // alert("Error on registration: " + JSON.stringify(error));
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        // alert("Push received: " + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        // alert("Push action performed: " + JSON.stringify(notification));
      }
    );
  }

  render() {
    return (
      <StyledApp data-testid="App">
        <GlobalStyle colorPrimary={this.state.colorPrimary} />
        {!!this.state.user && (
          <ContentContainer>
            <Tabs
              achivements={this.state.achievements}
              stats={this.state.stats}
              moods={this.state.moods}
              user={this.state.user!}
              activeTab={this.state.activeTab}
              login={() => this.setState({ loggingIn: true })}
              removeMood={(mood: Mood) => this.removeMood(mood)}
              colorPrimary={this.state.colorPrimary}
              setColorPrimary={(colorPrimary: string) =>
                this.setState({ colorPrimary: colorPrimary })
              }
            />
            <Header>{this.headerText}</Header>
            <NavBar
              activeTab={this.state.activeTab}
              setActiveTab={(tab: Tab) => this.setState({ activeTab: tab })}
              showCapture={() => {
                this.setState({ moodShowing: true });
              }}
            />
          </ContentContainer>
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
        {this.state.moodShowing && (
          <CreateMood
            addMood={(mood: Mood) => this.addMood(mood)}
            user={this.state.user!}
            closeCapture={() => this.setState({ moodShowing: false })}
            tabOptions={this.state.tabOptions}
          />
        )}
      </StyledApp>
    );
  }

  get headerText(): string {
    const activeTab: Tab = this.state.activeTab;
    if (activeTab === Tab.Profile) return "Achievements";
    else if (activeTab === Tab.Entries) return "Entries";
    else if (activeTab === Tab.Stats) return "Analytics";
    else if (activeTab === Tab.Settings) return "More";
    else return "Error";
  }

  async hardUpdate(): Promise<void> {
    await this.updateMoods();
    await this.softUpdate();
  }

  async softUpdate(): Promise<void> {
    const stats: StatModel[] = StatService.getStats(this.state.moods);
    this.setState({ stats: stats });
    const achievements: AchievementModel[] = AchievementService.getAchievements(
      this.state.moods
    );
    this.setState({ achievements: achievements });
  }

  async updateMoods(): Promise<void> {
    const response: any = await MoodService.getMoods(this.state.user!, "date");
    const moodResponses: MoodResponse[] = await response.json();

    let moods: Mood[] = [];
    moodResponses.forEach((moodResponse: MoodResponse) => {
      moods.push(
        new Mood(
          moodResponse.data.value,
          moodResponse.data.userId,
          moodResponse.data.note,
          moodResponse.data.tags,
          moodResponse.data.date,
          moodResponse.id
        )
      );
    });

    this.setState({ moods: moods });
  }

  removeMood(mood: Mood): void {
    let moods: Mood[] = this.state.moods;
    const index = moods.indexOf(mood);
    if (index > -1) {
      moods.splice(index, 1);
    }
    this.setState({ moods: moods });
    this.softUpdate();
  }

  addMood(mood: Mood): void {
    let moods: Mood[] = this.state.moods;
    moods.unshift(mood);
    this.setState({ moods: moods });
    this.softUpdate();
  }
}
