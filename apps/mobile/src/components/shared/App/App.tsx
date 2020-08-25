import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Profile from "../../tabs/Profile/Profile";
import Entries from "../../tabs/Entries/Entries";
import Capture from "../../tabs/Capture/Capture";
import Stats from "../../tabs/Stats/Stats";
import Settings from "../../tabs/Settings/Settings";
import styled from "styled-components";

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 90%;
  width: 100%;
`;

function App() {
  return (
    <StyledApp className="App">
      <Router>
        <Route exact path="/" component={Profile} />
        <Route path="/entries" component={Entries} />
        <Route path="/capture" component={Capture} />
        <Route path="/stats" component={Stats} />
        <Route path="/settings" component={Settings} />
      </Router>
    </StyledApp>
  );
}

export default App;
