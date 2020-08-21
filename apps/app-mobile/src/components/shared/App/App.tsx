import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Profile from "../../tabs/Profile/Profile";
import Entries from "../../tabs/Entries/Entries";
import Capture from "../../tabs/Capture/Capture";
import Stats from "../../tabs/Stats/Stats";
import Settings from "../../tabs/Settings/Settings";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Profile} />
        <Route path="/entries" component={Entries} />
        <Route path="/capture" component={Capture} />
        <Route path="/stats" component={Stats} />
        <Route path="/settings" component={Settings} />
      </Router>
    </div>
  );
}

export default App;
