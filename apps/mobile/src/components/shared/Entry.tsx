import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { Card } from "../../styles/Shared";
import EntryNote from "./EntryNote";
import EntryHeader from "./EntryHeader";
import DynamicEntryDescription from "./DynamicEntryDescription";

const StyledEntry = styled.div`
  width: 100%;
`;

const EntryContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  mood: Mood;
};

const Entry = (props: Props) => {
  return (
    <StyledEntry>
      <Card>
        <EntryContent>
          <EntryHeader mood={props.mood} />
          <DynamicEntryDescription mood={props.mood} />
          <EntryNote note={props.mood.note} />
        </EntryContent>
      </Card>
    </StyledEntry>
  );
};

export default Entry;
