import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { getTagText } from "./TagSelector";

const StyledEntryDescription = styled.div`
  width: 100%;
  font-size: 14px;
  margin-top: 10px;
`;

const Section = styled.div`
  display: inline-block;
`;

const Text = styled.div`
  color: var(--main);
  display: inline-block;
  margin-right: 3px;
`;

const Tag = styled.div`
  color: var(--primary);
  display: inline-block;
  margin-right: 3px;
  position: relative;
`;

type Props = {
  mood: Mood;
};

const EntryDescription = (props: Props) => {
  const hasFeelings = props.mood.feelings && props.mood.feelings.length > 0;
  const hasActivities =
    props.mood.activities && props.mood.activities.length > 0;
  const hasPlaces = props.mood.places && props.mood.places.length > 0;
  const hasPeople = props.mood.people && props.mood.people.length > 0;

  if (!hasFeelings && !hasActivities && !hasPlaces && !hasPeople) return null;

  return (
    <StyledEntryDescription>
      <Text>I'm</Text>
      {hasFeelings && (
        <Section>
          <Text>feeling</Text>
          <Tag>{getTagText(props.mood.feelings)}</Tag>
        </Section>
      )}
      {hasActivities && (
        <Section>
          <Text>{hasFeelings ? "while" : ""}</Text>
          <Tag>{getTagText(props.mood.activities)}</Tag>
        </Section>
      )}
      {hasPlaces && (
        <Section>
          <Text>at</Text>
          <Tag>{getTagText(props.mood.places)}</Tag>
        </Section>
      )}
      {hasPeople && (
        <Section>
          <Text>with</Text>
          <Tag>{getTagText(props.mood.people)}</Tag>
        </Section>
      )}
    </StyledEntryDescription>
  );
};

export default EntryDescription;
