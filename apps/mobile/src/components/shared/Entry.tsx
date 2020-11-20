import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { Card } from "../../styles/Shared";
import EntryTags from "./EntryTags";
import EntryNote from "./EntryNote";
import EntryHeader from "./EntryHeader";

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
          <EntryTags tags={props.mood.tags} percent={props.mood.value / 10} />
          <EntryNote note={props.mood.note} />
        </EntryContent>
      </Card>
    </StyledEntry>
  );
};

export default Entry;
