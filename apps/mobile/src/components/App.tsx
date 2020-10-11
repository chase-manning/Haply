import React, { Component, useEffect } from "react";
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
import { Mode, selectColorPrimary, selectMode } from "../state/tempSlice";
import {
  selectUser,
  setPushNotificationToken,
  setUser,
} from "../state/userSlice";
import { selectSettings } from "../state/settingsSlice";
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

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const settings = useSelector(selectSettings);
  const colorPrimary = useSelector(selectColorPrimary);
  const mode = useSelector(selectMode);

  useEffect(async () => {
    await this.loadState();

    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (!user) return;
      dispatch(setUser(user));
      await this.updatePushNotificationToken();
      this.hardUpdate();
    });

    if (!user) {
      await firebase
        .auth()
        .signInAnonymously()
        .catch(function (error) {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }

    await SettingService.createSetting(user!, settings);

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
        dispatch(setPushNotificationToken(token.value));
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
  });

  return (
    <StyledApp>
      <GlobalStyle colorPrimary={colorPrimary} mode={mode} />
      {!!user && (
        <ContentContainer>
          <Tabs />
          <Header />
          <NavBar />
        </ContentContainer>
      )}
      {false && (user?.isAnonymous || !user) && (
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
};

export default App;
