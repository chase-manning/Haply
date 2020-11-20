import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { getTagText } from "./TagSelector";

const StyledEntryDescription = styled.div`
  width: 100%;
  font-size: 14px;
  margin-top: 10px;
  color: var(--main);
`;

const Tag = styled.span`
  color: var(--primary);
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
      {"I'm "}
      {hasFeelings && (
        <span>
          {"feeling "}
          <Tag>{getTagText(props.mood.feelings)}</Tag>{" "}
        </span>
      )}
      {hasActivities && (
        <span>
          {hasFeelings ? "while " : ""}
          <Tag>{getTagText(props.mood.activities)}</Tag>{" "}
        </span>
      )}
      {hasPlaces && (
        <span>
          {"at "}
          <Tag>{getTagText(props.mood.places)}</Tag>{" "}
        </span>
      )}
      {hasPeople && (
        <span>
          {"with "}
          <Tag>{getTagText(props.mood.people)}</Tag>{" "}
        </span>
      )}
    </StyledEntryDescription>
  );
};

export default EntryDescription;
