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
import { selectActiveTab, Tab } from "../state/navigationSlice";

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

type ContentContainerProps = {
  tabbedPage: boolean;
};

const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: ${(props: ContentContainerProps) =>
    props.tabbedPage ? "113px 0 60px 0" : "80px 0 60px 0"};
  background-color: var(--bg);
`;

const App = () => {
  const loading = useSelector(selectDataLoading);
  const loadingPercent = useSelector(selectLoadingPercent);
  const activeTab = useSelector(selectActiveTab);

  return (
    <StyledApp>
      <PushNotificationSetup />
      <GlobalStyles />
      {!loading && (
        <ContentContainer tabbedPage={activeTab === Tab.Entries}>
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
      <LoadingScreen loading={loading} percentComplete={loadingPercent} />
      <Welcome />
    </StyledApp>
  );
};

export default App;
