import React, { Component } from "react";
import PersonOutline from "@material-ui/icons/PersonOutline";
import TimelineOutlined from "@material-ui/icons/TimelineOutlined";
import AddOutlined from "@material-ui/icons/AddOutlined";
import BarChart from "@material-ui/icons/BarChart";
import SettingsOutlined from "@material-ui/icons/SettingsOutlined";
import styled from "styled-components";

const StyledNavBar = styled.div`
  height: 60px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const NavItem = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  text-decoration: none;
  color: black;
`;

export default class NavBar extends Component {
  render() {
    return (
      <StyledNavBar data-testid="NavBar">
        <NavItem href="/">
          <PersonOutline />
        </NavItem>
        <NavItem href="/entries">
          <TimelineOutlined />
        </NavItem>
        <NavItem href="/capture">
          <AddOutlined />
        </NavItem>
        <NavItem href="/stats">
          <BarChart />
        </NavItem>
        <NavItem href="/settings">
          <SettingsOutlined />
        </NavItem>
      </StyledNavBar>
    );
  }
}
