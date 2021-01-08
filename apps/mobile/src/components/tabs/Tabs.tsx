import React from "react";
import styled from "styled-components";

import Achievements from "./Achievements";
import Entries from "./Entries";
import Analytics from "./Analytics";
import Settings from "./Settings";
import {
  Tab,
  selectActiveTab,
  selectEntriesTab,
  EntriesTab,
} from "../../state/navigationSlice";
import { NOTFOUND } from "dns";
import { useSelector } from "react-redux";
import Calendar from "./Calendar";
import Pixels from "../shared/Pixels";

const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Tabs = () => {
  const activeTab = useSelector(selectActiveTab);
  const entriesTab = useSelector(selectEntriesTab);

  let tabContents;
  if (activeTab === Tab.Entries) {
    if (entriesTab === EntriesTab.Recent) tabContents = <Entries />;
    else if (entriesTab === EntriesTab.Calander) tabContents = <Calendar />;
    else if (entriesTab === EntriesTab.Pixels) tabContents = <Pixels />;
    else throw NOTFOUND;
  } else if (activeTab === Tab.Stats) tabContents = <Analytics />;
  else if (activeTab === Tab.Settings) tabContents = <Settings />;
  else throw NOTFOUND;

  return (
    <StyledTabs>
      <Achievements />
    </StyledTabs>
  );
};

export default Tabs;
