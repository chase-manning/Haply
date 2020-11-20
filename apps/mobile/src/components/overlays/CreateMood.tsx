import React, { useState } from "react";
import Mood from "../../models/mood";
import styled from "styled-components";
import MoodService from "../../services/MoodService";
import sadAsset from "../../assets/svgs/FeelingBlue.svg";
import happyAsset from "../../assets/svgs/SmileyFace.svg";
import okayAsset from "../../assets/svgs/YoungAndHappy.svg";
import mehAsset from "../../assets/svgs/WindyDay.svg";
import MoodSlider from "../shared/MoodSlider";
import AddNote from "../shared/AddNote";
import { useSelector, useDispatch } from "react-redux";
import {
  hideMood,
  selectMoodShowing,
  selectMoodDateSearch,
} from "../../state/navigationSlice";
import { addMood, selectMoods } from "../../state/dataSlice";
import { updateAll, updateDateSearchMoods } from "../../state/loadingSlice";
import { selectUser } from "../../state/userSlice";
import ExitBar from "../shared/ExitBar";
import { Button } from "../../styles/Shared";
import {
  selectActivities,
  selectFeelings,
  selectPeople,
  selectPlaces,
} from "../../state/settingsSlice";
import TagInput from "../shared/TagInput";

const StyledCreateMood = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg-mid);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  color: var(--main);
`;

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

const TagSelected = styled.div`
  color: var(--primary);
  display: inline-block;
  min-width: 50px;
  min-height: 30px;
  border-bottom: solid 2px var(--primary);
  margin-right: 10px;
  position: relative;
`;

const SliderSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Additions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  margin-top: 10px;
`;

class State {
  mood: number = 5;
  note: string = "";
  feelings: string[] = [];
  places: string[] = [];
  activities: string[] = [];
  people: string[] = [];
}

const CreateMood = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const moodShowing = useSelector(selectMoodShowing);
  const feelings = useSelector(selectFeelings);
  const places = useSelector(selectPlaces);
  const activities = useSelector(selectActivities);
  const people = useSelector(selectPeople);
  const user = useSelector(selectUser);
  const moods = useSelector(selectMoods);
  const dateOverride = useSelector(selectMoodDateSearch);

  const clearState = () =>
    setState({
      ...state,
      feelings: [],
      places: [],
      activities: [],
      people: [],
      note: "",
      mood: 5,
    });

  if (!moodShowing) return null;

  return (
    <StyledCreateMood>
      {moods.length > 0 && (
        <ExitBar
          exit={() => {
            dispatch(hideMood());
            clearState();
          }}
        />
      )}

      <Tags>
        <TagSection>
          <TagText>I'm feeling</TagText>
          <TagInput
            tags={feelings}
            setTags={(tags: string[]) => setState({ ...state, feelings: tags })}
            text={getTagText(state.feelings)}
          />
        </TagSection>
        <TagSection>
          <TagText>while</TagText>
          <TagInput
            tags={activities}
            setTags={(tags: string[]) =>
              setState({ ...state, activities: tags })
            }
            text={getTagText(state.activities)}
          />
        </TagSection>
        <TagSection>
          <TagText>at</TagText>
          <TagInput
            tags={places}
            setTags={(tags: string[]) => setState({ ...state, places: tags })}
            text={getTagText(state.places)}
          />
        </TagSection>
        <TagSection>
          <TagText>with</TagText>
          <TagInput
            tags={people}
            setTags={(tags: string[]) => setState({ ...state, people: tags })}
            text={getTagText(state.people)}
          />
        </TagSection>
      </Tags>

      <SliderSection>
        <MoodSlider
          value={state.mood}
          updateValue={(value: number) => {
            setState({
              ...state,
              mood: value,
            });
          }}
        />
        <Additions>
          <div />
          <AddNote
            setNote={(note: string) => setState({ ...state, note: note })}
          />
        </Additions>
        <Button
          onClick={() => {
            const mood: Mood = new Mood(
              state.mood,
              user.id,
              state.note,
              [],
              dateOverride ? new Date(dateOverride) : undefined
            );
            clearState();
            dispatch(addMood(mood));
            dispatch(hideMood());
            MoodService.createMood(user.token, mood).then(() => {
              dispatch(updateAll());
              if (dateOverride) dispatch(updateDateSearchMoods());
            });
          }}
        >
          Done
        </Button>
      </SliderSection>
    </StyledCreateMood>
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

export default CreateMood;
