import React from "react";
import styled from "styled-components";

import Achievements from "./Achievements";
import Entries from "./Entries";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { Tab, selectActiveTab } from "../../state/navigationSlice";
import { NOTFOUND } from "dns";
import Mood from "../../models/mood";
import { useSelector } from "react-redux";

const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

type Props = {
  login: () => void;
  removeMood: (mood: Mood) => void;
  setColorPrimary: (colorPrimary: string) => void;
  toggleMode: () => void;
  removeTag: (tag: string) => void;
  addTag: (tag: string) => void;
};

const Tabs = (props: Props) => {
  const activeTab = useSelector(selectActiveTab);

  let tabContents;
  if (activeTab === Tab.Profile) tabContents = <Achievements />;
  else if (activeTab === Tab.Entries)
    tabContents = (
      <Entries removeMood={(mood: Mood) => props.removeMood(mood)} />
    );
  else if (activeTab === Tab.Stats) tabContents = <Analytics />;
  else if (activeTab === Tab.Settings)
    tabContents = (
      <Settings
        login={() => props.login()}
        setColorPrimary={props.setColorPrimary}
        toggleMode={() => props.toggleMode()}
        removeTag={props.removeTag}
        addTag={props.addTag}
      />
    );
  else throw NOTFOUND;

  return <StyledTabs>{tabContents}</StyledTabs>;
};

export default Tabs;
