import React from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import Mood from "../../models/mood";
import { selectMoods } from "../../state/dataSlice";
import { useSelector } from "react-redux";
import LoadingLine from "../shared/LoadingLine";
import { selectMoodsLoading } from "../../state/loadingSlice";
import NoData from "../shared/NoData";

const StyledEntries = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
`;

const Entries = () => {
  const moods = useSelector(selectMoods);
  const entriesLoading = useSelector(selectMoodsLoading);

  return (
    <StyledEntries>
      <LoadingLine loading={entriesLoading} />
      {moods.length > 0 &&
        moods
          .slice(0, 30)
          .map((mood: Mood) => (
            <Entry key={mood.moodId || mood.value} mood={mood} />
          ))}
      <NoData
        show={moods.length === 0}
        text={"Record how you are Feeling. New Entries will appear here."}
      />
    </StyledEntries>
  );
};

export default Entries;
