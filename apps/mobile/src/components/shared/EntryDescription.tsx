import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";

const StyledEntryDescription = styled.div`
  width: 100%;
  font-size: 16px;
`;

const Text = styled.div`
  color: var(--main);
  display: inline-block;
  margin-right: 10px;
`;

const Tag = styled.div`
  color: var(--primary);
  display: inline-block;
  min-width: 50px;
  min-height: 28px;
  border-bottom: solid 2px var(--primary);
  margin-right: 10px;
  position: relative;
`;

type Props = {
  mood: Mood;
};

const EntryDescription = (props: Props) => {
  return <StyledEntryDescription></StyledEntryDescription>;
};

export default EntryDescription;
