import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActiveTabText,
  EntriesTab,
  selectEntriesTab,
  selectActiveTab,
  Tab,
  setEntriesTab,
} from "../../state/navigationSlice";

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-top);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: var(--shadow);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const HeaderText = styled.div`
  width: 100%;
  margin-top: 35px;
  margin-bottom: 25px;
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

const Tabs = styled.div`
  width: 100%;
  display: flex;
`;

type TabProps = {
  active: boolean;
};

const TabItem = styled.button`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props: TabProps) => (props.active ? "var(--main)" : "var(--sub)")};
`;

function Header() {
  const dispatch = useDispatch();
  const headerText: string = useSelector(selectActiveTabText);
  const activeTab: Tab = useSelector(selectActiveTab);
  const entriesTab: EntriesTab = useSelector(selectEntriesTab);

  return (
    <StyledHeader>
      <HeaderText>{headerText}</HeaderText>
      {activeTab === Tab.Entries && (
        <Tabs>
          <TabItem
            active={entriesTab === EntriesTab.Recent}
            onClick={() => dispatch(setEntriesTab(EntriesTab.Recent))}
          >
            Recent
          </TabItem>
          <TabItem
            active={entriesTab === EntriesTab.Calander}
            onClick={() => dispatch(setEntriesTab(EntriesTab.Calander))}
          >
            Calander
          </TabItem>
        </Tabs>
      )}
    </StyledHeader>
  );
}

export default Header;
