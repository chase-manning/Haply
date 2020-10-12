import React, { useEffect } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import CreateMood from "./overlays/CreateMood";
import Header from "../components/shared/Header";
import { Plugins, PushNotificationToken } from "@capacitor/core";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setPushNotificationToken } from "../state/userSlice";
import Login from "./shared/Login";
import GlobalStyles from "../styles/GlobalStyles";

const { PushNotifications } = Plugins;

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

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) PushNotifications.register();
    });

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        dispatch(setPushNotificationToken(token.value));
      }
    );
  });

  return (
    <StyledApp>
      <GlobalStyles />
      {!!user && (
        <ContentContainer>
          <Tabs />
          <Header />
          <NavBar />
        </ContentContainer>
      )}
      <Login />
      <CreateMood />
    </StyledApp>
  );
};

export default App;
