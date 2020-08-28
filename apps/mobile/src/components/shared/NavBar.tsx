import React, { Component } from "react";
import PersonOutline from "@material-ui/icons/PersonOutline";
import TimelineOutlined from "@material-ui/icons/TimelineOutlined";
import AddOutlined from "@material-ui/icons/AddOutlined";
import BarChart from "@material-ui/icons/BarChart";
import SettingsOutlined from "@material-ui/icons/SettingsOutlined";
import styled from "styled-components";
import { Tab } from "../../models/state";

const StyledNavBar = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  height: 60px;
  width: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

type NavItemProps = {
  isActive: boolean;
};

const NavItem = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  text-decoration: none;
  color: ${(props: NavItemProps) => {
    return props.isActive ? "var(--primary)" : "var(--sub)";
  }};
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  transform: translateY(-30px);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

type Props = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  showCapture: () => void;
};

export default class NavBar extends Component<Props> {
  render() {
    return (
      <StyledNavBar data-testid="NavBar">
        <NavItem
          isActive={this.props.activeTab === Tab.Profile}
          onClick={() => this.props.setActiveTab(Tab.Profile)}
        >
          <PersonOutline />
        </NavItem>
        <NavItem
          isActive={this.props.activeTab === Tab.Entries}
          onClick={() => this.props.setActiveTab(Tab.Entries)}
        >
          <TimelineOutlined />
        </NavItem>
        <NavItem isActive={false}>
          <Circle onClick={() => this.props.showCapture()}>
            <AddOutlined />
          </Circle>
        </NavItem>
        <NavItem
          isActive={this.props.activeTab === Tab.Stats}
          onClick={() => this.props.setActiveTab(Tab.Stats)}
        >
          <BarChart />
        </NavItem>
        <NavItem
          isActive={this.props.activeTab === Tab.Settings}
          onClick={() => this.props.setActiveTab(Tab.Settings)}
        >
          <SettingsOutlined />
        </NavItem>
      </StyledNavBar>
    );
  }
}
