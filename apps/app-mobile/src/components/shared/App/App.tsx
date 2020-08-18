import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TabOne from "../../tabs/TabOne/TabOne";
import TabTwo from "../../tabs/TabTwo/TabTwo";

function App() {
  return (
    <Router>
      <Route exact path="/" component={TabOne} />
      <Route path="/users" component={TabTwo} />
    </Router>
  );
}

export default App;
