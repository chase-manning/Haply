import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";

const StyledEntryDescription = styled.div`
  width: 100%;
`;

type Props = {
  mood: Mood;
};

const EntryDescription = (props: Props) => {
  return <StyledEntryDescription></StyledEntryDescription>;
};

export default EntryDescription;
