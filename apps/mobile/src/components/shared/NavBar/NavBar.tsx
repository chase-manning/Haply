import React, { Component } from "react";
import AddBox from "@material-ui/icons/AddBox";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import AccountBox from "@material-ui/icons/AccountBox";
import InsertChart from "@material-ui/icons/InsertChart";
import Settings from "@material-ui/icons/Settings";
import styled from "styled-components";

const StyledNavBar = styled.div`
  height: 10%;
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
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
          <AccountBox />
          <span>Profile</span>
        </NavItem>
        <NavItem href="/entries">
          <LibraryBooks />
          <span>Entries</span>
        </NavItem>
        <NavItem href="/capture">
          <AddBox />
          <span>Capture</span>
        </NavItem>
        <NavItem href="/stats">
          <InsertChart />
          <span>Stats</span>
        </NavItem>
        <NavItem href="/settings">
          <Settings />
          <span>Settings</span>
        </NavItem>
      </StyledNavBar>
    );
  }
}
