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

type TabProps = {
  active: boolean;
};

const Tab = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-mid);
  padding: 20px;
  color: ${(props: TabProps) =>
    props.active ? "var(--primary)" : "var(--main)"};
  border-bottom: ${(props: TabProps) =>
    props.active ? "solid 4px var(--primary)" : "solid 4px var(--bg-mid)"};
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
        {props.tabs.map((tab: Tab, index: number) => (
          <Tab
            onClick={() => setState({ ...state, tab: index })}
            active={state.tab === index}
          >
            {tab.title}
          </Tab>
        ))}
      </Tabs>
      <Content>{props.tabs[state.tab].content}</Content>
    </StyledTabMenu>
  );
};

export default TabMenu;
