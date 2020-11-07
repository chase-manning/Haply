import React, { useState } from "react";
import styled from "styled-components";

const StyledTabMenu = styled.div`
  width: 100%;
  height: 100%;
`;

const Tabs = styled.div`
  width: 100%;
  display: flex;
`;

const Tab = styled.button`
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  overflow: auto;
`;

export type Tab = {
  title: string;
  content: JSX.Element;
};

type Props = {
  tabs: Tab[];
};

class State {
  tab: number = 0;
}

const TabMenu = (props: Props) => {
  const [state, setState] = useState(new State());

  return (
    <StyledTabMenu>
      <Tabs>
        {props.tabs.map((tab: Tab) => (
          <Tab>{tab.title}</Tab>
        ))}
      </Tabs>
      <Content>{props.tabs[state.tab].content}</Content>
    </StyledTabMenu>
  );
};

export default TabMenu;
