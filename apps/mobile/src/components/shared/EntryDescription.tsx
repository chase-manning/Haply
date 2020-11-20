import React from "react";
import styled from "styled-components";

const StyledEntryDescription = styled.div`
  width: 100%;
`;

type Props = {
  feelings: string[];
  activities: string[];
  places: string[];
  people: string[];
  percent: number;
};

const EntryDescription = (props: Props) => {
  return <StyledEntryDescription></StyledEntryDescription>;
};

export default EntryDescription;
