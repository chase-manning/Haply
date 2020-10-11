import React, { Component } from "react";
import EmojiEventsOutlined from "@material-ui/icons/EmojiEventsOutlined";
import TimelineOutlined from "@material-ui/icons/TimelineOutlined";
import AddOutlined from "@material-ui/icons/AddOutlined";
import BarChart from "@material-ui/icons/BarChart";
import MenuOutlined from "@material-ui/icons/MenuOutlined";
import styled from "styled-components";
import {
  Tab,
  selectActiveTab,
  setActiveTab,
  showMood,
} from "../../state/navigationSlice";
import { useSelector, useDispatch } from "react-redux";

const StyledNavBar = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  height: 60px;
  width: 100%;
  background-color: var(--bg-top);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-top: solid 1px var(--border);
`;

type NavItemProps = {
  isActive: boolean;
};

const NavItem = styled.button`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-decoration: none;
  color: ${(props: NavItemProps) => {
    return props.isActive ? "var(--primary)" : "var(--sub)";
  }};
`;

const CircleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Circle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  display: flex;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--bg);
  transform: translateY(-30px);
`;

const NavBar = () => {
  const activeTab = useSelector(selectActiveTab);
  const dispatch = useDispatch();

  return (
    <StyledNavBar data-testid="NavBar">
      <NavItem
        isActive={activeTab === Tab.Profile}
        onClick={() => dispatch(setActiveTab(Tab.Profile))}
      >
        <EmojiEventsOutlined />
      </NavItem>
      <NavItem
        isActive={activeTab === Tab.Entries}
        onClick={() => dispatch(setActiveTab(Tab.Entries))}
      >
        <TimelineOutlined />
      </NavItem>
      <CircleContainer>
        <Circle onClick={() => dispatch(showMood())}>
          <AddOutlined />
        </Circle>
      </CircleContainer>
      <NavItem
        isActive={activeTab === Tab.Stats}
        onClick={() => dispatch(setActiveTab(Tab.Stats))}
      >
        <BarChart />
      </NavItem>
      <NavItem
        isActive={activeTab === Tab.Settings}
        onClick={() => dispatch(setActiveTab(Tab.Settings))}
      >
        <MenuOutlined />
      </NavItem>
    </StyledNavBar>
  );
};

export default NavBar;
