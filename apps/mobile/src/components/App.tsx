import React from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

function App() {
  return (
    <StyledApp data-testid="App">
      <Tabs></Tabs>
      <NavBar></NavBar>
    </StyledApp>
  );
}

export default App;
