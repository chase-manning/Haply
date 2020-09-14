import React, { Component } from "react";
import background from "./assets/website-background.png";
import styled from "styled-components";
import iosAppStore from "./assets/ios-app-store.svg";
import googleAppStore from "./assets/google-app-store.png";
import phone from "./assets/phone.png";

const StyledApp = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--bg);
`;

const Background = styled.img`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Content = styled.div`
  padding: 5rem;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  text-align: center;
`;

const Header = styled.h1`
  color: var(--main);
  font-size: 4rem;
`;

const SubHeader = styled.div`
  color: var(--main);
  font-size: 1.5rem;
  margin-top: 2rem;
`;

const Link = styled.a``;

const AppIcons = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 3rem;
`;

const AppIcon = styled.img`
  width: 10rem;
`;

const Phone = styled.img`
  height: 70%;
  transform: rotate(-10deg);
`;

export default class App extends Component {
  render() {
    return (
      <StyledApp>
        <Background src={background} />
        <Content>
          <Left>
            <Header>Haply Mood Tracker</Header>
            <SubHeader>
              A Mood Tracker that allows you to see your Thoughts from a
              Healthier Perspective
            </SubHeader>
            <AppIcons>
              <Link href="https://apps.apple.com/us/app/id1530768759">
                <AppIcon src={iosAppStore} />
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=haply.app">
                <AppIcon src={googleAppStore} />
              </Link>
            </AppIcons>
          </Left>
          <Phone src={phone} />
        </Content>
      </StyledApp>
    );
  }
}
