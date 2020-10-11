import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import {
  Tab,
  selectActiveTab,
  selectActiveTabText,
} from "../state/navigationSlice";
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
import Header from "../components/shared/Header";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { createGlobalStyle } from "styled-components";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
import PushNotificationService from "../services/PushNotificationService";
import { useSelector, useDispatch } from "react-redux";
import SettingService from "../services/SettingService";
import { Mode } from "../state/tempSlice";
const { Storage } = CapacitorPlugins;

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
  mode: Mode;
};

const GlobalStyle = createGlobalStyle`
  :root {
    --main: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "black"
        : "rgba(255,255,255,0.87)"} ;
    --sub: ;
    --sub: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "#9399A9"
        : "rgba(255,255,255,0.60)"} ;
    --sub-light: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "rgba(147,154,169, 0.1)"
        : "rgba(255,255,255,0.087)"} ;
    --primary: ${(props: GlobalSyleProps) => props.colorPrimary}; 
    --primary-light: ${(props: GlobalSyleProps) => props.colorPrimary + "22"};
    --highlight: #FF6584;
    --bg: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "white"
        : "#121212"} ;
    --bg-mid: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "white"
        : "#1F1F1F"} ;
    --bg-top: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "white"
        : "#2E2E2E"} ;
    --border: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "rgba(0,0,0,0.1)"
        : "none"} ;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }

  button {
    background: none;
    border: none;
    outline: none;
  }
`;

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 80px 0 60px 0;
  background-color: var(--bg);
`;

const OverlayContainer = styled.div`
  background-color: var(--bg);
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

  async componentDidMount() {
    await this.loadState();

    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (!user) return;
      await this.setState({ persist: { ...this.state.persist, user: user } });
      await this.updatePushNotificationToken();
      this.hardUpdate();
    });

    if (!this.state.persist.user) {
      await firebase
        .auth()
        .signInAnonymously()
        .catch(function (error) {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }

    await SettingService.createSetting(
      this.state.persist.user!,
      this.state.persist.settings
    );

    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        PushNotifications.register();
        // alert(result);
      } else {
        console.log("Push Notification Permission Failed");
        // alert("Error");
      }
    });

    PushNotifications.addListener(
      "registration",
      async (token: PushNotificationToken) => {
        // alert("Push registration success, token: " + token.value);
        await this.setState({
          persist: {
            ...this.state.persist,
            pushNotificationToken: token.value,
          },
        });
        await this.updatePushNotificationToken();
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
        //alert("Push action performed: " + JSON.stringify(notification));
      }
    );
  }

  render() {
    return (
      <StyledApp>
        <GlobalStyle
          colorPrimary={this.state.persist.colorPrimary}
          mode={this.state.persist.mode}
        />
        {!!this.state.persist.user && (
          <ContentContainer>
            <Tabs />
            <Header />
            <NavBar />
          </ContentContainer>
        )}
        {false &&
          (this.state.persist.user?.isAnonymous ||
            !this.state.persist.user) && (
            <OverlayContainer>
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebaseApp.auth()}
              />
            </OverlayContainer>
          )}
        <CreateMood />
      </StyledApp>
    );
  }

  async hardUpdate(): Promise<void> {
    await this.updateMoods();
    await this.softUpdate();
  }

  async softUpdate(): Promise<void> {
    await this.refreshStats();
    await this.refreshAchievements();
  }

  async refreshStats(): Promise<void> {
    // use think
  }

  async refreshAchievements(): Promise<void> {
    // think
  }

  async updateMoods(): Promise<void> {
    // call the thunk for it
  }

  async removeMood(mood: Mood): Promise<void> {
    // action
  }

  async addMood(mood: Mood): Promise<void> {
    // meow
  }

  async saveState(): Promise<void> {
    Storage.set({ key: "state", value: JSON.stringify(this.state.persist) });
  }

  async loadState(): Promise<void> {
    let ret: { value: any } = await Storage.get({ key: "state" });
    if (ret.value) {
      let persist: Persist = JSON.parse(ret.value);
      await this.setState({
        persist: {
          ...this.state.persist,
          ...persist,
          settings: { ...this.state.persist.settings, ...persist.settings },
        },
      });
    }
  }

  async removeTag(tag: string) {
    let tags: string[] = this.state.persist.tagOptions;
    const index = tags.indexOf(tag);
    if (index > -1) {
      tags.splice(index, 1);
    }
    await this.setState({
      persist: { ...this.state.persist, tagOptions: tags },
    });
    this.saveState();
  }

  async addTag(tag: string) {
    let tags: string[] = this.state.persist.tagOptions;
    tags.push(tag);
    await this.setState({
      persist: { ...this.state.persist, tagOptions: tags },
    });
    this.saveState();
  }

  async updatePushNotificationToken() {
    if (this.state.persist.user && this.state.persist.pushNotificationToken) {
      let response: any = await PushNotificationService.updateToken(
        this.state.persist.user!,
        this.state.persist.pushNotificationToken!
      );
      if (!response.ok) console.log("Error Creating Push Notification");
    }
  }

  async toggleRemindersEnabled(): Promise<void> {
    await this.setState({
      persist: {
        ...this.state.persist,
        settings: {
          ...this.state.persist.settings,
          remindersEnabled: !this.state.persist.settings.remindersEnabled,
        },
      },
    });
    await this.updateNextNotification();
    await this.saveState();
    await SettingService.createSetting(
      this.state.persist.user!,
      this.state.persist.settings
    );
  }

  async toggleRandomReminders(): Promise<void> {
    await this.setState({
      persist: {
        ...this.state.persist,
        settings: {
          ...this.state.persist.settings,
          randomReminders: !this.state.persist.settings.randomReminders,
        },
      },
    });
    await this.updateNextNotification();
    await this.saveState();
    await SettingService.createSetting(
      this.state.persist.user!,
      this.state.persist.settings
    );
  }

  async setReminderFrequencies(min: number, max: number): Promise<void> {
    await this.setState({
      persist: {
        ...this.state.persist,
        settings: {
          ...this.state.persist.settings,
          frequencyMinutesMin: min,
          frequencyMinutesMax: max,
        },
      },
    });
    await this.updateNextNotification();
    await this.saveState();
  }

  async updateNextNotification(): Promise<void> {
    let randomNumber: number = Math.random();
    let minutesAdded: number =
      this.state.persist.settings.frequencyMinutesMin * randomNumber +
      this.state.persist.settings.frequencyMinutesMax * (1 - randomNumber);

    let now: Date = new Date();
    await this.setState({
      persist: {
        ...this.state.persist,
        settings: {
          ...this.state.persist.settings,
          nextNotification: new Date(now.getTime() + minutesAdded * 60000),
        },
      },
    });
  }
}
