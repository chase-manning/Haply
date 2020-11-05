import React from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import CreateMood from "./overlays/CreateMood";
import Header from "../components/shared/Header";
import Login from "./shared/Login";
import GlobalStyles from "../styles/GlobalStyles";
import { useSelector } from "react-redux";
import PushNotificationSetup from "./shared/PushNotifications";
import { selectDataLoading, selectLoadingPercent } from "../state/loadingSlice";
import LoadingScreen from "./shared/LoadingScreen";
import Alerts from "./shared/Alerts";
import Premium from "./shared/Premium";
import Error from "./shared/Error";
import Welcome from "./shared/Welcome";

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
  const loading = useSelector(selectDataLoading);
  const loadingPercent = useSelector(selectLoadingPercent);

  return (
    <StyledApp>
      <PushNotificationSetup />
      <GlobalStyles />
      <LoadingScreen loading={loading} percentComplete={loadingPercent} />
      {!loading && (
        <ContentContainer>
          <Tabs />
          <Header />
          <NavBar />
        </ContentContainer>
      )}
      <Login />
      <CreateMood />
      <Alerts />
      <Premium />
      <Error />
      <Welcome />
    </StyledApp>
  );
};

export default App;
