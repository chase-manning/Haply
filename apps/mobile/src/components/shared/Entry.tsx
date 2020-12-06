import React, { useState } from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { Card } from "../../styles/Shared";
import EntryNote from "./EntryNote";
import EntryHeader from "./EntryHeader";
import DynamicEntryDescription from "./DynamicEntryDescription";
import LoadingSpinner from "./LoadingSpinner";

const StyledEntry = styled.div`
  position: relative;
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
  const [loading, setLoading] = useState(false);
  return (
    <StyledEntry>
      <Card>
        <EntryContent>
          <EntryHeader
            mood={props.mood}
            load={() => setLoading(true)}
            complete={() => setLoading(false)}
          />
          <DynamicEntryDescription mood={props.mood} />
          <EntryNote note={props.mood.note} />
        </EntryContent>
        <LoadingSpinner loading={loading} />
      </Card>
    </StyledEntry>
  );
};

export default Entry;
