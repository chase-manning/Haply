import React from "react";
import styled from "styled-components";

import Achievements from "./Achievements";
import Entries from "./Entries";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { Tab, selectActiveTab } from "../../state/navigationSlice";
import { NOTFOUND } from "dns";
import { useSelector } from "react-redux";
import { User } from "firebase";

const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

type Props = {
  user: User;
};

const Tabs = (props: Props) => {
  const activeTab = useSelector(selectActiveTab);

  let tabContents;
  if (activeTab === Tab.Profile) tabContents = <Achievements />;
  else if (activeTab === Tab.Entries)
    tabContents = <Entries user={props.user} />;
  else if (activeTab === Tab.Stats) tabContents = <Analytics />;
  else if (activeTab === Tab.Settings)
    tabContents = <Settings user={props.user} />;
  else throw NOTFOUND;

  return <StyledTabs>{tabContents}</StyledTabs>;
};

export default Tabs;
