import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import EntryDescription from "./EntryDescription";

const StyledDynamicEntryDescription = styled.div`
  width: 100%;
  position: relative;
`;

type Props = {
  mood: Mood;
};
const DynamicEntryDescription = (props: Props) => {
  return (
    <StyledDynamicEntryDescription>
      <EntryDescription mood={props.mood} opacity={1} overlay={false} />
      <EntryDescription
        mood={props.mood}
        opacity={props.mood.value / 10}
        overlay={true}
      />
    </StyledDynamicEntryDescription>
  );
};

export default DynamicEntryDescription;
