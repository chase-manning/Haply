import React from "react";
import styled from "styled-components";
import Achievements from "./Achievements";
import Entries from "./Entries";
import Analytics from "./Analytics";
import Settings from "./Settings";
import Calendar from "./Calendar";
import Pixels from "../shared/Pixels";

const StyledTabs = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Tabs = () => {
  return (
    <StyledTabs>
      <Achievements />
      <Entries />
      <Calendar />
      <Pixels />
      <Analytics />
      <Settings />
    </StyledTabs>
  );
};

export default Tabs;
