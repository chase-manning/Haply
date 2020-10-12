import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import CreateMood from "./overlays/CreateMood";
import Header from "../components/shared/Header";
import Login from "./shared/Login";
import GlobalStyles from "../styles/GlobalStyles";
import { User } from "firebase";
import PushNotifications from "./shared/PushNotifications";

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

class State {
  user?: User;
}

export default class App extends Component {
  state: State;
  unregisterAuthObserver: any;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  render() {
    return (
      <StyledApp>
        <PushNotifications />
        <GlobalStyles />
        {!!this.state.user && (
          <ContentContainer>
            <Tabs user={this.state.user!} />
            <Header />
            <NavBar />
          </ContentContainer>
        )}
        <Login
          user={this.state.user}
          setUser={(user: User) => this.setState({ user: user })}
        />
        <CreateMood user={this.state.user!} />
      </StyledApp>
    );
  }
}
