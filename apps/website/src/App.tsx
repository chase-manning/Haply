import React, { Component } from "react";
import styled from "styled-components";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";

const StyledApp = styled.div`
  width: 100%;
`;

export default class App extends Component {
  render() {
    return (
      <StyledApp>
        <Router>
          <Switch>
            <Route path="/privacy-policy">
              <PrivacyPolicy />
            </Route>
            <Route path="/terms-and-conditions">
              <TermsAndConditions />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </StyledApp>
    );
  }
}
