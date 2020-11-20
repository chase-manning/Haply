import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  selectActivities,
  selectFeelings,
  selectPeople,
  selectPlaces,
} from "../../state/settingsSlice";
import TagInput from "../shared/TagInput";

const Tags = styled.div`
  width: 100%;
  font-size: 24px;
`;

const TagSection = styled.div`
  display: inline-block;
  margin-bottom: 5px;
`;

const TagText = styled.div`
  color: var(--main);
  display: inline-block;
  margin-right: 10px;
`;

type Props = {
  feelings: string[];
  activities: string[];
  places: string[];
  people: string[];
  setFeelingTags: (tags: string[]) => void;
  setActivitiesTags: (tags: string[]) => void;
  setPlacesTags: (tags: string[]) => void;
  setPeopleTags: (tags: string[]) => void;
};

const TagSelector = (props: Props) => {
  const feelings = useSelector(selectFeelings);
  const places = useSelector(selectPlaces);
  const activities = useSelector(selectActivities);
  const people = useSelector(selectPeople);

  return (
    <Tags>
      <TagSection>
        <TagText>I'm feeling</TagText>
        <TagInput
          tags={feelings}
          setTags={(tags: string[]) => props.setFeelingTags(tags)}
          text={getTagText(props.feelings)}
        />
      </TagSection>
      <TagSection>
        <TagText>while</TagText>
        <TagInput
          tags={activities}
          setTags={(tags: string[]) => props.setActivitiesTags(tags)}
          text={getTagText(props.activities)}
        />
      </TagSection>
      <TagSection>
        <TagText>at</TagText>
        <TagInput
          tags={places}
          setTags={(tags: string[]) => props.setPlacesTags(tags)}
          text={getTagText(props.places)}
        />
      </TagSection>
      <TagSection>
        <TagText>with</TagText>
        <TagInput
          tags={people}
          setTags={(tags: string[]) => props.setPeopleTags(tags)}
          text={getTagText(props.people)}
        />
      </TagSection>
    </Tags>
  );
};

const getTagText = (tags: string[]) => {
  if (tags.length === 0) return "";
  if (tags.length === 1) return tags[0];
  let text: string = "";
  tags.forEach((tag: string) => {
    if (tags.indexOf(tag) === tags.length - 1) text += tag;
    else if (tags.indexOf(tag) === tags.length - 2) text += tag + " & ";
    else text += tag + ", ";
  });
  return text;
};

export default TagSelector;
