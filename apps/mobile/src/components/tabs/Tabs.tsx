import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";

import Profile from "./Profile";
import Entries from "./Entries";
import Capture from "../overlays/Capture";
import Stats from "./Stats";
import Settings from "./Settings";

const StyledTabs = styled.div`
  height: 100%;
  width: 100%;
`;

export default class Tabs extends Component {
  render() {
    return (
      <StyledTabs data-testid="Tabs">
        <Router>
          <Route exact path="/" component={Profile} />
          <Route path="/entries" component={Entries} />
          <Route path="/capture" component={Capture} />
          <Route path="/stats" component={Stats} />
          <Route path="/settings" component={Settings} />
        </Router>
      </StyledTabs>
    );
  }
}
