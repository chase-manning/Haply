import React from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import Mood from "../../models/mood";
import { selectMoods } from "../../state/dataSlice";
import { useSelector } from "react-redux";
import LoadingLine from "../shared/LoadingLine";
import { selectMoodsLoading } from "../../state/loadingSlice";
import NoData from "../shared/NoData";
import { HideComponentProps } from "../../styles/Shared";
import { selectActiveTab, Tab } from "../../state/navigationSlice";

const StyledEntries = styled.div`
  display: ${(props: HideComponentProps) => (props.show ? "flex" : "none")};
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
`;

const Entries = () => {
  const moods = useSelector(selectMoods);
  const entriesLoading = useSelector(selectMoodsLoading);
  const activeTab = useSelector(selectActiveTab);

  return (
    <StyledEntries show={activeTab === Tab.Entries}>
      <LoadingLine loading={entriesLoading} />
      {moods.length > 0 &&
        moods
          .slice(0, 30)
          .map((mood: Mood) => (
            <Entry key={mood.id || mood.value} mood={mood} />
          ))}
      <NoData
        show={moods.length === 0}
        text={"Record how you are Feeling. New Entries will appear here."}
      />
    </StyledEntries>
  );
};

export default Entries;
