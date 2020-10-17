import React from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import CreateMood from "./overlays/CreateMood";
import Header from "../components/shared/Header";
import Login from "./shared/Login";
import GlobalStyles from "../styles/GlobalStyles";
import { useSelector } from "react-redux";
import { selectUser } from "../state/userSlice";
import PushNotificationSetup from "./shared/PushNotifications";

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
  const user = useSelector(selectUser);
  return (
    <StyledApp>
    <PushNotificationSetup />
      <GlobalStyles />
      {user.token !== "" && (
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
